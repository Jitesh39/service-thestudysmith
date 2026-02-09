"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
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
    ChevronRight
} from "lucide-react";

// Placeholder Components for Sections
const OverviewSection = ({ user }: { user: any }) => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Welcome back, <span className="text-blue-600">{user?.displayName?.split(' ')[0] || 'User'}!</span> 👋</h2>
                <p className="text-slate-500 mt-2 font-medium">Here's what's happening with your projects today.</p>
            </div>
            <div className="hidden md:block">
                <Link href="/demo-projects" className="btn btn-primary px-6 py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all">
                    Start New Project
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Total Projects', 'Active Projects', 'Pending Payments', 'Unread Messages'].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">{item}</p>
                    <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
            ))}
        </div>
    </div>
);

const ProfileSection = ({ user, loading }: { user: any; loading: boolean }) => {
    if (loading) {
        return (
            <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded mb-6"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-slate-200"></div>
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-slate-200 rounded"></div>
                        <div className="h-4 w-48 bg-slate-200 rounded"></div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        <div className="h-10 w-full bg-slate-100 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                        <div className="h-10 w-full bg-slate-100 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h2>
            <div className="space-y-8">
                <div className="flex items-center gap-5 pb-6 border-b border-slate-50">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{user?.displayName || 'User Account'}</h3>
                        <p className="text-slate-500 font-medium">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-semibold text-lg shadow-sm">
                            {user?.displayName || 'Not Set'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-semibold text-lg shadow-sm">
                            {user?.email || 'Not Set'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectsSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">My Projects</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-slate-600">Project ID</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Title</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Action</th>
                    </tr>
                </thead>
                {/* <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="p-4 text-slate-500">#PROJ-001</td>
                        <td className="p-4 font-medium text-slate-800">E-Commerce Website</td>
                        <td className="p-4 text-slate-500">Oct 24, 2025</td>
                        <td className="p-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span></td>
                        <td className="p-4"><button className="text-blue-600 hover:underline text-sm">View Details</button></td>
                    </tr>
                </tbody> */}
            </table>
            <div className="p-8 text-center text-slate-500">
                No orders found.
            </div>
        </div>
    </div>
);

// ... Add other dummy sections similarly or implement them as needed

export default function ClientDashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
                if (currentUser) {
                    if (!currentUser.emailVerified) {
                        router.push("/login");
                        return;
                    }
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    const userData = userDoc.data();

                    if (userData?.role !== "admin") {
                        setUser({ ...currentUser, ...userData });
                        setLoading(false);
                        // No fetchDashboardData() for client dashboard
                    } else {
                        // If an admin somehow lands here, redirect to admin dashboard
                        router.push("/dashboard/admin");
                    }
                } else {
                    router.push("/login");
                }
            });
            return () => unsubscribe();
        };
        checkAuth();
    }, [router]);

    const menuItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "profile", label: "My Profile", icon: User },
        { id: "projects", label: "My Projects", icon: Package },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "documents", label: "Documents", icon: FileText },
        { id: "support", label: "Support", icon: MessageSquare },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "overview": return <OverviewSection user={user} />;
            case "profile": return <ProfileSection user={user} loading={loading} />;
            case "projects": return <ProjectsSection />;
            default: return <div className="p-8 text-center text-slate-500">Section under construction</div>;
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 top-24 md:top-32 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:static lg:block h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] rounded-r-xl overflow-y-auto`}
            >
                <nav className="p-2 pt-8 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Sidebar Toggle - Only visible on mobile */}
                <div className="lg:hidden p-4 pb-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
                    >
                        <Menu size={20} />
                        <span className="font-medium text-sm">Menu</span>
                    </button>
                </div>

                {/* Content Area */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden top-24 md:top-32"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
