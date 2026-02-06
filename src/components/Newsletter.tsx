"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            // Write directly to Firebase from client for faster response
            await addDoc(collection(db, "newsletter"), {
                email,
                timestamp: serverTimestamp(),
                source: "Website Footer"
            });

            setEmail("");
            setError("");
            setIsSubscribed(true);
        } catch (err) {
            console.error(err);
            setError("Subscription failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-blue-800/50">
            <h4 className="font-bold text-lg mb-3">Subscribe to our Newsletter</h4>
            <p className="text-sm text-blue-200 mb-4">
                Get the latest project ideas and tech updates.
            </p>

            {isSubscribed ? (
                <div className="flex flex-col gap-3 text-green-400 bg-green-900/20 p-6 rounded-xl border border-green-900/50 animate-in fade-in zoom-in duration-300 mx-2 md:mx-0">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={28} className="shrink-0" />
                        <h4 className="font-bold text-lg">Welcome aboard!</h4>
                    </div>
                    <div className="space-y-1 text-sm md:text-base text-green-100/90 pl-1">
                        <p>Thanks for subscribing to TheStudySmith.</p>
                        <p>You’ll receive the latest updates and information about new technologies. Stay tuned!</p>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto md:mx-0"
                >
                    <div className="w-full">
                        <input
                            suppressHydrationWarning={true}
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter your email"
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            title="Please enter a valid email address"
                            required
                            className={`w-full px-4 py-3 rounded-xl bg-blue-900/50 border ${error ? "border-red-500" : "border-blue-800"
                                } text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />

                        {error && (
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        suppressHydrationWarning={true}
                        type="submit"
                        disabled={isLoading}
                        className={`bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-500 transition shadow-md whitespace-nowrap ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
            )}
        </div>
    );
}
