import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/firebase-admin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, userId, projectId, requestId, currency = "INR" } = await req.json();

    if (!amount || !userId || (!projectId && !requestId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let receipt = "";
    if (requestId) {
      // Verify payment request exists
      const requestSnap = await db.collection("paymentRequests").doc(requestId).get();
      if (!requestSnap.exists) {
        return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
      }
      receipt = `req_${requestId}_${Date.now()}`;
    } else {
      // Verify project exists - explicitly cast projectId to string
      const stringProjectId = String(projectId);
      const projectSnap = await db.collection("projects").doc(stringProjectId).get();
      if (!projectSnap.exists) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      receipt = `project_${projectId}_${Date.now()}`;
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);

    // Save pending payment record
    await db.collection("payments").doc(order.id).set({
      userId,
      projectId: projectId || null,
      requestId: requestId || null,
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
