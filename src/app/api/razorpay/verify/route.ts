import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, admin } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId, courseId } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay secret key not found" }, { status: 500 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isVerified = expectedSignature === razorpay_signature;

    if (isVerified) {
      // Use Firestore Transactions to ensure data consistency and prevent duplicate access
      await db.runTransaction(async (transaction) => {
        // 1. Check for duplicate course access
        const accessRef = db.collection("userCourses").doc(`${userId}_${courseId}`);
        const accessDoc = await transaction.get(accessRef);

        if (accessDoc.exists && accessDoc.data()?.purchased) {
          // If already exists, we'll still update the payment for tracking but skip granting access
          console.warn(`User ${userId} already has access to course ${courseId}`);
        } else {
          // If NOT exists, grant access
          transaction.set(accessRef, {
            userId,
            courseId,
            purchased: true,
            purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // 2. Update the pending payment record or create if not found (e.g. if order creation record failed)
        const paymentRef = db.collection("payments").doc(razorpay_order_id);
        transaction.set(paymentRef, {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "success",
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          // Merge with existing fields if any (userId/courseId should already be there from order route)
        }, { merge: true });
      });

      return NextResponse.json({ message: "Payment verified and course granted successfully", success: true });
    } else {
      // Optionally store the failed attempt
      await db.collection("payments").doc(razorpay_order_id).set({
        paymentId: razorpay_payment_id,
        status: "failed",
        failureReason: "Invalid signature",
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      return NextResponse.json({ error: "Invalid payment signature", success: false }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
