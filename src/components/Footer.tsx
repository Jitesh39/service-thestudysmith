import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    return (
        <footer className={cn("relative overflow-hidden bg-slate-900 text-slate-400 pt-14 pb-28 md:pb-36 border-t border-slate-800", className)}>
            {/* Premium Subtle Ambient Background Glow */}
            <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#B6FF3B] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.02] pointer-events-none z-0"></div>

            {/* Top Footer Content */}
            <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
                <p className="font-medium tracking-wide">&copy; 2023 - {new Date().getFullYear()} All Rights Reserved, TheStudySmith</p>
                <div className="flex items-center gap-6">
                    <Link href="/privacy-policy" className="hover:text-white transition-all hover:translate-y-[-1px] duration-200">
                        Privacy Policy
                    </Link>
                    <span className="text-slate-700 select-none">|</span>
                    <Link href="/refund-policy" className="hover:text-white transition-all hover:translate-y-[-1px] duration-200">
                        Refund Policy
                    </Link>
                </div>
            </div>

            {/* Absolute Centered Watermark Text */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
                <span className="text-[8vw] md:text-[10vw] font-black tracking-[0.22em] leading-none text-[#B6FF3B] opacity-[0.04] filter blur-[0.3px] select-none">
                    THESTUDYSMITH
                </span>
            </div>
        </footer>
    );
}
