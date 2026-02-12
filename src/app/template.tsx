"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Template({ children }: { children: React.ReactNode }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Show loader for a short duration on every route change (template mounts on every route change)
        const timeout = setTimeout(() => setShow(false), 900);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {show && (
                    <motion.div
                        key="page-loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-xl"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 animate-pulse">
                                <Image
                                    src="/logo1.png"
                                    alt="TheStudySmith Logo"
                                    fill
                                    className="object-contain drop-shadow-xl"
                                    priority
                                />
                            </div>
                            <div className="w-56 mt-4 relative">
                                {/* Running Person Container */}
                                <motion.div
                                    className="absolute -top-8 left-0 w-8 h-8"
                                    initial={{ left: "0%" }}
                                    animate={{ left: "95%" }}
                                    transition={{ duration: 1.2, ease: "linear" }}
                                >
                                    {/* Using a running emoji or icon for now, replace with actual GIF path if available */}
                                    <div className="w-full h-full text-2xl" role="img" aria-label="running person"></div>
                                </motion.div>

                                {/* Progress Bar Track */}
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.2, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
