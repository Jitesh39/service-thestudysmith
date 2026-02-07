import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-blue-600 font-semibold text-lg mb-8">(Applicable to Student Project Services Only)</p>

                    <div className="space-y-8 text-slate-700 leading-relaxed">

                        {/* Introduction */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Introduction</h2>
                            <p>
                                Welcome to TheStudySmith. We provide web development project services for our clients.
                                Protecting the privacy and security of client information is a priority for us.
                                This Privacy Policy explains how we collect, use, store, and protect personal information shared with us.                            </p>
                        </section>

                        {/* Scope */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Scope of This Policy</h2>
                            <p>
                                This policy applies to all personal data collected through the TheStudySmith website, communication channels, and project-related services.
                                It governs how information is handled during inquiries, project development, delivery, hosting, and maintenance support.                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Information We Collect</h2>

                            <div className="mb-4">
                                <h3 className="font-bold text-slate-800 mb-2">1. Personal Information</h3>
                                <p className="mb-2">We may collect the following details:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Client name</li>
                                    <li>Email address</li>
                                    <li>Phone number</li>
                                    <li>Project requirements, organization details, or other relevant information (if shared voluntarily)</li>
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-bold text-slate-800 mb-2">2. Project-Related Information</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Project requirements and specifications</li>
                                    <li>Communication history related to the project</li>
                                    <li>Files, content, or references shared for project development</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-2">3. Technical Information</h3>
                                <p className="mb-2">We may collect limited technical data such as:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Device type and browser information</li>
                                    <li>Website usage data (via cookies or analytics tools)</li>
                                </ul>
                                <p className="mt-2 text-sm italic">This helps us improve website performance and user experience.</p>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">How We Use Your Information</h2>
                            <p className="mb-3">We use collected information strictly for academic project purposes, including:</p>
                            <ul className="list-disc pl-5 space-y-1 mb-4">
                                <li>Providing web development project services</li>
                                <li>Communicating project updates and support</li>
                                <li>Improving service quality and client experience</li>
                                <li>Fulfilling legal or institutional requirements</li>
                            </ul>
                            <p className="font-semibold text-slate-800">We do not sell, rent, or misuse client data.</p>
                        </section>

                        {/* Information Sharing */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Information Sharing & Disclosure</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Client information is shared only with authorized team members involved in project delivery.</li>
                                <li>Third-party services (such as hosting or analytics) may be used under strict confidentiality agreements.</li>
                                <li>Information may be disclosed if required by law or legal authorities.</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Data Security & Retention</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>We apply reasonable technical and organizational measures to safeguard Client data.</li>
                                <li>Information is retained only as long as required for project completion, support, or legal obligations.</li>
                                <li>Once no longer needed, data is securely deleted.</li>
                            </ul>
                        </section>

                        {/* Client Rights */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2 border-slate-100">Client Rights</h2>
                            <p className="mb-3">Clients have the right to:</p>
                            <ul className="list-disc pl-5 space-y-1 mb-3">
                                <li>Access the personal data we hold</li>
                                <li>Request correction of incorrect information</li>
                                <li>Request deletion of data after project completion (subject to legal requirements)</li>
                                <li>Withdraw consent for non-essential communications</li>
                            </ul>
                            <p>Requests can be made by contacting us via email.</p>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Cookies & Tracking</h2>
                            <p>
                                Our website may use cookies to enhance usability and performance. Users can control cookie preferences through their browser settings.
                            </p>
                        </section>

                        {/* Updates & Contact */}
                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
                            <h2 className="text-lg font-bold text-blue-900 mb-2">Policy Updates</h2>
                            <p className="text-sm text-blue-800 mb-6">
                                TheStudySmith reserves the right to update this Privacy Policy at any time. Any changes will be effective immediately upon publication on our website.
                            </p>

                            <h2 className="text-lg font-bold text-blue-900 mb-2">Contact Information</h2>
                            <p className="text-sm text-blue-800">
                                For any questions regarding this Privacy Policy or data practices, please contact us at: <br />
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
