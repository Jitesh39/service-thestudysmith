import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, admin } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId, projectId, amount } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !projectId || !amount) {
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
    await db.runTransaction(async (transaction) => {
      const projectRef = db.collection("projects").doc(projectId);
      const projectDoc = await transaction.get(projectRef);

      if (!projectDoc.exists) {
        throw new Error("Project not found in records.");
      }

      const pData = projectDoc.data()!;
      const totalAmount = parseFloat(pData.totalAmount) || 0;
      const currentPaid = parseFloat(pData.paidAmount) || 0;
      const newPaidAmount = currentPaid + parseFloat(amount);

      // Determine new status
      let newStatus = "partial";
      if (newPaidAmount >= totalAmount) {
        newStatus = "paid";
      }

      // Update Project
      transaction.update(projectRef, {
        paidAmount: newPaidAmount,
        paymentStatus: newStatus,
        lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update Payment Record
      const paymentRef = db.collection("payments").doc(razorpay_order_id);
      transaction.set(paymentRef, {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success",
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    return NextResponse.json({ message: "Payment verified and project updated successfully", success: true });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
