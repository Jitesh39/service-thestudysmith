"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            let role = "client";

            if (!userDoc.exists()) {
                // Create new user document
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: "client",
                    createdAt: serverTimestamp(),
                });
            } else {
                role = userDoc.data()?.role || "client";
            }

            // Reset dashboard view to overview on fresh login
            localStorage.removeItem("clientActiveSection");
            localStorage.removeItem("adminActiveSection");

            if (role === "admin" || role === "Team_Member") {
                router.push("/dashboard/admin");
            } else {
                router.push(`/dashboard/${role}`);
            }
        } catch (err: any) {
            console.error("Google sign-in error:", err);
            setError("Failed to sign in with Google. Please try again.");
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = (formData.get("email") as string).trim().toLowerCase();
        const password = formData.get("password") as string;

        if (!email || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (!userCredential.user.emailVerified) {
                await signOut(auth);
                setError("Please verify your email address before logging in.");
                setLoading(false);
                return;
            }

            // Fetch user role from Firestore
            const userDocRef = doc(db, "users", userCredential.user.uid);
            const userDoc = await getDoc(userDocRef);

            let role = "client";

            if (userDoc.exists()) {
                role = userDoc.data().role || "client";
            } else {
                // Should not happen for new signups, but safe fallback
                await setDoc(userDocRef, {
                    uid: userCredential.user.uid,
                    email: email,
                    role: "client",
                    createdAt: serverTimestamp(),
                });
            }

            // Reset dashboard view to overview on fresh login
            localStorage.removeItem("clientActiveSection");
            localStorage.removeItem("adminActiveSection");

            if (role === "admin" || role === "Team_Member") {
                router.push("/dashboard/admin");
            } else {
                router.push(`/dashboard/${role}`);
            }

        } catch (err: any) {
            console.error("Login error:", err);

            let errorMessage = "Failed to sign in. Please check your connection.";

            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                errorMessage = "Incorrect email address or password.";
            } else if (err.code === "auth/too-many-requests") {
                errorMessage = "Access temporarily disabled due to too many failed attempts. Reset your password or try again later.";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "The email address format is invalid.";
            } else if (err.code === "auth/user-disabled") {
                errorMessage = "This account has been disabled. Please contact support.";
            } else if (err.code === "auth/popup-closed-by-user") {
                errorMessage = "Sign-in was cancelled.";
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
                                Welcome Back
                            </h1>
                            <p className="text-blue-200 text-sm">
                                Sign in to access your projects
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

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            required
                                            suppressHydrationWarning
                                            className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            suppressHydrationWarning
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    suppressHydrationWarning
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex justify-center gap-2"
                                >
                                    {loading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
                                </button>
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm -my-2">
                                        {/* <span className="px-2 bg-white text-slate-500">Or sign in with Google</span> */}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    suppressHydrationWarning
                                    className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2 mb-6"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.-.19-.58z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </button>
                            </form>

                            <p className="text-sm text-center text-slate-500 mt-6">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-blue-600 font-semibold">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
