"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, X, ExternalLink, Briefcase } from "lucide-react";
import Link from "next/link";

const TOAST_DURATION = 5000; // 5 seconds

const WelcomeToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const closeToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    // Check if user has visited before to prevent showing on every refresh
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as visited so it doesn't show again
        localStorage.setItem("hasVisited", "true");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible && !isHovered) {
      const autoCloseTimer = setTimeout(() => {
        closeToast();
      }, TOAST_DURATION);
      return () => clearTimeout(autoCloseTimer);
    }
  }, [isVisible, isHovered, closeToast]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed top-4 right-4 left-4 md:left-auto md:top-6 md:right-6 z-[9999] w-auto md:w-full md:max-w-[380px] pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group">
            {/* Premium Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-700/80 to-blue-500/70 opacity-100 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative p-4 flex gap-3">
              {/* Icon Container */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Rocket className="w-5 h-5 text-white animate-pulse" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-6">
                <h3 className="text-[16px] font-bold text-white mb-0.5 leading-tight tracking-tight">
                  Welcome to TheStudySmith! 🎉
                </h3>
                <p className="text-xs text-white/90 leading-relaxed mb-3">
                  We’re thrilled to have you here. Discover high-performance web development projects built for real-world impact.
                </p>

                {/* CTA Buttons */}
                {/* <div className="flex flex-wrap gap-2">
                  <Link
                    href="/demo-projects"
                    onClick={closeToast}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all duration-300 border border-white/10 hover:border-white/20 active:scale-95 group/btn"
                  >
                    <span>Explore Projects</span>
                    <ExternalLink className="w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                  <Link
                    href="#contact"
                    onClick={closeToast}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-semibold transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-95"
                  >
                    <span>Contact Us</span>
                  </Link>
                </div> */}
              </div>

              {/* Close Button */}
              <button
                onClick={closeToast}
                className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar (Visual feedback for auto-close) */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{
                duration: isHovered ? 0 : TOAST_DURATION / 1000,
                ease: "linear"
              }}
              style={{ originX: 0 }}
              className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 absolute bottom-0 left-0 right-0"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeToast;
