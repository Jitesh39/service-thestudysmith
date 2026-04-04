"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, setDoc, addDoc, updateDoc, serverTimestamp, orderBy, runTransaction, increment, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    Package,
    CreditCard,
    FileText,
    MessageSquare,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Plus,
    Search,
    Loader2,
    RefreshCw,
    Send,
    Pencil,
    Camera,
    Copy,
    Check,
    IndianRupee
} from "lucide-react";

const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "thestudysmith_profile");
    formData.append("folder", "thestudysmith/profile");

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/db0vcogoj/image/upload`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

// Helper to get time-based greeting
const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
};

// Helper to format dates to "10 February 2026"
const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

// Placeholder Components for Sections
const OverviewSection = ({ user, projects, tickets, loading }: { user: any; projects: any[]; tickets: any[]; loading: boolean }) => {
    // Count 'Pending' (Work-in-progress) as Active projects
    const activeCount = projects.filter(p => (p.projectStatus || p.status)?.toLowerCase() === 'pending').length;

    // Count 'open' support tickets
    const activeTicketsCount = tickets.filter(t => t.status === 'open').length;

    // Payment Logic: count 'Pending' as 1, identify '50% Paid' as 'Half Paid'
    const pendingPaymentsCount = projects.filter(p => p.paymentStatus?.toLowerCase() === 'pending').length;
    const halfPaidCount = projects.filter(p => p.paymentStatus?.toLowerCase().includes('50%')).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">{getTimeGreeting()} <span className="text-blue-600">{user?.displayName || 'User'}</span>👋</h2>
                    <p className="text-bold-400 mt-2 font-medium">Welcome Back to your Client Dashboard.</p>
                    <p className="text-bold-600 mt-2 font-medium italic">To track project updates and payments, use the sidebar menu items.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Projects</p>
                    <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Active Projects</p>
                    <p className="text-3xl font-bold text-blue-600">{activeCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Pending Payments</p>
                    <p className="text-xl md:text-2xl font-bold text-yellow-600">
                        {(() => {
                            if (pendingPaymentsCount === 0 && halfPaidCount === 0) return "0";
                            if (halfPaidCount > 0 && pendingPaymentsCount === 0 && projects.length === 1) return "Half Paid";
                            return pendingPaymentsCount + halfPaidCount;
                        })()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Active Support Ticket</p>
                    <p className="text-3xl font-bold text-purple-600">{activeTicketsCount}</p>
                </div>
            </div>

            <div className="mt-8">
                {loading ? (
                    <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-slate-200 rounded"></div>
                                <div className="h-4 w-48 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner shrink-0 overflow-hidden">
                                {user?.profileImage || user?.photoURL ? (
                                    <img src={user.profileImage || user.photoURL} alt={user.displayName || user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.displayName || user?.name ? (user.displayName || user.name).charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Logged in as</p>
                                <h3 className="text-lg font-bold text-slate-900 truncate">{user?.displayName || 'User Account'}</h3>
                                <p className="text-slate-500 font-medium text-sm truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
const PaymentModal = ({ isOpen, onClose, project }: { isOpen: boolean, onClose: () => void, project: any }) => {
    const [copied, setCopied] = useState(false);
    const upiId = "9525129168@ptyes";

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="p-4 pb-2 flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">Complete Your <br /><span className="text-blue-600">Payment</span></h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">{project?.projectName || "Project Payment"}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                        <X size={20} className="text-slate-400 group-hover:text-slate-900" />
                    </button>
                </div>

                <div className="p-5 md:p-8 pt-0 space-y-6 md:space-y-8">
                    <div className="bg-slate-50 p-4 md:p-6 rounded-3xl border border-dashed border-slate-200 text-center space-y-3 md:space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">UPI ID</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">{upiId}</p>
                        </div>

                        <div className="h-[1px] w-12 bg-slate-200 mx-auto"></div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</p>
                            <div className="flex items-center justify-center gap-1 text-3xl font-black text-blue-600">
                                <span className="text-xl">₹</span>
                                {project?.payment || "0"}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleCopy}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 border shadow-lg ${copied
                                ? 'bg-green-700 border-green-700 text-white shadow-green-100'
                                : 'bg-green-600 border-green-600 text-white shadow-green-200 hover:bg-green-700'
                                }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? "UPI ID Copied!" : "Copy UPI ID"}
                        </button>

                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                <CreditCard size={14} />
                            </div>
                            <p className="text-[11px] text-blue-800/80 font-bold leading-relaxed">
                                Pay via any UPI app and share the payment screenshot with your TheStudySmith team member.

                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
};

const PaymentsSection = ({ projects }: { projects: any[] }) => {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePayNow = (project: any) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <>
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
            />

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Project <span className="text-blue-600">Payments</span></h2>
                        <p className="text-slate-500 mt-2 font-medium">Track your payment status, outstanding balances, and transaction remarks for all your active projects.</p>
                    </div>
                </div>

                {projects.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-600" />
                                Recent Payment Status
                            </h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                {projects.length} Total Projects
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-50">
                                    <tr>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project ID</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Status</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Agreement Remark</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {projects.map((p, i) => {
                                        const status = p.paymentStatus?.toLowerCase();
                                        const isPaid = status === 'paid' || status === 'full paid';
                                        const isHalf = status?.includes('50%');
                                        const isPending = status === 'pending';

                                        return (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-5 font-mono text-sm font-bold text-blue-600">{p.projectId || p.id}</td>
                                                <td className="p-5">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${isPaid ? 'bg-green-100 text-green-700' :
                                                        isHalf ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {isPaid ? 'Cleared' : isHalf ? 'Half Paid' : isPending ? 'Pending' : p.paymentStatus || 'Awaited'}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-center">
                                                    {isPaid ? (
                                                        <button
                                                            disabled
                                                            className="px-4 py-2 bg-transparent text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-not-allowed"
                                                        >
                                                            Cleared
                                                        </button>
                                                    ) : (isPending || isHalf) ? (
                                                        <button
                                                            onClick={() => handlePayNow(p)}
                                                            className="px-4 py-2 bg-green-600 border border-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
                                                        >
                                                            Pay Now
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">N/A</span>
                                                    )}
                                                </td>
                                                <td className="p-5 text-sm font-medium text-slate-500 italic">
                                                    {isPaid ? 'No balance remaining.' :
                                                        isHalf ? '50% payment received.' :
                                                            isPending ? 'Initial payment is awaited.' : 'Contact support for details.'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                            <CreditCard size={40} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-slate-800">No Projects Found</h4>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm">Add a project using your Project ID to see payment statuses here.</p>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">Payment Assistance</h4>
                        <p className="text-blue-700/80 text-xs font-medium leading-relaxed">
                            If you notice any discrepancy in your payment status, please raise a ticket in the Support section or contact your project manager directly.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
;


const ProjectsSection = ({ user, loading, projects }: { user: any; loading: boolean; projects: any[] }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [projectIdInput, setProjectIdInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSynced, setLastSynced] = useState<string | null>(null);

    const handleSyncData = async (silent = false) => {
        if (!user?.uid || projects.length === 0) return;
        if (!silent) setIsSubmitting(true);

        try {
            const settingsDoc = await getDoc(doc(db, "settings", "dashboard"));
            if (!settingsDoc.exists() || !settingsDoc.data().sheetUrl) return;

            const sheetUrl = settingsDoc.data().sheetUrl;
            const csvUrl = sheetUrl.replace('/pubhtml', '/pub') + (sheetUrl.includes('?') ? '&' : '?') + 'output=csv';

            const response = await fetch(csvUrl);
            if (!response.ok) return;
            const csvText = await response.text();

            const parseCSV = (text: string) => {
                const rows = text.split(/\r?\n/).filter(row => row.trim());
                if (rows.length < 1) return [];
                const splitRow = (row: string) => {
                    const result = [];
                    let current = '';
                    let inQuotes = false;
                    for (let i = 0; i < row.length; i++) {
                        if (row[i] === '"') inQuotes = !inQuotes;
                        else if (row[i] === ',' && !inQuotes) {
                            result.push(current.trim());
                            current = '';
                        } else {
                            current += row[i];
                        }
                    }
                    result.push(current.trim());
                    return result;
                };
                const headers = splitRow(rows[0]);
                return rows.slice(1).map(row => {
                    const values = splitRow(row);
                    return headers.reduce((acc, header, i) => {
                        acc[header.toLowerCase()] = values[i] || "";
                        return acc;
                    }, {} as any);
                });
            };

            const allData = parseCSV(csvText);

            for (const proj of projects) {
                const matched = allData.find(row => {
                    const rowId = row['project id'] || row['id'] || row['projectid'];
                    const rowEmail = row['email address'] || row['email'] || row['client email'];
                    return rowId === proj.projectId && rowEmail?.toLowerCase() === user.email?.toLowerCase();
                });

                if (matched) {
                    await setDoc(doc(collection(db, "users", user.uid, "assignedProjects"), proj.projectId), {
                        projectId: proj.projectId,
                        projectName: matched['project name'] || matched['title'] || proj.projectName || proj.title || "Untitled Project",
                        projectStatus: matched['project status'] || matched['status'] || proj.projectStatus || proj.status || "Pending",
                        enquireDate: matched['enquire date'] || matched['date'] || proj.enquireDate || proj.date || "",
                        targetDate: matched['target date'] || matched['deadline'] || proj.targetDate || "N/A",
                        payment: matched['payment'] || matched['amount'] || proj.payment || "0",
                        paymentStatus: matched['payment status'] || matched['p-status'] || proj.paymentStatus || "Pending",
                        lastUpdated: serverTimestamp()
                    }, { merge: true });
                }
            }
            setLastSynced(new Date().toLocaleTimeString());
        } catch (err) {
            console.error("Sync error:", err);
            setError("Failed to sync data.");
        } finally {
            if (!silent) setIsSubmitting(false);
        }
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedId = projectIdInput.trim();
        if (!trimmedId) return;

        // Check if project is already added
        if (projects.some(p => p.projectId === trimmedId)) {
            setError("Project ID already added to your list.");
            setTimeout(() => {
                setError(null);
                setProjectIdInput("");
                setIsAdding(false);
            }, 3000);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const settingsDoc = await getDoc(doc(db, "settings", "dashboard"));
            if (!settingsDoc.exists() || !settingsDoc.data().sheetUrl) {
                throw new Error("System configuration missing.");
            }

            const sheetUrl = settingsDoc.data().sheetUrl;
            const csvUrl = sheetUrl.replace('/pubhtml', '/pub') + (sheetUrl.includes('?') ? '&' : '?') + 'output=csv';

            const response = await fetch(csvUrl);
            const csvText = await response.text();

            // Minimal parser
            const rows = csvText.split(/\r?\n/).filter(row => row.trim());
            const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
            const allData = rows.slice(1).map(row => {
                const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
                return headers.reduce((acc, header, i) => {
                    acc[header] = values[i] || "";
                    return acc;
                }, {} as any);
            });

            const matched = allData.find(row => {
                const rowId = row['project id'] || row['id'] || row['projectid'];
                const rowEmail = row['email address'] || row['email'] || row['client email'];
                return rowId === trimmedId && rowEmail?.toLowerCase() === user.email?.toLowerCase();
            });

            if (matched) {
                await setDoc(doc(collection(db, "users", user.uid, "assignedProjects"), trimmedId), {
                    projectId: trimmedId,
                    projectName: matched['project name'] || matched['title'] || "Untitled Project",
                    projectStatus: matched['project status'] || matched['status'] || "Pending",
                    enquireDate: matched['enquire date'] || matched['date'] || "",
                    targetDate: matched['target date'] || matched['deadline'] || "N/A",
                    payment: matched['payment'] || matched['amount'] || "0",
                    paymentStatus: matched['payment status'] || matched['p-status'] || "Pending",
                    addedAt: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                setProjectIdInput("");
                setIsAdding(false);
                handleSyncData(true);
            } else {
                setError("No project found with this ID and your email. Please check and try again.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to add project.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">My Projects</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 font-medium">Manage and track your active project progress.</p>
                        {lastSynced && (
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold border border-green-100 flex items-center gap-1">
                                <RefreshCw size={10} className="animate-spin" />
                                Updated {lastSynced}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSyncData()}
                        disabled={isSubmitting || projects.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        <RefreshCw size={16} className={isSubmitting ? "animate-spin" : ""} />
                        Refresh Details
                    </button>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        {isAdding ? <X size={18} /> : <Plus size={18} />}
                        {isAdding ? "Cancel" : "Add Project by ID"}
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 animate-in zoom-in-95 duration-200">
                    <form onSubmit={handleAddProject} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Unique Project ID</label>
                            <input
                                type="text"
                                value={projectIdInput}
                                onChange={(e) => setProjectIdInput(e.target.value)}
                                placeholder="For Example - 1001"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono font-bold"
                            />
                        </div>
                        <div className="md:pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || !projectIdInput.trim()}
                                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Verify & Add Project"}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 border border-red-100 animate-in shake-in duration-300">
                            <X size={16} />
                            {error}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-50">
                            <tr>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project ID</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Name</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Enquire Date</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Target Date</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Payment</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {projects.length > 0 ? (
                                projects.map((proj, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                {proj.projectId || proj.id}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">{proj.projectName || proj.title}</p>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm text-center">
                                            {formatDate(proj.enquireDate || proj.date)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                {formatDate(proj.targetDate)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${(proj.projectStatus || proj.status)?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                                                (proj.projectStatus || proj.status)?.toLowerCase() === 'active' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {proj.projectStatus || proj.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-bold text-slate-700">
                                            {proj.payment || '0'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${(proj.paymentStatus)?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' :
                                                (proj.paymentStatus)?.toLowerCase() === 'partial' || (proj.paymentStatus)?.toLowerCase().includes('50%') ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {proj.paymentStatus || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        {loading ? (
                                            <div className="flex justify-center flex-col items-center gap-2">
                                                <Loader2 className="animate-spin text-blue-600" size={24} />
                                                <p className="text-slate-400 text-sm font-medium">Loading projects...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <Package className="text-slate-200" size={48} />
                                                <p className="text-slate-400 font-medium text-lg">No projects added yet.</p>
                                                <p className="text-slate-400 text-sm max-w-xs">Use the "Add Project by ID" button to connect your active projects.</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const QuickGuideSection = () => {
    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Quick <span className="text-blue-600">Guide</span></h2>
                        <p className="text-slate-500 mt-2 font-medium italic">Stay updated with the latest platform changes and follow the guide to manage your account.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
                    <LayoutDashboard size={20} className="text-blue-600" />
                    Working Directions
                </h3>

                <div className="grid gap-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group border-l-4 border-l-blue-600">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-extrabold text-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">1</div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">Dashboard Overview</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">The <span className="text-blue-600 font-bold italic">"Overview"</span> is your command center. It now combines your project stats, ticket tracking, and <span className="font-bold underline decoration-blue-200">Personal Profile</span> details in one unified view. No more switching tabs to check your login info.</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group border-l-4 border-l-blue-600">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-extrabold text-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">2</div>
                        <div className="space-y-8 flex-1">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Step 2: My Projects - Table Guide</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">This section allows you to link your active projects and track their progress in real-time. Follow the steps below to get started.</p>
                            </div>

                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-600 text-white rounded-lg"><Plus size={16} /></div>
                                    How to Add Your Project:
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                        <p className="text-sm text-slate-700 font-medium">Click on the <span className="text-blue-600 font-bold">"Add Project by ID"</span> button at the top right of the Projects page.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                        <p className="text-sm text-slate-700 font-medium">Enter your <span className="text-blue-600 font-bold">Unique Project ID</span> (e.g., 1001) provided by our team.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                        <p className="text-sm text-slate-700 font-medium">Click <span className="text-blue-600 font-bold">"Verify & Add Project"</span>. The system will match the ID with your email and add it to your list.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-800 px-2 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" />
                                    Understanding the Project Table:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Project ID & Name</p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Your unique reference number and the official title of your project.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Enquire & Target Date</p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Shows when you first contacted us and the estimated delivery deadline.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Tracking progress: <span className="text-yellow-600 font-bold">Pending</span> (In progress) or <span className="text-green-600 font-bold">Completed</span>.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Payment Details</p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Displays the agreed amount and whether the payment is <span className="text-blue-600 font-bold">Partial (50%)</span> or <span className="text-green-600 font-bold">Full Paid</span>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-extrabold text-xl group-hover:rotate-12 transition-transform">3</div>
                            <h3 className="text-xl font-bold text-slate-800">Payments</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Click on <span className="text-blue-600 font-bold">"Pay Now"</span> for any project, and after successful payment completion, share the transaction screenshot. Administration will verify and update your status after it.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-extrabold text-xl group-hover:rotate-12 transition-transform">4</div>
                            <h3 className="text-xl font-bold text-slate-800">Documents</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Access all legal agreements and project files delivered straight to your registered email.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-extrabold text-xl group-hover:rotate-12 transition-transform">5</div>
                            <h3 className="text-xl font-bold text-slate-800">Support</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Our help center is active 24/7. Raise a ticket and track resolutions in the support history.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationsSection = ({ notifications, onMarkAsRead }: { notifications: any[], onMarkAsRead: (id: string) => void }) => {
    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="hidden md:flex bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Recent <span className="text-blue-600">Notifications</span></h2>
                    <p className="text-slate-500 mt-2 font-medium italic">Direct updates and messages from your project manager.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs">
                    <Bell size={16} /> {notifications.length} Total
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => !n.isRead && onMarkAsRead(n.id)}
                            className={`bg-white p-4 md:p-5 rounded-2xl border transition-all cursor-pointer group hover:border-blue-300 relative overflow-hidden ${n.isRead ? 'border-slate-100 shadow-sm' : 'border-blue-200 shadow-md ring-1 ring-blue-50'}`}
                        >
                            <div className="flex flex-col gap-5">
                                {/* Header: Profile + Info Group */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                                {n.senderPhoto ? (
                                                    <img src={n.senderPhoto} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-black italic">
                                                        {(n.senderName || 'A').charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <h4 className={`text-sm md:text-base font-black tracking-tight ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                                                {n.senderName || "Admin"}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-[#E9D5FF] text-[#6D28D9] rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">
                                                    ADMIN
                                                </span>
                                                {n.receiverId === "all_client" && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100 leading-none">Broadcast</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block text-xs font-black text-slate-900 uppercase tracking-widest tabular-nums">
                                        {n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        }) : 'Just Now'}
                                    </div>
                                </div>

                                {/* Content Section: Full Width Message */}
                                <div className="space-y-2">
                                    {!n.isRead && (
                                        <div className="inline-flex px-2 py-0.5 bg-green-500 text-white rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse mb-1">New Update</div>
                                    )}
                                    {n.message.split('\n').map((line: string, idx: number) => line.trim() && (
                                        <p
                                            key={idx}
                                            className={cn(
                                                "text-sm leading-relaxed whitespace-pre-wrap",
                                                idx === 0
                                                    ? "font-black text-slate-900 border-b border-slate-100/50 pb-2 mb-3 text-base"
                                                    : (n.isRead ? 'text-slate-500 font-medium' : 'text-slate-700 font-bold')
                                            )}
                                        >
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                            <Bell size={40} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-bold text-slate-800">No Notifications</h4>
                            <p className="text-slate-500 text-sm font-medium">You're all caught up! No new updates from admin.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DocumentsSection = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Project <span className="text-blue-600">Documents</span></h2>
                    <p className="text-slate-500 mt-2 font-medium">Access your legal agreements, policies, and project-related documentation.</p>
                </div>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <FileText size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Delivery Information</h3>
                    <p className="text-blue-700 font-medium leading-relaxed">
                        To ensure security and official record-keeping, <span className="font-bold underline decoration-blue-300">all Project Documents will be sent directly through email</span> to your registered email address.
                    </p>
                    <p className="text-blue-600/70 text-sm mt-3 font-medium">
                        Please check your inbox for files related to your active projects.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Privacy Policy
                    </h4>
                    <p className="text-slate-500 text-sm font-medium mb-4">Read about how we handle and protect your personal and project data.</p>
                    <Link href="/privacy-policy" className="text-blue-600 text-sm font-bold hover:underline inline-block">Read Privacy Policy →</Link>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Refund Policy
                    </h4>
                    <p className="text-slate-500 text-sm font-medium mb-4">Review our terms regarding project cancellations and refund eligibility.</p>
                    <Link href="/refund-policy" className="text-blue-600 text-sm font-bold hover:underline inline-block">Read Refund Policy →</Link>
                </div>
            </div>
        </div>
    );
};

const SupportSection = ({ user, tickets }: { user: any; tickets: any[] }) => {
    const [isRaising, setIsRaising] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRaiseTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        setIsSubmitting(true);
        setError(null);

        try {
            await runTransaction(db, async (transaction) => {
                // Get or initialize the ticket counter
                const counterRef = doc(db, "settings", "support_counter");
                const counterSnap = await transaction.get(counterRef);

                let nextNumber = 1000;
                if (counterSnap.exists()) {
                    nextNumber = (counterSnap.data().lastNumber || 999) + 1;
                }

                const customTicketId = `TSS-SUPPORT-${nextNumber}`;
                const newTicketRef = doc(collection(db, "tickets"));

                // Set the ticket data
                transaction.set(newTicketRef, {
                    ticketId: customTicketId,
                    userId: user.uid,
                    userEmail: user.email,
                    userName: user.displayName || "Unknown User",
                    subject: subject.trim(),
                    message: message.trim(),
                    status: "open",
                    priority: "normal",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                // Update the counter
                transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true });
            });

            setSubject("");
            setMessage("");
            setIsRaising(false);
        } catch (err: any) {
            setError("Failed to raise ticket. Please try again.");
            console.error("Support Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Support <span className="text-blue-600">Center</span></h2>
                    <p className="text-slate-500 mt-2 font-medium italic">Facing issues? Our expert team is here to assist you as soon as possible.</p>
                </div>
                <button
                    onClick={() => setIsRaising(!isRaising)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                    {isRaising ? <X size={18} /> : <Plus size={18} />}
                    {isRaising ? "Cancel" : "Raise New Ticket"}
                </button>
            </div>

            {isRaising && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <MessageSquare className="text-blue-600" size={24} />
                        Submit a Support Request
                    </h3>
                    <form onSubmit={handleRaiseTicket} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Topic / Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Briefly describe the issue"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message Details</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe your problem in detail..."
                                rows={5}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || !subject.trim() || !message.trim()}
                                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                Send Request
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 border border-red-100 animate-in shake-in duration-300">
                            <X size={16} />
                            {error}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-600" />
                        Ticket History
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                        {tickets.length} Total Tickets
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-50">
                            <tr>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ticket ID</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Message</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.length > 0 ? (
                                tickets.map((ticket, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 font-mono text-xs font-bold text-blue-600">{ticket.ticketId || "N/A"}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">{ticket.subject}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs text-slate-500 max-w-[200px] truncate font-medium italic">{ticket.message}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${ticket.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-slate-500 text-xs font-medium">
                                            {ticket.createdAt?.toDate().toLocaleDateString('en-GB')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <MessageSquare className="text-slate-200" size={48} />
                                            <p className="text-slate-400 font-medium text-lg">No tickets found.</p>
                                            <p className="text-slate-400 text-sm max-w-xs mx-auto">If you have any questions or issues, raise a ticket using the button above.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ProfileSection = ({ user, loading }: { user: any; loading: boolean }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            await setDoc(doc(db, "users", user.uid), {
                profileImage: url,
                name: user.displayName || user.name || "Client Account",
                email: user.email
            }, { merge: true });
            showToast("Profile image updated successfully!", "success");
            setPreviewUrl(null); // Clear preview as Firestore will update the actual image
        } catch (error) {
            console.error("Error uploading photo:", error);
            showToast("Failed to upload image. Please try again.", "error");
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded mb-6"></div>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-slate-200"></div>
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="h-5 w-32 bg-slate-200 rounded mx-auto sm:mx-0"></div>
                        <div className="h-4 w-48 bg-slate-200 rounded mx-auto sm:mx-0"></div>
                    </div>
                </div>
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-slate-200 rounded mx-auto sm:mx-0"></div>
                            <div className="h-10 w-full bg-slate-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
            {toast && (
                <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl animate-in zoom-in duration-300 flex items-center gap-3 font-bold ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    {toast.type === 'success' ? '✓' : '✕'}
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <User size={24} />
                    </div>
                    Account Profile
                </h2>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
                    title="Change Profile Photo"
                >
                    {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Pencil size={20} />}
                </button>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-50">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl border-4 border-white overflow-hidden shrink-0">
                            {previewUrl || user?.profileImage || user?.photoURL ? (
                                <img src={previewUrl || user.profileImage || user.photoURL} alt={user.displayName || user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.displayName || user?.name ? (user.displayName || user.name).charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <RefreshCw className="text-white animate-spin" size={24} />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center text-white disabled:pointer-events-none"
                        >
                            <Camera size={20} />
                        </button>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{user?.displayName || user?.name || 'Client Account'}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 justify-center sm:justify-start">
                            <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                                Verified Portal Access
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold text-base shadow-sm ring-1 ring-slate-200/30 capitalize">
                            {user?.displayName || user?.name || 'Not Set'}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold text-base shadow-sm ring-1 ring-slate-200/30">
                            {user?.email || 'Not Available'}
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Account Created On</label>
                        <div className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold text-base shadow-sm ring-1 ring-slate-200/30">
                            {user?.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : 'Syncing Data...'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function ClientDashboard() {
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sectionParam = params.get("section");
        const savedSection = localStorage.getItem("clientActiveSection");

        if (sectionParam) {
            setActiveSection(sectionParam);
            localStorage.setItem("clientActiveSection", sectionParam);
        } else {
            setActiveSection(savedSection || "overview");
        }
    }, []);

    useEffect(() => {
        if (activeSection) {
            localStorage.setItem("clientActiveSection", activeSection);
        }
    }, [activeSection]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Auth State Observer
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                if (!currentUser.emailVerified) {
                    router.push("/login");
                    return;
                }

                // Fetch user details once, then listen for real-time updates
                const userDocRef = doc(db, "users", currentUser.uid);
                const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
                    const basicInfo = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                    };

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        if (userData?.role === "admin") {
                            router.push("/dashboard/admin");
                        } else if (userData?.role === "Team_Member") {
                            router.push("/dashboard/team");
                        } else {
                            setUser({
                                ...basicInfo,
                                ...userData
                            });
                        }
                    } else {
                        // For first time users, still show basic auth info
                        setUser(basicInfo);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error listening to user profile:", error);
                    setLoading(false);
                });

                return () => unsubscribeUser();
            } else {
                router.push("/login");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    // Fetch Projects (Real-time: Important for status updates)
    useEffect(() => {
        if (!user?.uid) return;

        // Limit query if possible, currently fetching all assigned projects
        const q = query(collection(db, "users", user.uid, "assignedProjects"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsList);
        }, (error) => {
            console.error("Projects Real-time Error:", error);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Fetch Tickets (One-time Fetch: Reduces reads)
    // Users rarely need real-time updates for ticket lists unless actively chatting
    useEffect(() => {
        if (!user?.email) return;

        const fetchTickets = async () => {
            try {
                const q = query(
                    collection(db, "tickets"),
                    where("userEmail", "==", user.email)
                );
                const snapshot = await getDocs(q);
                const ticketList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

                ticketList.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
                    const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
                    return dateB - dateA;
                });

                setTickets(ticketList);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, [user?.email]);

    useEffect(() => {
        if (!user?.uid) return;

        // Listen for direct notifications OR global broadcast announcements
        const q = query(
            collection(db, "notifications"),
            where("receiverId", "in", [user.uid, "all_client"]),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(list);
            const unread = list.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
        }, (error) => {
            console.error("Notifications listener error:", error);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            const notifRef = doc(db, "notifications", notificationId);
            await updateDoc(notifRef, {
                isRead: true
            });
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const menuItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "profile", label: "My Profile", icon: User },
        { id: "projects", label: "My Projects", icon: Package },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
        { id: "support", label: "Support", icon: MessageSquare },
        { id: "quick-guide", label: "Quick Guide", icon: FileText },
        { id: "documents", label: "Documents", icon: FileText },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "overview": return <OverviewSection user={user} projects={projects} tickets={tickets} loading={loading} />;
            case "profile": return <ProfileSection user={user} loading={loading} />;
            case "projects": return <ProjectsSection user={user} loading={loading} projects={projects} />;
            case "payments": return <PaymentsSection projects={projects} />;
            case "notifications": return <NotificationsSection notifications={notifications} onMarkAsRead={handleMarkAsRead} />;
            case "support": return <SupportSection user={user} tickets={tickets} />;
            case "quick-guide": return <QuickGuideSection />;
            case "documents": return <DocumentsSection />;
            default: return <div className="p-8 text-center text-slate-500">Section under construction</div>;
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] bg-slate-50 flex overflow-hidden">
            <aside className={`fixed inset-y-0 left-0 top-24 md:top-32 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] rounded-r-xl overflow-y-auto`}>
                <nav className="p-2 pt-8 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {(item as any).badge > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {(item as any).badge}
                                </span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={async () => {
                            localStorage.removeItem("clientActiveSection");
                            await signOut(auth);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="lg:hidden p-4 pb-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <Menu size={20} />
                        <span className="font-medium text-sm">Menu</span>
                    </button>
                </div>
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden top-24 md:top-32" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
}
