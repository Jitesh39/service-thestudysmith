"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { Pencil, Trash2, Plus, RefreshCw, Image as ImageIcon, X } from 'lucide-react';

// Fixing imports
import { collection as firestoreCollection, query as firestoreQuery, orderBy as firestoreOrderBy, getDocs as firestoreGetDocs, addDoc as firestoreAddDoc, updateDoc as firestoreUpdateDoc, deleteDoc as firestoreDeleteDoc, doc as firestoreDoc, serverTimestamp as firestoreServerTimestamp, where as firestoreWhere } from 'firebase/firestore';

export interface Blog {
    id: string;
    title: string;
    content: string;
    image: string;
    authorName: string;
    authorRole: string;
    authorId: string;
    createdAt?: any;
    updatedAt?: any;
}

const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "thestudysmith_blogs");
        formData.append("folder", "thestudysmith/blogs");

        const response = await fetch(`https://api.cloudinary.com/v1_1/db0vcogoj/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to upload image.");
        }
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

export default function BlogManagementSection({ user }: { user: any }) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form'>('list');

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Auth context details
    const isAdmin = user?.role === 'admin' || user?.email === 'thestudysmithpu@gmail.com';
    const authorRole = isAdmin ? 'admin' : 'team';
    const authorName = user?.displayName || user?.email?.split('@')[0] || 'Author';

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            let q;
            if (isAdmin) {
                // Admins see all
                q = firestoreQuery(firestoreCollection(db, "blogs"), firestoreOrderBy("createdAt", "desc"));
            } else {
                // Team sees their own
                q = firestoreQuery(firestoreCollection(db, "blogs"), firestoreWhere("authorId", "==", user.uid));
            }

            const snapshot = await firestoreGetDocs(q);
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Blog));

            // if not admin, we might need to sort manually since where + orderBy requires an index
            if (!isAdmin) {
                data.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });
            }

            setBlogs(data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.uid) {
            fetchBlogs();
        }
    }, [user]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadImageToCloudinary(file);
            setImage(url);
        } catch (error: any) {
            alert("Image upload failed: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !image) {
            alert("Please fill all fields and upload an image.");
            return;
        }

        setIsSaving(true);
        try {
            if (editingId) {
                await firestoreUpdateDoc(firestoreDoc(db, "blogs", editingId), {
                    title,
                    content,
                    image,
                    updatedAt: firestoreServerTimestamp()
                });
                alert("Blog updated successfully!");
            } else {
                await firestoreAddDoc(firestoreCollection(db, "blogs"), {
                    title,
                    content,
                    image,
                    authorName,
                    authorRole,
                    authorId: user.uid,
                    createdAt: firestoreServerTimestamp()
                });
                alert("Blog created successfully!");
            }
            resetForm();
            fetchBlogs();
        } catch (error: any) {
            alert("Failed to save blog: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        try {
            await firestoreDeleteDoc(firestoreDoc(db, "blogs", id));
            setBlogs(blogs.filter(b => b.id !== id));
            alert("Blog deleted");
        } catch (error: any) {
            alert("Failed to delete: " + error.message);
        }
    };

    const handleEdit = (blog: Blog) => {
        setEditingId(blog.id);
        setTitle(blog.title);
        setContent(blog.content);
        setImage(blog.image);
        setView('form');
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImage('');
        setView('list');
    };

    if (view === 'form') {
        return (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{editingId ? 'Edit Blog' : 'Write New Blog'}</h2>
                    <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Blog Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter an engaging title..."
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
                        <div className="flex items-center gap-4">
                            {image && (
                                <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                    <img src={image} alt="Cover Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <label className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed ${image ? 'border-slate-200' : 'border-blue-200 bg-blue-50/50'} rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition-colors`}>
                                {isUploading ? (
                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                        <RefreshCw size={20} className="animate-spin" /> Uploading...
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-500">
                                        <ImageIcon size={24} className="text-blue-500" />
                                        <span className="text-sm font-medium">{image ? 'Change Cover Image' : 'Select Cover Image'}</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUploading} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Blog Content</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Write your amazing content here... (Supports basic formatting with line breaks)"
                            className="w-full px-4 py-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px] font-medium resize-y"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                        <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg text-slate-600 font-bold hover:bg-slate-100 transition-colors disabled:opacity-50" disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving || isUploading} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : null}
                            {editingId ? 'Update Blog' : 'Publish Blog'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-50 pb-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Blog Management</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Manage published articles and write new ones.</p>
                </div>
                <button onClick={() => setView('form')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm">
                    <Plus size={18} /> Write Blog
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <RefreshCw size={32} className="animate-spin text-blue-600 border-opacity-50" />
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-slate-500 font-medium">No published blogs yet.</p>
                    <button onClick={() => setView('form')} className="mt-4 text-blue-600 font-bold hover:underline">Write the first one!</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                            <div className="h-48 overflow-hidden relative group bg-slate-100">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    {blog.authorName} ({blog.authorRole})
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">{blog.title}</h3>
                                <p className="text-slate-500 text-sm flex-1 line-clamp-3 mb-4">{blog.content}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-auto">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-GB') : 'Just now'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
