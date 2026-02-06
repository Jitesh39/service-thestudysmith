"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";

const AdminOverview = ({ totalUsers }: { totalUsers: number }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Support Tickets</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
        </div>
    </div>
);

const AdminProjects = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Manage Projects</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add New Project</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
            No projects found.
        </div>
    </div>
);

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                setTotalUsers(usersSnapshot.size);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        const checkRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.data();
                if (userData?.role !== "admin") {
                    router.push("/dashboard/client");
                } else {
                    fetchDashboardData();
                }
            }
        };
        checkRole();
    }, [router]);

    const menuItems = [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "projects", label: "Projects", icon: Briefcase },
        { id: "users", label: "Users", icon: Users },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "overview": return <AdminOverview totalUsers={totalUsers} />;
            case "projects": return <AdminProjects />;
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
