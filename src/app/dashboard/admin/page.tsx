"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, deleteDoc, setDoc, onSnapshot, collectionGroup, query, orderBy, where } from "firebase/firestore";
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
    Trash2,
    RefreshCw,
    Plus,
    UserPlus,
    Calendar,
    Mail,
    Package,
    ChevronDown,
    ChevronUp,
    Briefcase as BriefcaseIcon
} from "lucide-react";

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

const AdminOverview = ({
    user,
    loading,
    totalUsers,
    activeProjects,
    pendingPayments,
    totalTickets,
    teamMembers,
    onAddMember,
    onDeleteMember
}: {
    user: any;
    loading: boolean;
    totalUsers: number;
    activeProjects: number;
    pendingPayments: number;
    totalTickets: number;
    teamMembers: any[];
    onAddMember: (member: any) => void;
    onDeleteMember: (id: string) => void;
}) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 group">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col relative overflow-hidden">
                    {/* Unique background element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-blue-100/50"></div>

                    <div className="text-center md:text-left relative z-10 mb-8">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{getTimeGreeting()} <span className="text-blue-600">{user?.displayName || 'Admin'}</span> 👋</h2>
                        <p className="text-slate-500 mt-2 font-medium text-sm md:text-base max-w-md">System performance and user engagement overview.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 -mt-2 relative z-10 max-w-xl mx-auto w-full">
                        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center text-center group/card">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover/card:scale-110 transition-transform duration-500">
                                <Users size={20} />
                            </div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Total Users</p>
                            <p className="text-xl md:text-3xl font-black text-slate-900">{totalUsers}</p>
                        </div>
                        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center text-center group/card">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3 group-hover/card:scale-110 transition-transform duration-500">
                                <Briefcase size={20} />
                            </div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Active Projects</p>
                            <p className="text-xl md:text-3xl font-black text-slate-900">{activeProjects}</p>
                        </div>
                        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-yellow-200 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center text-center group/card">
                            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-3 group-hover/card:scale-110 transition-transform duration-500">
                                <CreditCard size={20} />
                            </div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Pending Payment</p>
                            <p className="text-xl md:text-3xl font-black text-slate-900">{pendingPayments}</p>
                        </div>
                        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center text-center group/card">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-3 group-hover/card:scale-110 transition-transform duration-500">
                                <MessageSquare size={20} />
                            </div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Support Tickets</p>
                            <p className="text-xl md:text-3xl font-black text-slate-900">{totalTickets}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <ProfileSection user={user} loading={loading} teamMembers={teamMembers} />
            </div>
        </div>

        <TeamSection
            teamMembers={teamMembers}
            onAddMember={onAddMember}
            onDeleteMember={onDeleteMember}
            hideHeader={true}
            isDashboard={true}
        />
    </div>
);

const AdminSupportSection = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "tickets"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot: any) => {
            const ticketList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            setTickets(ticketList);
            setLoading(false);
        }, (error: any) => {
            console.error("Support Fetch Error:", error);
            // Fallback without orderBy if index is missing
            const fallbackQ = query(collection(db, "tickets"));
            onSnapshot(fallbackQ, (snapshot: any) => {
                const ticketList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));
                ticketList.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setTickets(ticketList);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, []);

    const updateTicketStatus = async (id: string, newStatus: string) => {
        try {
            await setDoc(doc(db, "tickets", id), { status: newStatus }, { merge: true });
        } catch (error) {
            console.error("Status update error:", error);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Support <span className="text-blue-600">Ticket Management</span></h2>
                <p className="text-slate-500 mt-2 font-medium italic">Monitor and resolve help requests from your clients effectively.</p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / User</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.length > 0 ? (
                                tickets.map((ticket: any) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <p className="font-mono text-xs font-bold text-blue-600">{ticket.ticketId || "N/A"}</p>
                                                <p className="text-[10px] font-bold text-slate-700 capitalize tracking-wide">
                                                    {(ticket.userName || "Unknown User").toLowerCase()}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium lowercase truncate max-w-[150px]">
                                                    {ticket.userEmail}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-700 text-sm">{ticket.subject}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="group relative">
                                                <p className="text-xs text-slate-500 max-w-[250px] line-clamp-2 font-medium italic">"{ticket.message}"</p>
                                                <div className="hidden group-hover:block absolute z-20 top-full left-0 bg-white border border-slate-200 p-4 rounded-xl text-xs mt-2 w-72 shadow-2xl text-slate-600 font-medium leading-relaxed animate-in fade-in zoom-in-95">
                                                    <div className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-2 border-b pb-1">Full Message</div>
                                                    {ticket.message}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <select
                                                value={ticket.status}
                                                onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer focus:outline-none ring-1 ring-inset ${ticket.status === 'open' ? 'bg-green-50 text-green-700 ring-green-100' :
                                                    ticket.status === 'resolved' ? 'bg-blue-50 text-blue-700 ring-blue-100' :
                                                        'bg-slate-50 text-slate-500 ring-slate-100'
                                                    }`}
                                            >
                                                <option value="open">Open</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                            {ticket.createdAt?.toDate?.()?.toLocaleDateString('en-GB') || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <MessageSquare className="text-slate-200" size={48} />
                                            <p className="text-slate-400 font-bold text-lg">{loading ? "Fetching Tickets..." : "No support tickets found."}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden space-y-4">
                {tickets.length > 0 ? (
                    tickets.map((ticket: any) => (
                        <div key={ticket.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="font-mono text-xs font-black text-blue-600">{ticket.ticketId || "N/A"}</p>
                                    <p className="text-[10px] font-bold text-slate-700 capitalize tracking-wider">
                                        {(ticket.userName || "Unknown User").toLowerCase()}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400 lowercase tracking-wider">
                                        {ticket.userEmail}
                                    </p>
                                </div>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest focus:outline-none ${ticket.status === 'open' ? 'bg-green-100 text-green-700' :
                                        ticket.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    <option value="open">Open</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-bold text-slate-800 leading-tight">{ticket.subject}</h4>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{ticket.message}"</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Raised On</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {ticket.createdAt?.toDate?.()?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) || "N/A"}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                        <MessageSquare className="mx-auto text-slate-200 mb-3" size={40} />
                        <p className="text-slate-400 font-bold">{loading ? "Fetching Tickets..." : "No support tickets found."}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TeamSection = ({ teamMembers, onAddMember, onDeleteMember, hideHeader = false, isDashboard = false }: { teamMembers: any[], onAddMember: (member: any) => void, onDeleteMember: (id: string) => void, hideHeader?: boolean, isDashboard?: boolean }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        designation: "",
        joinedDate: new Date().toISOString().split('T')[0],
        pic: ""
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload-team-member", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setNewMember({ ...newMember, pic: data.url });
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddMember(newMember);
        setNewMember({
            name: "",
            email: "",
            designation: "",
            joinedDate: new Date().toISOString().split('T')[0],
            pic: ""
        });
        setIsAdding(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
            {!hideHeader && (
                <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Our Team</h2>
                        <p className="text-sm text-slate-500 font-medium">Manage your team members and their roles</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 active:scale-95 w-full sm:w-auto"
                    >
                        {isAdding ? <X size={18} /> : <Plus size={18} />}
                        {isAdding ? "Cancel" : "Add Member"}
                    </button>
                </div>
            )}

            {isAdding && (
                <div className="p-6 bg-blue-50/30 border-b border-blue-50 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter Your Name"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                placeholder="abc@thestudysmith.com"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                            <input
                                required
                                type="text"
                                placeholder="Senior Web Developer"
                                value={newMember.designation}
                                onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Joined Date</label>
                            <input
                                required
                                type="date"
                                value={newMember.joinedDate}
                                onChange={(e) => setNewMember({ ...newMember, joinedDate: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profile Photo</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="team-member-pic"
                                />
                                <label
                                    htmlFor="team-member-pic"
                                    className={`flex items-center justify-center gap-2 w-full bg-white border border-dashed border-slate-300 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    {isUploading ? (
                                        <RefreshCw size={16} className="animate-spin" />
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                    {newMember.pic ? "Change Photo" : "Upload Photo"}
                                </label>
                                {newMember.pic && (
                                    <div className="mt-2 text-[10px] text-green-600 font-bold flex items-center gap-1">
                                        ✓ Uploaded: {newMember.pic.split('/').pop()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                Save Member
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Team Member</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Designation</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Joined Date</th>
                            {!isDashboard && <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {teamMembers.length > 0 ? (
                            teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                                {member.pic ? (
                                                    <img src={member.pic} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-sm bg-blue-50">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 leading-none">{member.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {member.designation}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(member.joinedDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    {!isDashboard && (
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (confirm("Remove this team member?")) onDeleteMember(member.id);
                                                }}
                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isDashboard ? 3 : 4} className="p-12 text-center text-slate-400 font-medium">
                                    No team members added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-slate-50/30">
                {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                        <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                        {member.pic ? (
                                            <img src={member.pic} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-lg bg-blue-50">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.designation}</p>
                                    </div>
                                </div>
                                {!isDashboard && (
                                    <button
                                        onClick={() => {
                                            if (confirm("Remove this team member?")) onDeleteMember(member.id);
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                    <p className="text-xs text-slate-600 truncate font-medium">{member.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined Date</p>
                                    <p className="text-xs text-slate-600 font-medium">{new Date(member.joinedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm font-medium">No team members added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileSection = ({ user, loading, teamMembers }: { user: any; loading: boolean, teamMembers: any[] }) => {
    const teamMember = teamMembers.find(member => member.email === user?.email);
    const adminDesignation = teamMember?.designation || "Administrator";
    const adminPic = teamMember?.pic;

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
        <div className="h-full bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 border-b border-slate-50 pb-4">Admin Profile</h2>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-8 border-b border-slate-50">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
                        {adminPic ? (
                            <img src={adminPic} alt={user?.displayName || 'Admin'} className="w-full h-full object-cover" />
                        ) : (
                            user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A')
                        )}
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{user?.displayName || 'Admin Account'}</h3>
                        <p className="text-slate-500 font-medium text-sm md:text-base">{user?.email}</p>
                        <span className="inline-block mt-3 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            {adminDesignation}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold text-lg shadow-sm ring-1 ring-slate-200/50">
                            {user?.displayName || 'Not Set'}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold text-lg shadow-sm ring-1 ring-slate-200/50">
                            {user?.email || 'Not Set'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminProjects = ({ sheetUrl, onUpdateUrl }: { sheetUrl: string, onUpdateUrl: (url: string) => void }) => {
    const [tempUrl, setTempUrl] = useState(sheetUrl);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(Date.now());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [lastSynced, setLastSynced] = useState<string | null>(null);

    // Sync tempUrl with sheetUrl when it changes externally
    useEffect(() => {
        setTempUrl(sheetUrl);
    }, [sheetUrl]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setRefreshKey(Date.now());
        setLastSynced(new Date().toLocaleTimeString());
        setTimeout(() => setIsRefreshing(false), 800);
    };

    // Construct the final URL with a cache-busting parameter, handling hashes correctly
    const getFinalUrl = (url: string) => {
        if (!url) return "";
        try {
            // Split by hash to ensure query params come before the fragment
            const [base, hash] = url.split("#");
            const separator = base.includes("?") ? "&" : "?";
            return `${base}${separator}nocache=${refreshKey}${hash ? "#" + hash : ""}`;
        } catch (e) {
            return url;
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight text-center lg:text-left">Project Tracker</h2>
                    <p className="text-slate-500 text-sm font-medium text-center lg:text-left">Real-time collaboration via Google Sheets</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {lastSynced && !isEditing && (
                        <div className="flex flex-col items-center sm:items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Last Sync</span>
                            <span className="text-xs font-semibold text-blue-600">{lastSynced}</span>
                        </div>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {sheetUrl && (
                            <button
                                onClick={handleRefresh}
                                className={`p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all active:scale-95 ${isRefreshing ? "bg-blue-50" : ""}`}
                                title="Sync Sheet Now"
                            >
                                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                            </button>
                        )}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border ${isEditing
                                ? "bg-slate-100 border-slate-200 text-slate-700"
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm"
                                }`}
                        >
                            <Settings size={16} className={isEditing ? "animate-spin-slow" : ""} />
                            <span>{isEditing ? "Cancel" : "Config Sheet"}</span>
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Briefcase size={16} />
                            <span>Add Project</span>
                        </button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-blue-800">
                        <Settings size={18} />
                        <label className="text-sm font-bold uppercase tracking-wider">Spreadsheet Configuration</label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder="Paste Google Sheet 'Publish to web' URL here..."
                            className="flex-1 bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                        />
                        <button
                            onClick={() => {
                                onUpdateUrl(tempUrl);
                                setIsEditing(false);
                            }}
                            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                    <div className="mt-4 flex items-start gap-3 bg-white/50 p-3 rounded-lg border border-white/80">
                        <div className="mt-0.5 text-blue-600 font-bold text-lg">i</div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            To get your link: Open your Google Sheet → Go to <span className="font-bold">File</span> → <span className="font-bold">Share</span> → <span className="font-bold">Publish to web</span> → Select <span className="font-bold">Embed</span> and copy the URL within the <code className="bg-slate-100 px-1 rounded">src="..."</code> attribute.
                            <br /><br />
                            <span className="text-blue-700 font-bold">Important:</span> Your sheet MUST include columns for <span className="font-bold">"Project ID"</span> and <span className="font-bold">"Email Address"</span> for the client portal.
                            <br />
                            <span className="font-bold">Recommended Column Names:</span> Project ID, Email Address, Project Name, Enquire Date, Project Status, Payment, Payment Status.
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px] relative group border-t-4 border-t-blue-500">
                {sheetUrl ? (
                    <div className="w-full h-full relative flex flex-col">
                        {/* Mobile view helper */}
                        <div className="lg:hidden bg-blue-50/50 border-b border-blue-100 px-4 py-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                <Eye size={12} /> Scroll inside sheet to view
                            </span>
                            <a
                                href={sheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase flex items-center gap-1"
                            >
                                Full Screen <Eye size={10} />
                            </a>
                        </div>

                        <div className="flex-1 overflow-x-auto relative">
                            {isRefreshing && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center animate-in fade-in duration-300">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                        <p className="text-blue-600 font-bold text-sm">Syncing Data...</p>
                                    </div>
                                </div>
                            )}
                            <iframe
                                key={refreshKey}
                                src={getFinalUrl(sheetUrl)}
                                className="w-full h-full border-0 min-w-[320px]"
                                allowFullScreen
                                loading="lazy"
                                title="Active Projects Sheet"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-100 animate-bounce-subtle">
                            <Briefcase className="text-blue-500" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Streamline Your Workflow</h3>
                        <p className="max-w-md text-slate-500 text-lg mb-8 font-medium">
                            Connect your Google Sheet project tracker to see all active projects, deadlines, and milestones directly in your admin dashboard.
                        </p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                        >
                            Connect Project Sheet
                            <Settings size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AssignedProjectsSection = ({ projects, users, onDelete }: { projects: any[], users: any[], onDelete: (uid: string, pid: string) => void }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                <div className="w-full px-4 py-4 md:px-6 md:py-5 border-b border-slate-50 bg-slate-50/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <Package className="text-blue-600 shrink-0 w-5 h-5 md:w-6 md:h-6" />
                        <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight uppercase truncate">
                            Active Client <span className="text-blue-600">Project</span>
                        </h2>
                        <span className="shrink-0 text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {projects.length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto animate-in slide-in-from-top-2 duration-300 scrollbar-thin scrollbar-thumb-slate-200">
                    <table className="w-full text-left min-w-[600px] md:min-w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Enquired Date</th>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Target Date</th>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="p-3 md:p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {projects.length > 0 ? (
                                projects.map((proj, i) => {
                                    const client = users.find(u => u.uid === proj.uid);
                                    return (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-3 md:p-4">
                                                <span className="font-mono text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    {proj.projectId || proj.docId || "N/A"}
                                                </span>
                                            </td>
                                            <td className="p-3 md:p-4">
                                                <p className="font-bold text-slate-700 text-xs md:text-sm">{proj.projectName || "No Title Set"}</p>
                                            </td>
                                            <td className="p-3 md:p-4">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] md:text-xs font-bold text-slate-700">{client?.displayName || "Unknown"}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium italic truncate max-w-[120px] md:max-w-none">{client?.email || "No Email"}</p>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-4 text-center">
                                                <p className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">{formatDate(proj.enquireDate || proj.date)}</p>
                                            </td>
                                            <td className="p-3 md:p-4 text-center">
                                                <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{formatDate(proj.targetDate)}</p>
                                            </td>
                                            <td className="p-3 md:p-4 text-center">
                                                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border ${(proj.projectStatus || proj.status)?.toLowerCase() === 'completed'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                                    }`}>
                                                    {proj.projectStatus || proj.status || "Active"}
                                                </span>
                                            </td>
                                            <td className="p-3 md:p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Remove project ID ${proj.projectId || proj.docId}?`)) {
                                                            onDelete(proj.uid, proj.docId);
                                                        }
                                                    }}
                                                    className="p-1.5 md:p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-12 md:p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <BriefcaseIcon className="text-slate-200 w-10 h-10 md:w-12 md:h-12" />
                                            <p className="text-slate-400 font-bold text-sm md:text-lg">No active project IDs found.</p>
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
                                            {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
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
    const [activeSection, setActiveSection] = useState<string>("");

    // Persist active section on refresh
    useEffect(() => {
        const savedSection = localStorage.getItem("adminActiveSection");
        setActiveSection(savedSection || "overview");
    }, []);

    useEffect(() => {
        if (activeSection) {
            localStorage.setItem("adminActiveSection", activeSection);
        }
    }, [activeSection]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeProjects, setActiveProjects] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [sheetUrl, setSheetUrl] = useState("");
    const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let unsubscribeSettings: (() => void) | undefined;
        let unsubscribeTeam: (() => void) | undefined;
        let unsubscribeTickets: (() => void) | undefined;
        let unsubscribeProjects: (() => void) | undefined;

        const checkAuth = async () => {
            const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
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

                        // Fetch real-time settings (including Google Sheet URL)
                        unsubscribeSettings = onSnapshot(doc(db, "settings", "dashboard"), (settingsDoc) => {
                            if (settingsDoc.exists()) {
                                setSheetUrl(settingsDoc.data().sheetUrl || "");
                            }
                        });

                        // Fetch real-time team members
                        unsubscribeTeam = onSnapshot(collection(db, "team"), (snapshot) => {
                            const teamList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                            // Sort by joinedDate (oldest first)
                            const sortedTeam = [...teamList].sort((a: any, b: any) => {
                                const dateA = new Date(a.joinedDate).getTime();
                                const dateB = new Date(b.joinedDate).getTime();
                                return dateA - dateB;
                            });
                            setTeamMembers(sortedTeam);
                        });

                        // Fetch real-time active (open) ticket count
                        const openTicketsQuery = query(collection(db, "tickets"), where("status", "==", "open"));
                        unsubscribeTickets = onSnapshot(openTicketsQuery, (snapshot) => {
                            setTotalTickets(snapshot.size);
                        });

                        // Fetch real-time active projects from all clients
                        unsubscribeProjects = onSnapshot(collectionGroup(db, "assignedProjects"), (snapshot) => {
                            const projectsList = snapshot.docs.map(doc => ({
                                ...doc.data(),
                                docId: doc.id,
                                uid: doc.ref.path.split('/')[1] // Safer way to get parent document ID from collectionGroup
                            }));
                            setAssignedProjects(projectsList);
                            setActiveProjects(snapshot.size);
                        });

                        // Fetch other dashboard data once
                        try {
                            const usersSnapshot = await getDocs(collection(db, "users"));
                            const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));

                            // Sort users: Admin first, then by date descending
                            const sortedUsers = usersList.sort((a: any, b: any) => {
                                // Admin always on top
                                if (a.role === 'admin' && b.role !== 'admin') return -1;
                                if (a.role !== 'admin' && b.role === 'admin') return 1;

                                // Then ascending by join date (oldest first)
                                const dateA = a.createdAt?.seconds || 0;
                                const dateB = b.createdAt?.seconds || 0;
                                return dateA - dateB;
                            });

                            setAllUsers(sortedUsers);
                            setTotalUsers(usersSnapshot.size);
                        } catch (error) {
                            console.error("Error fetching dashboard data:", error);
                        }
                    }
                } else {
                    router.push("/login");
                }
            });

            return unsubscribeAuth;
        };

        const authCleanupPromise = checkAuth();

        return () => {
            authCleanupPromise.then(cleanup => cleanup && cleanup());
            if (unsubscribeSettings) unsubscribeSettings();
            if (unsubscribeTeam) unsubscribeTeam();
            if (unsubscribeTickets) unsubscribeTickets();
            if (unsubscribeProjects) unsubscribeProjects();
        };
    }, [router]);

    // Fetch pending payments from Google Sheet
    useEffect(() => {
        if (!sheetUrl) return;

        const fetchPendingPayments = async () => {
            try {
                const csvUrl = sheetUrl.replace('/pubhtml', '/pub') + (sheetUrl.includes('?') ? '&' : '?') + 'output=csv';
                const response = await fetch(csvUrl);
                if (!response.ok) return;
                const csvText = await response.text();

                const rows = csvText.split(/\r?\n/).filter(row => row.trim());
                if (rows.length < 2) return;

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

                const headers = splitRow(rows[0]).map(h => h.toLowerCase().trim());
                const statusIndex = headers.findIndex(h =>
                    ['payment status', 'status', 'paymentstatus', 'pay status'].includes(h)
                );
                const idIndex = headers.findIndex(h =>
                    ['project id', 'id', 'projectid'].includes(h)
                );
                const enquiredIndex = headers.findIndex(h =>
                    ['enquired date', 'enquired', 'enquire date', 'date'].includes(h)
                );
                const targetIndex = headers.findIndex(h =>
                    ['target date', 'target'].includes(h)
                );
                const nameIndex = headers.findIndex(h =>
                    ['project name', 'project', 'title'].includes(h)
                );

                if (statusIndex === -1) {
                    setPendingPayments(0);
                } else {
                    let count = 0;
                    for (let i = 1; i < rows.length; i++) {
                        const values = splitRow(rows[i]);
                        if (values[statusIndex]?.toLowerCase() === 'pending') {
                            count++;
                        }
                    }
                    setPendingPayments(count);
                }

                // Sync project details with Firestore
                if (idIndex !== -1 && assignedProjects.length > 0) {
                    for (let i = 1; i < rows.length; i++) {
                        const values = splitRow(rows[i]);
                        const sheetPid = values[idIndex]?.trim();
                        if (!sheetPid) continue;

                        const matchedProj = assignedProjects.find(p => p.projectId === sheetPid);
                        if (matchedProj) {
                            const updates: any = {};
                            const sheetEnquired = enquiredIndex !== -1 ? values[enquiredIndex]?.trim() : null;
                            const sheetTarget = targetIndex !== -1 ? values[targetIndex]?.trim() : null;
                            const sheetStatus = statusIndex !== -1 ? values[statusIndex]?.trim() : null;
                            const sheetName = nameIndex !== -1 ? values[nameIndex]?.trim() : null;

                            if (sheetEnquired && matchedProj.enquireDate !== sheetEnquired) updates.enquireDate = sheetEnquired;
                            if (sheetTarget && matchedProj.targetDate !== sheetTarget) updates.targetDate = sheetTarget;
                            if (sheetStatus && matchedProj.paymentStatus !== sheetStatus) updates.paymentStatus = sheetStatus;
                            if (sheetName && matchedProj.projectName !== sheetName) updates.projectName = sheetName;

                            if (Object.keys(updates).length > 0) {
                                const projRef = doc(db, "users", matchedProj.uid, "assignedProjects", matchedProj.docId);
                                await setDoc(projRef, updates, { merge: true });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching sheet data:", error);
            }
        };

        fetchPendingPayments();
    }, [sheetUrl, assignedProjects]);

    const isSuperAdmin = user?.email === "thestudysmithpu@gmail.com";

    const menuItems = [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "projects", label: "Projects Tracker", icon: Briefcase },
        { id: "active-ids", label: "Active Client Projects", icon: Package },
        { id: "users", label: "Users", icon: Users },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "support", label: "Support Tickets", icon: MessageSquare },
        ...(isSuperAdmin ? [{ id: "settings", label: "Control Panel", icon: Settings }] : []),
    ];

    const handleAddTeamMember = async (member: any) => {
        try {
            const teamRef = collection(db, "team");
            await setDoc(doc(teamRef), {
                ...member,
                createdAt: new Date()
            });
            alert("Team member added successfully!");
        } catch (error) {
            console.error("Error adding team member:", error);
            alert("Failed to add team member.");
        }
    };

    const handleDeleteTeamMember = async (id: string) => {
        try {
            await deleteDoc(doc(db, "team", id));
            alert("Team member removed successfully!");
        } catch (error) {
            console.error("Error deleting team member:", error);
            alert("Failed to remove team member.");
        }
    };

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

    const handleDeleteProjectID = async (uid: string, docId: string) => {
        if (!uid || !docId) {
            alert("Error: Missing identification data for this project assignment.");
            return;
        }
        try {
            await deleteDoc(doc(db, "users", uid, "assignedProjects", docId));
            alert("Project ID removed successfully from user!");
        } catch (error) {
            console.error("Error deleting project ID:", error);
            alert("Failed to remove project ID.");
        }
    };

    const handleUpdateSheetUrl = async (url: string) => {
        try {
            await setDoc(doc(db, "settings", "dashboard"), {
                sheetUrl: url,
                updatedAt: new Date()
            }, { merge: true });
            setSheetUrl(url);
            alert("Project sheet configuration updated successfully!");
        } catch (error) {
            console.error("Error updating sheet URL:", error);
            alert("Failed to update sheet configuration.");
        }
    };

    const renderContent = () => {
        if (loading && activeSection === "profile") return <ProfileSection user={null} loading={true} teamMembers={teamMembers} />;

        switch (activeSection) {
            case "overview": return (
                <AdminOverview
                    user={user}
                    loading={loading}
                    totalUsers={totalUsers}
                    activeProjects={activeProjects}
                    pendingPayments={pendingPayments}
                    totalTickets={totalTickets}
                    teamMembers={teamMembers}
                    onAddMember={handleAddTeamMember}
                    onDeleteMember={handleDeleteTeamMember}
                />
            );
            case "projects": return <AdminProjects sheetUrl={sheetUrl} onUpdateUrl={handleUpdateSheetUrl} />;
            case "active-ids": return <AssignedProjectsSection projects={assignedProjects} users={allUsers} onDelete={handleDeleteProjectID} />;
            case "users": return <UsersSection users={allUsers} totalUsers={totalUsers} onDelete={handleDeleteUser} currentUserEmail={user?.email} />;
            case "support": return <AdminSupportSection />;
            case "settings":
                if (!isSuperAdmin) {
                    return <div className="p-8 text-center text-red-500 font-bold">Access Denied: Super Admin Only</div>;
                }
                return (
                    <div className="space-y-6">
                        <TeamSection
                            teamMembers={teamMembers}
                            onAddMember={handleAddTeamMember}
                            onDeleteMember={handleDeleteTeamMember}
                        />
                    </div>
                );
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
                    <button
                        onClick={async () => {
                            localStorage.removeItem("adminActiveSection");
                            await signOut(auth);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
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
