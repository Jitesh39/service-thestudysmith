import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/firebase-admin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, userId, courseId, currency = "INR" } = await req.json();

    if (!amount || !userId || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Razorpay receives amounts in paise (multiply by 100)
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save pending payment record to Firestore
    await db.collection("payments").doc(order.id).set({
      userId,
      courseId,
      orderId: order.id,
      amount,
      currency,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
