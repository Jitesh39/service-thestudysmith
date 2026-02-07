"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const navLinks = [
    { name: "Services", href: "/#projects" },
    { name: "Demo-Project", href: "/demo-projects" },
    { name: "Technologies", href: "/#technologies" },
    { name: "Why Us", href: "/#why-us" },
    { name: "FAQ", href: "/#faq" },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState("client");
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const docSnap = await getDoc(doc(db, "users", currentUser.uid));
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role || "client");
                    }
                } catch (e) {
                    console.error("Error fetching role", e);
                }
            }
        });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Scroll Spy Logic
            const spySections = [...navLinks.map(link => link.href.substring(1)), "contact"];
            let current = "";

            for (const section of spySections) {
                // Remove the / prefix for id lookup if present
                const cleanId = section.startsWith("/") ? section.substring(2) : section;
                if (!cleanId) continue;

                const element = document.getElementById(cleanId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 100) {
                        current = cleanId;
                    }
                }
            }
            if (current !== activeSection) {
                // only set active section for styling, don't mess with hash while scrolling
                setActiveSection(current);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            unsubscribe();
        };
    }, []);

    const scrollToTop = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
        setIsMobileMenuOpen(false);
    };

    // Determine Navbar Styles based on Active Section or Route
    const getNavbarStyles = () => {
        // If in dashboard or other pages, force solid background
        if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/demo-projects")) {
            return "bg-white/90 backdrop-blur-md border-slate-200 text-slate-600 shadow-lg";
        }

        if (!isScrolled) return "bg-transparent border-transparent text-slate-600";

        switch (activeSection) {
            case "why-us":
                return "bg-slate-900/90 backdrop-blur-md border-slate-700 text-slate-200 shadow-lg";
            case "contact":
                return "bg-blue-950/90 backdrop-blur-md border-blue-900 text-white shadow-lg";
            default:
                return "bg-white/90 backdrop-blur-md border-slate-200 text-slate-600 shadow-lg";
        }
    };

    const getLogoColor = () => {
        if (pathname?.startsWith("/dashboard")) return "text-primary";
        if (["why-us", "contact"].includes(activeSection) && isScrolled) {
            return "text-white";
        }
        return "text-primary";
    };

    const styles = getNavbarStyles();
    const isDarkSection = ["why-us", "contact"].includes(activeSection) && isScrolled && !pathname?.startsWith("/dashboard");

    return (
        <nav
            className={cn(
                "fixed top-4 left-6 right-6 md:left-20 md:right-20 z-50 transition-all duration-300 rounded-[2rem] border py-2",
                styles
            )}
        >
            <div className="container flex items-center justify-between h-14 md:h-16">
                <a href="/" className="flex items-center gap-2 pl-2 md:pl-4">
                    <Image
                        src="/logo1.png"
                        alt="TheStudySmith Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                    <span className={cn("font-bold text-xl md:text-2xl tracking-tight transition-colors duration-300", getLogoColor())}>
                        TheStudySmith
                    </span>
                </a>

                <div className={cn("hidden md:flex gap-8 text-base font-medium transition-colors duration-300", isDarkSection ? "text-slate-200" : "text-slate-600")}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "group relative py-1 transition-colors",
                                isDarkSection ? "hover:text-white" : "hover:text-primary",
                                activeSection === link.href.substring(2) ? (isDarkSection ? "text-white" : "text-primary") : ""
                            )}
                        >
                            {link.name}
                            <span
                                className={cn(
                                    "absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-in-out",
                                    isDarkSection ? "bg-white" : "bg-primary",
                                    activeSection === link.href.substring(2) ? "w-full" : "w-0 group-hover:w-full"
                                )}
                            />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden md:flex items-center gap-3">
                            {/* Show "Go to Dashboard" if not already on dashboard */}
                            {!pathname?.startsWith("/dashboard") && (
                                <Link
                                    href={`/dashboard/${userRole}`}
                                    className={cn(
                                        "inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105",
                                        isDarkSection ? "bg-white text-blue-900 hover:bg-slate-100" : "bg-blue-600 text-white hover:bg-blue-700"
                                    )}
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleSignOut}
                                className={cn(
                                    "inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-105",
                                    isDarkSection ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={cn(
                                    "hidden md:inline-flex btn text-sm px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all",
                                    isDarkSection
                                        ? "bg-white text-blue-600 hover:bg-slate-100"
                                        : "btn-primary"
                                )}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className={cn(
                                    "hidden md:inline-flex btn text-sm px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all",
                                    isDarkSection
                                        ? "bg-white text-blue-600 hover:bg-slate-100"
                                        : "btn-primary"
                                )}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        suppressHydrationWarning={true}
                        className={cn("md:hidden p-2 transition-colors", isDarkSection ? "text-white hover:text-slate-200" : "text-slate-600 hover:text-primary")}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mx-2 mt-2 p-4 bg-white/100 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl flex flex-col gap-1 animate-in slide-in-from-top-2 fade-in duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "text-lg font-medium p-1 rounded-lg hover:bg-slate-50 transition-colors",
                                activeSection === link.href.substring(2) ? "text-primary bg-blue-50" : "text-slate-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-slate-100 my-1" />
                    <div className="flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link
                                    href={`/dashboard/${userRole}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn btn-primary text-center justify-center w-full py-2 rounded-xl flex items-center gap-2"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="btn bg-slate-100 text-slate-700 text-center justify-center w-full py-2 rounded-xl flex items-center gap-2 hover:bg-slate-200"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn btn-primary text-center justify-center w-full py-2 rounded-xl"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn btn-primary text-center justify-center w-full py-2 rounded-xl"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}


            {/* Mobile Menu Styling Injection for Hover Effects */}
            <style jsx>{`
        .nav-item {
          position: relative;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: #2563EB;
          transition: width 0.3s;
        }
        .nav-item:hover::after {
          width: 100%;
        }
        .nav-item.active::after {
          width: 100%;
        }
      `}</style>
        </nav>
    );
}
