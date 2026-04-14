"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp, ScaleIn } from "@/components/MotionWrappers";
import TiltWrapper from "@/components/TiltWrapper";
import {
  ArrowRight,
  Target,
  Eye,
  Code,
  Layout,
  Smartphone,
  Briefcase,
  CheckCircle,
  Users,
  ExternalLink,
  Github,
  Globe,
  Clock,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  url?: string;
  category?: string;
  createdAt?: any;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation?: string;
  pic?: string;
  joinedDate?: string;
}

export default function AboutPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchTeam = async () => {
      try {
        const snapshot = await getDocs(collection(db, "team"));
        const teamData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));

        // Sort by joinedDate ascending (oldest members first)
        teamData.sort((a, b) => {
          if (!a.joinedDate) return 1;
          if (!b.joinedDate) return -1;
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        });

        setTeam(teamData);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchProjects();
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-30"></div>

        <div className="container relative z-10 text-center">
          <ScaleIn delay={0.2}>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">
              Innovative Web Solutions
            </span>
          </ScaleIn>
          <FadeUp delay={0.4}>
            <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Building Modern Web <br className="hidden md:block" />
              Solutions for <span className="text-blue-600">Your Ideas</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.6}>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              We help individuals and businesses create powerful, scalable, and modern websites that drive results and stand out in the digital landscape.
            </p>
          </FadeUp>
          <FadeUp delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#contact" className="btn btn-primary px-8 py-4 rounded-2xl text-lg shadow-xl shadow-blue-200">
                Connect with Team
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative aspect-square md:aspect-auto md:h-[500px] bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000"
                    alt="Digital Excellence"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="text-4xl font-black mb-2">50+</div>
                    <div className="text-sm font-medium opacity-80 uppercase tracking-widest">Projects Delivered Successfully</div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <div>
              <FadeUp delay={0.2}>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                  About <span className="text-blue-600 tracking-tighter">TheStudySmith</span>
                </h2>
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                  <p>
                    TheStudySmith is a platform focused on delivering high-quality web development projects. We specialize in creating modern, responsive, and user-friendly websites tailored to client needs.
                  </p>
                  <p>
                    Our goal is to provide efficient and scalable web solutions that help individuals, startups, and businesses grow online. We believe in the power of clean code and exceptional design to bridge the gap between ideas and reality.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-blue-600 font-bold text-2xl mb-1">{new Date().getFullYear() - 2023}+</div>
                    <div className="text-slate-500 text-sm font-medium">Years Experience</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-blue-600 font-bold text-2xl mb-1">24/7</div>
                    <div className="text-slate-500 text-sm font-medium">Support Available</div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/4"></div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeUp>
              <div className="h-full p-10 bg-slate-800/50 backdrop-blur-md rounded-[2.5rem] border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Target size={32} className="text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-slate-400 text-xl leading-relaxed italic">
                  "To deliver reliable, modern, and cost-effective web development solutions."
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="h-full p-10 bg-slate-800/50 backdrop-blur-md rounded-[2.5rem] border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Eye size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                <p className="text-slate-400 text-xl leading-relaxed italic">
                  "To become a trusted platform for innovative and scalable web projects."
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <FadeUp>
              <h2 className="section-title">What We Offer</h2>
              <p className="section-subtitle">Comprehensive web solutions built with the latest technologies to help you scale.</p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Custom Website Development",
                desc: "Tailor-made web solutions designed to meet your specific business requirements and goals.",
                icon: Code,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Responsive UI/UX Design",
                desc: "Beautiful, intuitive designs that look and function perfectly across all devices and screen sizes.",
                icon: Layout,
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                title: "Portfolio & Business Websites",
                desc: "Professional online presence to showcase your work or services and attract new opportunities.",
                icon: Globe,
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                title: "Web App Development",
                desc: "Scalable web applications using modern stacks like MERN, Next.js, and Cloud technologies.",
                icon: Smartphone,
                color: "bg-amber-50 text-amber-600"
              }
            ].map((feature, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <TiltWrapper>
                  <div className="h-full p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                    <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                      <feature.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </TiltWrapper>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <FadeUp>
              <h2 className="section-title mb-0">Recent Projects</h2>
              <p className="text-slate-600 mt-4 max-w-xl text-lg">
                Explore our latest work showcasing our commitment to excellence and technical proficiency.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link href="/demo-projects" className="group flex items-center gap-2 text-blue-600 font-bold bg-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all">
                View All Projects <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingProjects ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
              ))
            ) : projects.length > 0 ? (
              projects.map((project, idx) => (
                <FadeUp key={project.id} delay={idx * 0.1}>
                  <div className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-900 p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
                          >
                            <ExternalLink size={24} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400">
                <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                <p>No projects found in the showcase.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <FadeUp>
                <h2 className="section-title">Why Choose Us</h2>
                <p className="section-subtitle">We don't just build websites; we build partnerships for digital growth.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: "Timely Project Delivery", desc: "We value your time and ensure every project reaches its milestone on schedule.", icon: Clock },
                { title: "Cost-Effective Solutions", desc: "Premium quality development that fits your budget without compromising on features.", icon: TrendingUp },
                { title: "Clean & Modern Design", desc: "Aesthetics that WOW your users and keep them engaged with seamless experiences.", icon: Layout },
                { title: "Client-Focused Development", desc: "Your vision is our priority. We work closely with you through every stage.", icon: Users },
                { title: "Reliable & Scalable", desc: "Future-proof solutions that grow as your business or personal needs evolve.", icon: ShieldCheck }
              ].map((reason, idx) => (
                <FadeUp key={idx} delay={idx * 0.1}>
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <reason.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {reason.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {reason.desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Optional) */}
      {team.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container">
            <div className="text-center mb-16">
              <FadeUp>
                <h2 className="section-title">Meet Our Team</h2>
                <p className="section-subtitle">The creative minds behind our innovative web solutions.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 max-w-5xl mx-auto">
              {team.map((member, idx) => (
                <FadeUp key={member.id} delay={idx * 0.1}>
                  <TiltWrapper>
                    <div className="group bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 text-center hover:shadow-2xl transition-all h-full flex flex-col justify-center items-center">
                      <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 sm:mb-6 border-[3px] sm:border-4 border-blue-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <img
                          src={member.pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1 leading-tight">{member.name}</h3>
                      <p className="text-blue-600 font-semibold text-[10px] sm:text-sm uppercase tracking-widest">{member.designation || member.role}</p>
                    </div>
                  </TiltWrapper>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Have a project in mind? <br />
                Let's build it together.
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Ready to take your online presence to the next level? Our team is ready to transform your vision into a reality.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/#contact" className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all transform hover:-translate-y-1 shadow-xl">
                  Start Your Project
                </Link>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-400 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold tracking-wide">Join 50+ satisfied clients</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
