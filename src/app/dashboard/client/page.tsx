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
const OverviewSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Total Projects', 'Active Projects', 'Pending Payments', 'Unread Messages'].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm mb-1">{item}</p>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
            ))}
        </div>
        {/* Recent Activity or Project Status could go here */}
    </div>
);

const ProfileSection = () => (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h2>
        <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold">
                    U
                </div>
                <div>
                    <button className="text-sm text-blue-600 font-medium hover:underline">Change Photo</button>
                    <p className="text-xs text-slate-500 mt-1">Allowed JPG, GIF or PNG. Max size of 800K</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2" placeholder="Your Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-slate-50 text-slate-500" disabled value="user@example.com" />
                </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Save Changes</button>
        </div>
    </div>
);

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
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="p-4 text-slate-500">#PROJ-001</td>
                        <td className="p-4 font-medium text-slate-800">E-Commerce Website</td>
                        <td className="p-4 text-slate-500">Oct 24, 2025</td>
                        <td className="p-4"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span></td>
                        <td className="p-4"><button className="text-blue-600 hover:underline text-sm">View Details</button></td>
                    </tr>
                </tbody>
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
    const router = useRouter();

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
            case "overview": return <OverviewSection />;
            case "profile": return <ProfileSection />;
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
