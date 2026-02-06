import Link from "next/link";
// import Image from "next/image";
import {
  Code2,
  BookOpen,
  MonitorPlay,
  CheckCircle2,
  Clock,
  CreditCard,
  Headphones,
  ArrowRight,
  Database,
  Globe,
  Server,
  FileCode,
  CalendarDays,
  Phone,
  MessageCircle,
  Wrench
} from "lucide-react";
import Accordion from "@/components/Accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import InquiryForm from "@/components/InquiryForm";
import TiltWrapper from "@/components/TiltWrapper";
import { FadeUp, FadeIn, ScaleIn } from "@/components/MotionWrappers";

export default function Home() {
  const faqs = [
    { question: "Do these projects cover web development only?", answer: "Yes, we specialize in Web Development projects using modern stacks like MERN (MongoDB, Express, React, Node.js), Next.js, and PHP/MySQL." },
    { question: "Is the code plagiarism-free?", answer: "Absolutely. Every project is developed from scratch ensuring uniqueness and compliance with university standards." },
    { question: "Do you provide documentation?", answer: "Yes, all major projects come with complete documentation (Synopsis, SRS, System Design, Testing Reports) as per university guidelines." },
    { question: "How long does delivery take?", answer: "Mini projects are delivered within 24-48 hours. Major projects typically take 3-5 days depending on complexity." },
    { question: "Will you explain the project code?", answer: "Yes! We provide a complete code walkthrough and explanation session so you can confidently present your project to the examiner." }
  ];

  return (
    <div className="min-h-screen pt-28">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <ScaleIn delay={0.2}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-medium mb-6 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Static website project services available
            </div>
          </ScaleIn>
          <FadeUp delay={0.4}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-10 max-w-4xl mx-auto">
              Level Up Your Web Projects <br className="hidden md:block" />
              <span className="text-primary">with Expert Developers</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.6}>
            <p className="text-lg md:text-xl text-slate-600 mb-9 max-w-2xl mx-auto leading-relaxed">
              Secure your degree with university-approved projects by TheStudySmith, including full source code, documentation, and explanation support.
              <Link href="https://thestudysmith9.wordpress.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 hover:underline"> TheStudySmith</Link>.
            </p>
          </FadeUp>
          <FadeUp delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#contact" className="btn btn-primary w-full sm:w-auto justify-center">
                Get Your Project <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn btn-outline w-full sm:w-auto justify-center">
                Client Portal
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Description / Trust Badge */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="container text-center">
          <p className="text-slate-500 font-medium mb-8 uppercase tracking-wider text-sm">Trusted by students from</p>
          <div className="relative flex overflow-x-hidden group">
            <div className="flex animate-scroll whitespace-nowrap">
              {[
                "IGNOU", "Sharda University", "LPU", "Chandigarh University", "Delhi University",
                "Amity University", "BITS Pilani", "IIT Delhi", "DTU", "NSUT",
                "IGNOU", "Sharda University", "LPU", "Chandigarh University", "Delhi University",
                "Amity University", "BITS Pilani", "IIT Delhi", "DTU", "NSUT",
              ].map((uni, i) => (
                <span key={i} className="text-xl font-bold font-serif text-slate-400 mx-8">
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Projects Preview */}
      <section className="section-padding bg-slate-50 border-b border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">Sample Projects</h2>
            <p className="section-subtitle">Take a look at some of our recent work.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Demo Card 1 */}
            <TiltWrapper>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group h-full">
                <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <span className="relative text-white font-bold text-xl">E-Commerce Platform</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">ShopMaster Pro</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    A fully functional e-commerce web application with admin dashboard.
                  </p>
                </div>
              </div>
            </TiltWrapper>

            {/* Demo Card 2 */}
            <TiltWrapper>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group h-full">
                <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <span className="relative text-white font-bold text-xl">Hospital Management</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">MediCare System</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    Comprehensive hospital management system handling patient records.
                  </p>
                </div>
              </div>
            </TiltWrapper>

            {/* Demo Card 3 */}
            <TiltWrapper>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group h-full">
                <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <span className="relative text-white font-bold text-xl">AI Content Generator</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">ContentAI</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    SaaS application leveraging AI to generate blog posts automatically.
                  </p>
                </div>
              </div>
            </TiltWrapper>
          </div>

          <div className="text-center">
            <Link href="/demo-projects" className="btn btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
              View All Sample Projects <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="projects" className="section-padding bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">We provide complete web development projects with proper structure and documentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltWrapper>
              <div className="card h-full">
                <div className="feature-icon"><FileCode size={24} /></div>
                <h3 className="text-xl font-bold mb-3">Full Source Code</h3>
                <p>Clean, well-structured, and commented code that is easy to understand and modify.</p>
              </div>
            </TiltWrapper>
            <TiltWrapper>
              <div className="card h-full">
                <div className="feature-icon"><BookOpen size={24} /></div>
                <h3 className="text-xl font-bold mb-3">Complete Documentation</h3>
                <p>Includes Synopsis, SRS, DFDs, ER Diagrams, and Testing Reports required for submission.</p>
              </div>
            </TiltWrapper>
            <TiltWrapper>
              <div className="card h-full">
                <div className="feature-icon"><MonitorPlay size={24} /></div>
                <h3 className="text-xl font-bold mb-3">Setup & Explanation</h3>
                <p>We help you run the project on your laptop and explain the code logic for your viva.</p>
              </div>
            </TiltWrapper>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section id="technologies" className="section-padding bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="section-title">Technologies Covered</h2>
              <p className="text-slate-600 mb-6 text-lg">
                We build projects using the latest industry-standard technologies to ensure your project looks modern and functions perfectly.
              </p>
              <div className="flex flex-wrap gap-3">
                {["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Node.js", "Express", "MongoDB", "MySQL", "Firebase", "Tailwind"].map(tech => (
                  <span key={tech} className="tech-pill">{tech}</span>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <TiltWrapper>
                <div className="p-6 bg-blue-50 rounded-2xl text-center h-full">
                  <Globe className="mx-auto text-blue-500 mb-2" size={32} />
                  <div className="font-bold text-slate-700">Frontend</div>
                </div>
              </TiltWrapper>
              <TiltWrapper>
                <div className="p-6 bg-green-50 rounded-2xl text-center h-full">
                  <Server className="mx-auto text-green-500 mb-2" size={32} />
                  <div className="font-bold text-slate-700">Backend</div>
                </div>
              </TiltWrapper>
              <TiltWrapper>
                <div className="p-6 bg-amber-50 rounded-2xl text-center h-full">
                  <Database className="mx-auto text-amber-500 mb-2" size={32} />
                  <div className="font-bold text-slate-700">Database</div>
                </div>
              </TiltWrapper>
              <TiltWrapper>
                <div className="p-6 bg-purple-50 rounded-2xl text-center h-full">
                  <Code2 className="mx-auto text-purple-500 mb-2" size={32} />
                  <div className="font-bold text-slate-700">Full Stack</div>
                </div>
              </TiltWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="section-padding bg-slate-900 text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title" style={{ color: 'white' }}>Why Choose TheStudySmith?</h2>
            <p className="section-subtitle text-slate-300">We dont just sell code; we provide a complete solution for your academic success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: "Original Projects", desc: "Unique topics and custom-built code to avoid plagiarism issues." },

              { icon: Clock, title: "On-Time Delivery", desc: "Never miss a deadline. We deliver faster than anyone else." },
              { icon: CreditCard, title: "Affordable Pricing", desc: "Student-friendly rates without compromising on quality." },
              { icon: Headphones, title: "Support till Submission", desc: "We are with you until your project is accepted." },
              { icon: Server, title: "Web Project Deployment & Hosting", desc: "Your project will be hosted live for review, submission, and presentation. Hosting charges are to be paid by the customer." },
              {
                icon: Wrench,
                title: "Project Maintenance",
                desc: "Post-delivery maintenance services are available to ensure smooth project performance."
              }
            ].map((item, i) => (
              <TiltWrapper key={i}>
                <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition h-full">
                  <item.icon className="text-blue-400 mb-4" size={32} />
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </TiltWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Timeline */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Delivery Timeline</h2>
            <p className="section-subtitle">Simple and transparent process.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Select Topic", desc: "Choose from our list or bring your own idea." },
              { step: "02", title: "Development", desc: "Our experts build your project (1-5 Days)." },
              { step: "03", title: "Review & Demo", desc: "Check the working demo and request changes." },
              { step: "04", title: "Final Delivery", desc: "Get source code, documents and explanation." }
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.2}>
                <div className="relative p-6 border border-slate-100 rounded-lg bg-slate-50 text-center h-full">
                  <div className="text-4xl font-black text-slate-200 absolute top-2 right-4">{s.step}</div>
                  <h3 className="text-lg font-bold mb-2 relative z-10">{s.title}</h3>
                  <p className="text-sm text-slate-500 relative z-10">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl max-w-3xl mx-auto flex items-start gap-4">
            <CalendarDays className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Standard Timelines</h4>
              <p className="text-sm text-blue-800">
                <strong>Mini Projects:</strong> 1 - 2 Days <span className="mx-2">|</span> <strong>Major Projects:</strong> 3 - 7 Days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding bg-slate-50">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* CTA Footer */}
      <section id="contact" className="py-20 bg-blue-950 backdrop-blur-sm">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left Side: Inquiry Form */}
            <InquiryForm />

            {/* Right Side: Text & Quick Actions */}
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Submit Your Project?</h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Dont let the deadline scare you. Fill out the form or connect with us instantly for a high-quality, university-approved project.
              </p>

              <div className="flex flex-col gap-4 max-w-sm mx-auto md:mx-0">
                <Link href="https://wa.me/919508086078?text=Hi!%20I%20visited%20TheStudySmith%20website%20and%20would%20like%20to%20know%20more%20about%20your%20Web%20Development%20services.%0A%0AMessage%20from%3A%20Services-TheStudySmith%0AWebsite%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" mx-12 bg-green-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-3 transform hover:scale-105 duration-200">
                  <MessageCircle size={18} />
                  <span className="text-sm">Chat on WhatsApp</span>
                </Link>
                <Link href="tel:+919508086078" className=" mx-12 bg-white text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-slate-50 transition flex items-center justify-center gap-3 transform hover:scale-105 duration-200">
                  <Phone size={18} />
                  <span className="text-sm">Call Now: +91 9508086078</span>
                </Link>
              </div>

              <p className="mt-8 text-sm text-blue-200 opacity-80">
                Available 24/7 for urgent project requirements.
              </p>

              {/* Newsletter */}
              <Newsletter />
            </div>

          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <Footer />
    </div>
  );
}
