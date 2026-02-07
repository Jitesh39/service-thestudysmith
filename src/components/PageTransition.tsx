"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import LoaderUI from "@/components/LoaderUI";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Artificial small delay to show the loader on navigation
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="page-loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999]"
                        style={{ pointerEvents: 'none' }} // Allow clicks through if hidden, but it will be unmounted anyway
                    >
                        <LoaderUI />
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
