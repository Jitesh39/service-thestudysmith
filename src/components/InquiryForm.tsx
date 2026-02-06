"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function InquiryForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        university: "",
        projectTitle: "",
        deadline: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            await addDoc(collection(db, "inquiries"), {
                ...formData,
                createdAt: serverTimestamp(),
                status: "new"
            });

            // Send Email Notification
            try {
                await fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            } catch (emailError) {
                console.error("Failed to send email notification", emailError);
            }

            setStatus({ type: "success", message: "Inquiry submitted successfully! We will contact you soon." });
            setFormData({
                name: "",
                email: "",
                university: "",
                projectTitle: "",
                deadline: "",
                message: ""
            });
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            setStatus({ type: "error", message: "Failed to submit inquiry. Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Get a Quote / Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input
                            suppressHydrationWarning={true}
                            type="text"
                            id="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
                        <input
                            suppressHydrationWarning={true}
                            type="email"
                            id="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="university" className="block text-sm font-medium text-slate-700 mb-1">University Name</label>
                    <input
                        suppressHydrationWarning={true}
                        type="text"
                        id="university"
                        value={formData.university || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                        placeholder="e.g. IGNOU, LPU"
                    />
                </div>

                <div>
                    <label htmlFor="projectTitle" className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                    <input
                        suppressHydrationWarning={true}
                        type="text"
                        id="projectTitle"
                        value={formData.projectTitle || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                        placeholder="e.g. E-Commerce Website"
                    />
                </div>

                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-1">Project Deadline Time</label>
                    <input
                        suppressHydrationWarning={true}
                        type="date"
                        id="deadline"
                        value={formData.deadline || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                        suppressHydrationWarning={true}
                        id="message"
                        rows={3}
                        value={formData.message || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                        placeholder="Any specific requirements..."
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <button
                        suppressHydrationWarning={true}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-blue-400"
                    >
                        {loading ? "Submitting..." : "Submit Inquiry"}
                    </button>
                    {status.message && (
                        <p className={`text-center text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
                            {status.message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
