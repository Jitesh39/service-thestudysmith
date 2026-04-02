"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { ArrowRight, User, Calendar, RefreshCw } from 'lucide-react';
import { FadeUp } from '@/components/MotionWrappers';

interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    authorName: string;
    authorRole: string;
    createdAt?: any;
}

export default function BlogListingPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Blog));

                setBlogs(data);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <FadeUp>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Our Latest Insights</h1>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Discover thoughts, strategies, and updates from the team at TheStudySmith. We share our expertise to help you build better web solutions.
                            </p>
                        </FadeUp>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <RefreshCw size={40} className="animate-spin text-blue-600" />
                            <p className="text-slate-500 font-medium">Loading articles...</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Articles Published</h3>
                            <p className="text-slate-500">Check back later for exciting insights and updates.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, idx) => (
                                <FadeUp key={blog.id} delay={idx * 0.1}>
                                    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-800">
                                                    {blog.authorRole === 'admin' ? 'Admin Post' : 'Team Member'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-50 pb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-blue-500" />
                                                    {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User size={14} className="text-blue-500" />
                                                    {blog.authorName}
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                {blog.title}
                                            </h2>

                                            <p className="text-slate-600 line-clamp-3 mb-8 flex-1 leading-relaxed">
                                                {blog.content}
                                            </p>

                                            <Link
                                                href={`/blog/${blog.id}`}
                                                className="mt-auto inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 group/link"
                                            >
                                                Read Full Article
                                                <ArrowRight size={18} className="transform group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </FadeUp>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Importing missing component inside file for error handling safely since it uses FileText
import { FileText } from 'lucide-react';
