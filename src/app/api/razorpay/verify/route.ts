import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, admin } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId, projectId, amount, requestId } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || (!projectId && !requestId) || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay secret key not found" }, { status: 500 });
    }

    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await db.collection("payments").doc(razorpay_order_id).set({
        status: "failed",
        failureReason: "Invalid signature",
      }, { merge: true });
      return NextResponse.json({ error: "Invalid payment signature", success: false }, { status: 400 });
    }

    // 2. Atomic Update using Transaction
    let clientName = "A client";
    let serviceTitle = "a service";

    await db.runTransaction(async (transaction) => {
      // Get User Info
      const userRef = db.collection("users").doc(userId);
      const userDoc = await transaction.get(userRef);
      if (userDoc.exists) {
        clientName = userDoc.data()?.displayName || userDoc.data()?.name || userDoc.data()?.email || "A client";
      }

      if (requestId) {
        // CASE A: PAYMENT REQUEST
        const requestRef = db.collection("paymentRequests").doc(requestId);
        const requestDoc = await transaction.get(requestRef);
        if (!requestDoc.exists) throw new Error("Payment request not found.");

        const reqData = requestDoc.data()!;
        serviceTitle = reqData.title || "Manual Invoice";

        transaction.update(requestRef, {
          status: "paid",
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          razorpay_payment_id,
          razorpay_order_id
        });
      } else {
        // CASE B: PROJECT BALANCE PAYMENT
        const stringProjectId = String(projectId);
        let collectionName = "projects";
        let projectRef = db.collection("projects").doc(stringProjectId);
        let projectDoc = await transaction.get(projectRef);

        // Fallback to projectTracker if not in legacy projects
        if (!projectDoc.exists) {
          projectRef = db.collection("projectTracker").doc(stringProjectId);
          projectDoc = await transaction.get(projectRef);
          collectionName = "projectTracker";
        }

        if (!projectDoc.exists) {
          throw new Error(`Project ${stringProjectId} not found in records.`);
        }

        const pData = projectDoc.data()!;
        serviceTitle = pData.clientProject?.projectName || pData.projectName || pData.title || `Project ${stringProjectId}`;

        let totalAmount = 0;
        let currentPaid = 0;

        if (collectionName === "projectTracker") {
          totalAmount = parseFloat(pData.clientProject?.totalAmount) || 0;
          currentPaid = parseFloat(pData.clientProject?.receivedAmount) || 0;
        } else {
          totalAmount = parseFloat(pData.totalAmount) || 0;
          currentPaid = parseFloat(pData.paidAmount) || 0;
        }

        const newPaidAmount = currentPaid + parseFloat(amount);
        const remainingBalance = totalAmount - newPaidAmount;

        if (collectionName === "projectTracker") {
          const newStatus = (newPaidAmount >= totalAmount || remainingBalance <= 0) ? "paid" : "partial";

          transaction.update(projectRef, {
            "clientProject.receivedAmount": Math.round(newPaidAmount),
            "clientProject.paymentStatus": newStatus,
            "clientProject.lastPaymentAt": admin.firestore.FieldValue.serverTimestamp(),
            // Log this transaction in payment history
            paymentHistory: admin.firestore.FieldValue.arrayUnion({
              amount: parseFloat(amount),
              method: "Online",
              date: new Date().toISOString(),
              note: `Razorpay Payment ID: ${razorpay_payment_id}. Verified Online Payment.`
            })
          });
        } else {
          const newStatus = (newPaidAmount >= totalAmount || remainingBalance <= 0) ? "paid" : "partial_paid";
          transaction.update(projectRef, {
            paidAmount: Math.round(newPaidAmount),
            paymentStatus: newStatus,
            lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      // Update Payment Record
      const paymentRef = db.collection("payments").doc(razorpay_order_id);
      transaction.set(paymentRef, {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success",
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    // 🔔 Send Admin Notification for Payment Received
    try {
      const notificationTitle = "Payment Received ✅";
      const notificationMessage = `₹${amount} received from ${clientName} for ${serviceTitle}.`;

      // 1. Create entry in Notifications for Admin History
      await db.collection("notifications").add({
        title: notificationTitle,
        message: notificationMessage,
        type: "payment_received",
        clientName,
        amount,
        serviceName: serviceTitle,
        receiverType: "admin", // Identifier for admin view
        receiverId: "all_admins",
        isRead: false,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clickAction: "/dashboard/admin?tab=payments"
      });

      // 2. Broadcast Push Notification to all Admins
      const adminsSnapshot = await db.collection("users").where("role", "==", "admin").get();
      const adminFCMTokens = adminsSnapshot.docs
        .map(doc => doc.data().fcmToken)
        .filter(token => !!token);

      if (adminFCMTokens.length > 0) {
        // We'll call the internal fetch to avoid duplication or use Firebase admin directly
        // Given we are in internal API, we can use fetch to /api/send-fcm but it's cleaner to handle batch
        for (const token of adminFCMTokens) {
          // Fire and forget requests
          fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://thestudysmith.com'}/api/send-fcm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              title: notificationTitle,
              body: notificationMessage,
              clickAction: "/dashboard/admin?tab=payments",
              data: {
                type: "payment_received",
                redirectUrl: "/dashboard/admin?tab=payments"
              }
            })
          }).catch(err => console.error("Admin FCM Push Error:", err));
        }
      }
    } catch (notifErr) {
      console.error("Error creating admin notification:", notifErr);
    }

    return NextResponse.json({ message: "Payment verified and admin notified", success: true });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
