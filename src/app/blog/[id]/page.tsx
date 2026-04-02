"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    authorName: string;
    authorRole: string;
    createdAt?: any;
}

export default function SingleBlogPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!params?.id) return;

            try {
                const docRef = doc(db, "blogs", params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBlog({ id: docSnap.id, ...docSnap.data() } as Blog);
                } else {
                    console.error("Blog not found!");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="animate-spin text-blue-600" />
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Loading Article...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Article Not Found</h1>
                    <p className="text-slate-500 mb-8">The blog you are looking for does not exist or has been removed.</p>
                    <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition">
                        Back to Blogs
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <article className="container max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Back button */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-wider mb-8 transition-colors group">
                        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </Link>

                    {/* Header */}
                    <header className="mb-12 text-center">
                        <div className="inline-flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest justify-center mb-6">
                            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full">
                                <User size={14} />
                                {blog.authorName} ({blog.authorRole === 'admin' ? 'Admin' : 'Team'})
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight max-w-3xl mx-auto">
                            {blog.title}
                        </h1>
                    </header>

                    {/* Featured Image */}
                    <div className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl relative">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem]"></div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700">
                        {/* We split by newlines to render basic paragraphs properly since it's simple text area input */}
                        {blog.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() ? (
                                <p key={index} className="text-slate-600 leading-relaxed mb-6 text-[17px] md:text-lg">
                                    {paragraph}
                                </p>
                            ) : null
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center">
                        <Link href="/blog" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-black transition-colors shadow-xl shadow-slate-900/20">
                            Explore More Articles
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
