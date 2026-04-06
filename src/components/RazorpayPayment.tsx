"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PaymentProps {
  amount: number;
  userId: string;
  courseId: string;
  courseName: string;
  userEmail: string;
}

export default function RazorpayPayment({ amount, userId, courseId, courseName, userEmail }: PaymentProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Dynamically load Razorpay SDK script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, userId, courseId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order creation failed");

      // 2. Open Razorpay Checkout popup
      const options = {
        key: data.key, // Razorpay Key ID
        amount: data.amount, // Amount in paise
        currency: data.currency,
        name: "The Study Smith",
        description: `Purchase of ${courseName}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify payment on backend after user successfully pays
          try {
            const verificationRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                courseId,
              }),
            });

            const verificationData = await verificationRes.json();

            if (verificationRes.ok && verificationData.success) {
              // Redirect to success page
              router.push("/success");
            } else {
              // Redirect to failure page
              router.push("/failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            router.push("/failed");
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        router.push("/failed");
      });

      rzp.open();
    } catch (error) {
      console.error("Initialization error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 active:scale-95 ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
      }`}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        "Pay Now"
      )}
    </button>
  );
}
