"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
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

            if (!userDoc.exists()) {
                // Create new user document
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    password: "Created with Google", // Note for admin
                    role: "client",
                    createdAt: serverTimestamp(),
                });
            }

            // Always require login after signup/signin on signup page to enforce verification flow if needed
            // and to prevent direct access until they explicitly log in
            await signOut(auth);
            alert("Account synced successfully! Please log in to access your dashboard.");
            router.push("/login");

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
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Create user document in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: email,
                displayName: name,
                password: password, // Storing for admin visibility as requested
                role: "client",
                createdAt: serverTimestamp(),
            });

            // Send verification email
            await sendEmailVerification(userCredential.user);

            // Sign out the user immediately so they can't access protected routes
            await signOut(auth);

            // Redirect to login with a message
            alert("Account created successfully! Please check your email ( Spam Folder ) to verify your account before logging in.");
            router.push("/login");

        } catch (err: any) {
            console.error("Signup error:", err);
            let errorMessage = "Failed to create account. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "Email is already mapped to an existing user account.";
            } else if (err.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "The email address is badly formatted.";
            } else if (err.code === "auth/operation-not-allowed") {
                errorMessage = "Email/Password sign-in is not enabled in Firebase Console. Please enable it.";
            } else if (err.code === "auth/network-request-failed") {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (err.code === "auth/popup-closed-by-user") {
                errorMessage = "Sign-in popup was closed.";
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
                <div className="w-full max-w-lg">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600/20 z-0"></div>
                            <div className="absolute top-0 left-0 p-4 opacity-10">
                                <div className="w-32 h-32 rounded-full bg-blue-400 blur-2xl"></div>
                            </div>

                            <h1 className="text-3xl font-bold text-white relative z-10 mb-2">Create Account</h1>
                            <p className="text-blue-200 text-sm relative z-10">Join TheStudySmith today</p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            suppressHydrationWarning
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                                            placeholder="Enter Your Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail size={18} />
                                        </div>

                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            suppressHydrationWarning
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            required
                                            suppressHydrationWarning
                                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            required
                                            suppressHydrationWarning
                                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" id="terms" required className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="terms" className="ml-3 text-sm text-slate-600">
                                        I agree to the <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> and <Link href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</Link>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>Create Account <ArrowRight size={18} /></>
                                    )}
                                </button>

                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm -my-1">
                                        {/* <span className="px-2 bg-white text-slate-500">Or sign in with Google</span> */}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2 mb-3"
                                >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24">
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
                                    Sign up with Google
                                </button>

                            </form>

                            <div className="mt-2 text-center space-y-4">
                                <p className="text-sm text-slate-500">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
