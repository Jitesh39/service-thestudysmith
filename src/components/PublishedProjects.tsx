"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowRight, Briefcase, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface Project {
    id: string;
    title: string;
    description: string;
    url?: string;
    image: string;
    createdAt?: any;
    isPublished?: boolean;
    clientProject?: {
        projectName: string;
        [key: string]: any;
    };
}

const PublishedProjects = ({ limitCount = 3 }: { limitCount?: number }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchProjects = async () => {
            try {
                const q = query(
                    collection(db, "projects"),
                    where("isPublished", "==", true),
                    orderBy("createdAt", "desc"),
                    limit(limitCount)
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                        id: doc.id,
                        ...data,
                        title: data.clientProject?.projectName || data.projectName || data.title || "Untitled Project",
                        description: data.clientProject?.description || data.description || "",
                        // image is usually outside or part of clientProject? Let's check both
                        image: data.image || data.clientProject?.image || "",
                    };
                });
                setProjects(fetched);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [limitCount]);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map(i => <div key={i} className="h-[420px] bg-white rounded-3xl animate-pulse border border-slate-100"></div>)}
        </div>
    );

    if (projects.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {projects.map((project, idx) => (
                <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 border border-slate-100 transition-all duration-500 group h-full flex flex-col relative">
                    <div className="h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <Briefcase size={40} className="text-slate-200" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        {/* Time Ago Badge */}
                        {mounted && (
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 border border-white/20">
                                <Clock size={12} className="text-blue-600" />
                                <span className="text-[10px] font-black text-slate-700 tracking-tight">
                                    Published {formatTimeAgo(project.createdAt)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                            {project.title}
                        </h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow line-clamp-3 font-medium">
                            {project.description}
                        </p>
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto group/btn bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-all duration-300 active:scale-95 shadow-lg shadow-slate-200 hover:shadow-blue-500/20"
                            >
                                Live Preview <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PublishedProjects;
