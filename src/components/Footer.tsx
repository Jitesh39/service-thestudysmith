import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    return (
        <footer className={cn("bg-slate-900 text-slate-400 py-5 border-t border-slate-800", className)}>
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
                <p>&copy; 2023 - {new Date().getFullYear()} All Rights Reserved, TheStudySmith</p>
                <div className="flex items-center gap-2">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <span className="text-slate-300 ml-2">•</span>
                    <Link href="/refund-policy" className="hover:text-white transition-colors">
                        Refund Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
