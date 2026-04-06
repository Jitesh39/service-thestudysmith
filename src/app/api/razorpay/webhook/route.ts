import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, admin } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const { RAZORPAY_WEBHOOK_SECRET } = process.env;

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not set. Skipping webhook verification.");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle payment.captured event
    if (body.event === "payment.captured") {
      const { order_id, id: payment_id } = body.payload.payment.entity;

      // Use a transaction for consistent updates via webhook too
      await db.runTransaction(async (transaction) => {
        const paymentRef = db.collection("payments").doc(order_id);
        const paymentDoc = await transaction.get(paymentRef);

        if (paymentDoc.exists && paymentDoc.data()?.status !== "success") {
          const { userId, courseId } = paymentDoc.data()!;

          // 1. Mark as success
          transaction.update(paymentRef, {
            paymentId: payment_id,
            status: "success",
            webhookCapturedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // 2. Grant access
          const accessRef = db.collection("userCourses").doc(`${userId}_${courseId}`);
          transaction.set(accessRef, {
            userId,
            courseId,
            purchased: true,
            purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
