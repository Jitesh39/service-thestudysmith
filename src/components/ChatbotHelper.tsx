"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, X } from "lucide-react";

const ChatbotHelper = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show on manual hover event
    const handleManualShow = () => setIsVisible(true);
    window.addEventListener("show-thestudysmith-chatbot-helper", handleManualShow);

    // Proactive show logic (every refresh)
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("show-thestudysmith-chatbot-helper", handleManualShow);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Auto hide after 8 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      return () => clearTimeout(hideTimer);
    }
  }, [isVisible]);

  const handleOpenChat = () => {
    setIsVisible(false);
    // Dispatch custom event to open the main chatbot
    window.dispatchEvent(new CustomEvent("open-thestudysmith-chatbot"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20, x: -20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 20
            }
          }}
          exit={{ opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.2 } }}
          className="fixed bottom-24 right-24 md:bottom-10 md:right-32 z-[40] group cursor-pointer"
          onClick={handleOpenChat}
        >
          {/* Main Bubble */}
          <div className="relative bg-white border border-blue-100 shadow-[0_10px_30px_rgba(0,0,0,0.12)] rounded-3xl p-4 max-w-[260px] md:max-w-[300px]">
            {/* Close Button */}
            <div className="relative flex gap-3">
              {/* Avatar Container */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-inner animate-bounce-slow">
                🤖
              </div>

              {/* Text Content */}
              <div className="flex-1 pr-1">
                <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">
                  <span className="hidden md:inline">Hi! I’m your assistant, how can I help you today?</span>
                  <span className="md:hidden text-xs">Hi! I’m your assistant, how can I help you today?</span>
                </h4>
                {/* <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Check our services/projects.
                </p> */}
              </div>

              {/* Minimal Close Button in-flow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Bubble Tail (Pointing Right now) */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white border-t border-r border-blue-100 rotate-45 transform"></div>
          </div>

          {/* Slight background glow */}
          <div className="absolute inset-0 bg-blue-400/5 blur-2xl -z-10 rounded-full group-hover:bg-blue-400/10 transition-colors" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotHelper;
