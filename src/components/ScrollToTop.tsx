"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            suppressHydrationWarning={true}
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-32 right-8 md:bottom-24 md:right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 focus:outline-none",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </button>
    );
}
