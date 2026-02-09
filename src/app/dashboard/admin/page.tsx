"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
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
    X,
    User,
    Eye,
    EyeOff,
    Trash2
} from "lucide-react";

const AdminOverview = ({ user, totalUsers }: { user: any; totalUsers: number }) => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Welcome back, <span className="text-blue-600">{user?.displayName?.split(' ')[0] || 'Admin'}!</span> 👋</h2>
                <p className="text-slate-500 mt-2 font-medium">System performance and user engagement overview.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Active Projects</p>
                <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Support Tickets</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Profile</h2>
            <div className="space-y-8">
                <div className="flex items-center gap-5 pb-6 border-b border-slate-50">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A')}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{user?.displayName || 'Admin Account'}</h3>
                        <p className="text-slate-500 font-medium">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Administrator</span>
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

const UsersSection = ({ users, totalUsers, onDelete, currentUserEmail }: { users: any[], totalUsers: number, onDelete: (uid: string) => void, currentUserEmail?: string }) => {
    const isSuperAdmin = currentUserEmail === 'thestudysmithpu@gmail.com';
    const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});

    const togglePassword = (index: number) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
            </div>

            {/* User Count Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Signups</p>
                        <p className="text-2xl font-black text-slate-900">{totalUsers}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Join</th>
                                {isSuperAdmin && <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Password</th>}
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                {isSuperAdmin && <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.length > 0 ? (
                                users.map((u, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {u.displayName?.charAt(0) || 'U'}
                                                </div>
                                                <span className="font-semibold text-slate-700">{u.displayName || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{u.email}</td>
                                        <td className="p-4 text-slate-500 text-sm">
                                            {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                                        {visiblePasswords[i] ? (u.password || '••••••••') : '••••••••'}
                                                    </span>
                                                    {u.password && (
                                                        <button
                                                            onClick={() => togglePassword(i)}
                                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            {visiblePasswords[i] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role || 'client'}
                                            </span>
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this user?')) {
                                                            onDelete(u.uid);
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isSuperAdmin ? 6 : 4} className="p-12 text-center text-slate-400 font-medium">
                                        No users registered yet.
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

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all users to get real-time signup count and details
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersList = usersSnapshot.docs.map(doc => doc.data());
                setAllUsers(usersList);
                setTotalUsers(usersSnapshot.size);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        const checkAuth = async () => {
            auth.onAuthStateChanged(async (currentUser) => {
                if (currentUser) {
                    if (!currentUser.emailVerified) {
                        router.push("/login");
                        return;
                    }
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    const userData = userDoc.data();

                    if (userData?.role !== "admin") {
                        router.push("/dashboard/client");
                    } else {
                        setUser({ ...currentUser, ...userData });
                        setLoading(false);
                        fetchDashboardData();
                    }
                } else {
                    router.push("/login");
                }
            });
        };

        checkAuth();
    }, [router]);

    const menuItems = [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "profile", label: "Admin Profile", icon: User },
        { id: "projects", label: "Projects", icon: Briefcase },
        { id: "users", label: "Users", icon: Users },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const handleDeleteUser = async (uid: string) => {
        try {
            await deleteDoc(doc(db, "users", uid));
            // Update local state
            const updatedUsers = allUsers.filter(u => u.uid !== uid);
            setAllUsers(updatedUsers);
            setTotalUsers(updatedUsers.length);
            alert("User deleted successfully from the list.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    const renderContent = () => {
        if (loading && activeSection === "profile") return <ProfileSection user={null} loading={true} />;

        switch (activeSection) {
            case "overview": return <AdminOverview user={user} totalUsers={totalUsers} />;
            case "profile": return <ProfileSection user={user} loading={loading} />;
            case "projects": return <AdminProjects />;
            case "users": return <UsersSection users={allUsers} totalUsers={totalUsers} onDelete={handleDeleteUser} currentUserEmail={user?.email} />;
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
