"use client";

import React from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

const FailedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center ring-1 ring-rose-100"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
            className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-inner ring-4 ring-rose-50"
          >
            <XCircle className="w-12 h-12 text-rose-600" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Payment Failed</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          We couldn't process your payment. This could be due to a technical error or an issue with your payment method. Please try again or contact support if the issue persists.
        </p>

        <div className="space-y-4">
          <Link
            href="/courses"
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-95 text-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full px-6 py-3 text-slate-500 hover:text-slate-800 font-medium transition-colors text-center"
          >
            Go Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default FailedPage;
