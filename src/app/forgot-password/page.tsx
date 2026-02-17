"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import { Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const email = (formData.get("email") as string).trim().toLowerCase();

        if (!email) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err: any) {
            console.error("Password reset error:", err);
            let errorMessage = "Failed to send reset email. Please try again.";

            if (err.code === "auth/user-not-found") {
                // For security reasons, it's often better not to reveal if a user exists, 
                // but for better UX in some apps, we might say "Email not found".
                // Firebase often doesn't throw user-not-found depending on config, but if it does:
                errorMessage = "We couldn't find an account with that email address.";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "The email address is invalid.";
            } else if (err.code === "auth/too-many-requests") {
                errorMessage = "Too many attempts. Please try again later.";
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
            <TechBackground />
            <Navbar />

            <main className="flex-grow flex items-center justify-center pt-28 pb-12 px-4 relative z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

                        {/* Header */}
                        <div className="bg-slate-900 p-8 text-center">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Reset Password
                            </h1>
                            <p className="text-blue-200 text-sm">
                                Enter your email to receive a reset link
                            </p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex items-center gap-2">
                                    <CheckCircle size={18} />
                                    Check your email for the password reset link.
                                </div>
                            )}

                            {!success ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                suppressHydrationWarning
                                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        suppressHydrationWarning
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex justify-center gap-2 hover:bg-blue-700 transition"
                                    >
                                        {loading ? "Sending..." : <>Send Reset Link <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center">
                                    <p className="text-slate-600 mb-6">
                                        We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-block w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            )}

                            {!success && (
                                <p className="text-sm text-center text-slate-500 mt-6">
                                    Remember your password?{" "}
                                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
