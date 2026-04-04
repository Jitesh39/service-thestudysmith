"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
    const pathname = usePathname();

    // Don't show on dashboard pages

    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <div className="fixed bottom-24 left-8 md:bottom-16 md:left-9 z-30 flex items-center justify-center group transition-all duration-500 [.menu-open_&]:opacity-0 [.menu-open_&]:scale-50 [.menu-open_&]:pointer-events-none">
            {/* Pulsing Ring Animation */}
            <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring"></div>

            {/* Main Button */}
            <Link
                href="https://wa.me/919508086078?text=Hi!%20I%20visited%20TheStudySmith%20website%20and%20would%20like%20to%20know%20more%20about%20your%20Web%20Development%20services.%0AMessage%20from%3A%20Services-TheStudySmith%0AWebsite%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:scale-110 transition-all duration-300 animate-wiggle p-0.5"
                aria-label="Chat on WhatsApp"
            >
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                />

                {/* Online Indicator Dot */}
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white z-10"></span>
            </Link>

            {/* Tooltip Label */}
            <div className="absolute left-16 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 border border-green-100 hidden md:block">
                <p className="whitespace-nowrap font-bold text-slate-700 text-sm">Need Help? Chat with us!</p>
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-b border-green-100"></div>
            </div>
        </div>
    );
}
