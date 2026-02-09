"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltWrapper from "@/components/TiltWrapper";
import { FadeUp } from "@/components/MotionWrappers";

// Project Data - Add new projects here
const projects = [
    {
        title: "Project Owl",
        // category: "Portfolio Website",
        description: "A sleek portfolio website designed to showcase a photography business, highlighting work, services, and creative vision professionally.",
        // technologies: ["React", "Tailwind CSS"],
        image: "project-demo/project-owl.png",
        theme: "blue",
        demoUrl: "https://project-owl-one.vercel.app"
    },
    {
        title: "ResumeForge AI",
        description: "Comprehensive hospital management system handling patient records, appointments, and doctor scheduling efficiently.",
        image: "project-demo/resumeforgeai.png",
        demoUrl: "https://resumeforgeai-pi.vercel.app/"
    },
    {
        title: "MyLifeInfo Vault",
        description: "A secure digital platform to store, organize, and share essential will and emergency information when it matters most.",
        image: "project-demo/mylifeinfo.png",
        demoUrl: "https://mylifeinfo-vault.vercel.app/"
    },
    {
        title: "TheStudySmith",
        description: "TheStudySmith is an all-in-one academic platform for Parul University students, providing organized study materials, notes, question banks, and helpful resources to make learning simpler, faster, and more effective.",
        image: "project-demo/thestudysmith.png",
        demoUrl: "https://thestudysmith9.wordpress.com"
    },
    {
        title: "Personal Portfolio",
        description: "A personal portfolio website to showcase skills, projects, and professional achievements.",
        image: "project-demo/portfolio-jitesh.png",
        demoUrl: "https://jitesh-z.netlify.app"
    },
    {
        title: "VivaMentor",
        description: "VivaMentor is a focused learning platform that helps students confidently prepare for project reviews and viva examinations.",
        image: "project-demo/vivamentor.png",
        demoUrl: "https://vivamentor.vercel.app/"
    },
    {
        title: "CivicTrack",
        description: "A civic issue reporting and tracking platform that helps communities raise, monitor, and resolve local problems transparently.",
        image: "project-demo/civictrack.png",
        demoUrl: "https://civictrack-mu.vercel.app/"
    },
    {
        title: "Service-TheStudySmith",
        description: "A service platform by TheStudySmith that helps students get simple, professional static websites quickly and affordably.",
        image: "project-demo/service-thestudysmith.png",
        demoUrl: "https://service-thestudysmith.vercel.app/"
    }

];

// Reusable Project Card Component - Memoized to prevent re-renders (optional but good practice)
const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
    // Dynamic styling based on theme
    const themeStyles = {
        blue: { gradient: "from-blue-500 to-indigo-600", pill: "bg-blue-50 text-blue-600" },
        emerald: { gradient: "from-emerald-500 to-teal-600", pill: "bg-emerald-50 text-emerald-600" },
        violet: { gradient: "from-violet-500 to-purple-600", pill: "bg-violet-50 text-violet-600" }
    }[project.theme as "blue" | "emerald" | "violet"] || { gradient: "from-blue-500 to-indigo-600", pill: "bg-blue-50 text-blue-600" };

    return (
        <TiltWrapper>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 group flex flex-col h-full">
                <div className="h-64 bg-slate-100 flex items-center justify-center relative overflow-hidden shrink-0 group">
                    {/* Image or Gradient Fallback */}
                    {project.image ? (
                        <>
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                        </>
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${themeStyles.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                    )}

                    {/* Category Badge overlay on image */}
                    {/* <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold rounded-md shadow-sm border border-white/20">
                            {project.category}
                        </span>
                    </div> */}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    {/* <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.technologies.map((tech, i) => (
                            <span key={i} className={`px-2.5 py-0.5 ${themeStyles.pill} text-[10px] uppercase tracking-wide font-bold rounded-md`}>
                                {tech}
                            </span>
                        ))}
                    </div> */}
                    <h3 className="text-lg font-bold text-slate-800 mb-1 leading-snug">{project.title}</h3>
                    <p className="text-slate-500 text-xs mb-4 leading-relaxed flex-grow line-clamp-3">
                        {project.description}
                    </p>
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm mt-auto text-center block"
                    >
                        View Demo
                    </a>
                </div>
            </div>
        </TiltWrapper>
    );
};

export default function DemoProjectsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 6; // 3 columns * 2 rows = 6 items

    // Calculate pagination data
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll to grid top
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <Navbar />
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-50 to-transparent -z-10"></div>

            <div className="container mx-auto px-6 py-24">
                <FadeUp>
                    <div className="mb-12 mt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
                        >
                            <ArrowLeft size={18} />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Sample <span className="text-blue-600">Static</span> Projects
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                            Explore our collection of projects. These demos showcase the quality, functionality, and documentation standards we deliver.
                        </p>
                    </div>
                </FadeUp>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start min-h-[600px]">
                    {currentProjects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currentPage === 1
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 shadow-sm"
                                }`}
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === number
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currentPage === totalPages
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 shadow-sm"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* View All Demos Button */}
                <div className="flex justify-center mt-16 mb-4">
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                    >
                        <span>For more work samples, reach out to our team</span>
                        <ArrowRight size={20} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Call to Action */}
                <FadeUp>
                    <div className="mt-20 text-center bg-blue-600 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                        <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Want a Static Website ?</h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10">
                            We will create a personalized project based on your specific requirements. Contact us to discuss your project idea.
                        </p>
                        <Link href="/#contact" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 relative z-10">
                            Connect with team
                        </Link>
                    </div>
                </FadeUp>
            </div>

            <Footer className="mt-12" />
        </div>
    );
}
