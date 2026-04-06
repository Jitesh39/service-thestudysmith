import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/firebase-admin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, userId, projectId, currency = "INR" } = await req.json();

    if (!amount || !userId || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify project exists
    const projectSnap = await db.collection("projects").doc(projectId).get();
    if (!projectSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Razorpay receives amounts in paise
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `project_${projectId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save pending payment record
    await db.collection("payments").doc(order.id).set({
      userId,
      projectId,
      orderId: order.id,
      amount,
      currency,
      status: "pending",
      paidAt: null,
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
