import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative">
            <Navbar />

            <div className="container mx-auto px-6 py-24 max-w-4xl">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Return & Refund Policy</h1>
                    <p className="text-blue-600 font-semibold text-lg mb-8">(Student Project Services Only)</p>

                    <div className="space-y-8 text-slate-700 leading-relaxed">

                        {/* Introduction */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Introduction</h2>
                            <p>
                                At TheStudySmith, we specialize in providing web development project services exclusively for students. Our goal is to support academic requirements with structured, high-quality project solutions. This policy explains how return, cancellation, and refund requests related to student projects are handled.
                            </p>
                        </section>

                        {/* Eligibility */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Eligibility for Return / Refund</h2>

                            <div className="mb-4">
                                <h3 className="font-bold text-slate-800 mb-2">1. Project Non-Delivery</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>A refund request may be considered if the student project is not delivered within the agreed timeline due to reasons solely attributable to TheStudySmith.</li>
                                    <li>Such requests must be raised within <strong>7 days</strong> of the committed delivery date.</li>
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-bold text-slate-800 mb-2">2. Deviation from Approved Scope</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>If the delivered project does not match the initially approved project scope or features, students may raise a concern within <strong>14 days</strong> of delivery.</li>
                                    <li>Clear justification and details must be shared.</li>
                                    <li>TheStudySmith will first attempt to correct or revise the project before any refund is evaluated.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">3. Project Cancellation</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Cancellations made within <strong>24 hours</strong> of order confirmation are eligible for a full refund.</li>
                                    <li>If cancellation is requested after project development has started, only a partial refund may be issued based on the work completed.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Refund Process */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Refund Request Process</h2>
                            <p className="mb-3">All refund or cancellation requests must be submitted via email to: <br />
                                <a href="mailto:thestudysmithpu@gmail.com" className="text-blue-600 font-bold hover:underline">thestudysmithpu@gmail.com</a></p>

                            <p className="mb-2 font-semibold">Please include:</p>
                            <ul className="list-disc pl-5 space-y-1 mb-3">
                                <li>Student name</li>
                                <li>Project title</li>
                                <li>Order details</li>
                                <li>Reason for the request</li>
                            </ul>
                            <p>Our team will review the request and respond within <strong>5–8 working days</strong>.</p>
                        </section>

                        {/* Conditions */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Conditions & Limitations</h2>
                            <ul className="list-disc pl-5 space-y-1 mb-4">
                                <li>Refunds are processed only after internal review and approval.</li>
                                <li>Approved refunds will be credited to the original payment method within <strong>10–15 business days</strong>.</li>
                            </ul>
                            <p className="font-semibold mb-2">No refunds will be provided for:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Projects delivered as per the approved scope</li>
                                <li>Changes requested after project approval</li>
                                <li>Student dissatisfaction due to viva performance or evaluation outcome</li>
                            </ul>
                        </section>

                        {/* Hosting & Maintenance */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Hosting & Maintenance Services</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Project hosting and maintenance (if opted) are chargeable services.</li>
                                <li>Hosting or maintenance fees are <strong>non-refundable</strong> once the service has been activated.</li>
                            </ul>
                        </section>

                        {/* Exceptional Cases */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Exceptional Cases</h2>
                            <p>
                                If a project is affected by unavoidable external factors (such as institutional policy changes or third-party service issues), TheStudySmith will work with the student to provide a reasonable alternative solution where possible.
                            </p>
                        </section>

                        {/* Updates & Contact */}
                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
                            <h2 className="text-lg font-bold text-blue-900 mb-2">Policy Updates</h2>
                            <p className="text-sm text-blue-800 mb-6">
                                TheStudySmith reserves the right to update this policy at any time. Any changes will be effective immediately upon publication on our website.
                            </p>

                            <h2 className="text-lg font-bold text-blue-900 mb-2">Contact Information</h2>
                            <p className="text-sm text-blue-800">
                                For any queries related to this policy, please contact us at: <br />
                                <a href="mailto:thestudysmithpu@gmail.com" className="font-bold underline hover:text-blue-700">thestudysmithpu@gmail.com</a>
                            </p>
                        </section>

                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <Footer className="mt-12" />
        </div>
    );
}
