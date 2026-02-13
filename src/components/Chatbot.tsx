"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { MessageSquare, X, Send, Bot, Mail, ChevronRight, User, FileText, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ChatOption = {
    label: string;
    action: string;
    url?: string;
};

type ChatMessage = {
    id: number;
    text?: string | ReactNode;
    isBot: boolean;
    type: "text" | "options" | "form" | "info";
    options?: ChatOption[];
    formType?: "inquiry" | "callback";
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            text: "Hi there! Welcome to TheStudySmith.\nI am StudySmith Assistant 🤖, here to help you with any questions or support you need. How can I assist you today?",
            isBot: true,
            type: "text",
            options: [
                { label: "Explore Our Services", action: "explore_services" },
                { label: "Talk to Expert", action: "talk_expert" },
            ]
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleOptionClick = (option: ChatOption) => {
        // Add user selection as a message
        const userMsg: ChatMessage = { id: Date.now(), text: option.label, isBot: false, type: "text" };
        setMessages((prev) => [...prev, userMsg]);

        // Handle Bot Response based on action
        setTimeout(() => {
            if (option.action === "explore_services") {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        text: "Great! Please fill out the form below to explore our services specifically for your project.",
                        isBot: true,
                        type: "form",
                        formType: "inquiry"
                    },
                ]);
            } else if (option.action === "talk_expert") {
                const infoText = (
                    <div>
                        We would be happy to connect you with our expert team. You can reach us through the following channels:
                        <br /><br />
                        Call: <a href="tel:+919508086078" className="text-blue-600 font-medium hover:underline">+91 9508086078</a>
                        <br />
                        Email: <a href="mailto:thestudysmithpu@gmail.com" className="text-blue-600 font-medium hover:underline">thestudysmithpu@gmail.com</a>
                        <br />
                        WhatsApp: Available 9:00 AM To 5:00 PM
                        <br />
                        Alternatively, share your details with us, and our team will get back to you within 30 minutes.
                    </div>
                );

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        text: infoText,
                        isBot: true,
                        type: "text",
                        options: [
                            { label: "Get a Call Back", action: "get_callback" },
                            { label: "WhatsApp Now", action: "whatsapp_now", url: "https://wa.me/919508086078?text=Hi!%20I%20visited%20TheStudySmith%20website%20and%20would%20like%20to%20know%20more%20about%20your%20Web%20Development%20services.%0AMessage%20from%3A%20Services-TheStudySmith%0AWebsite%20inquiry" },
                        ]
                    },
                ]);
            } else if (option.action === "get_callback") {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        text: "Sure! Please provide your contact details, and we'll call you shortly.",
                        isBot: true,
                        type: "form",
                        formType: "callback"
                    },
                ]);
            } else if (option.action === "whatsapp_now" && option.url) {
                window.open(option.url, "_blank");
            }
        }, 500);
    };

    const handleFormSubmit = async (e: React.FormEvent, formType?: "inquiry" | "callback") => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            projectTitle: formData.get("projectTitle"),
            formType: formType || "inquiry"
        };

        try {
            await fetch('/api/chatbot-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            form.reset(); // Clear the form

            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: "Thank you! your details received, our team will contact you shortly.", isBot: true, type: "text" },
            ]);

        } catch (error) {
            console.error("Error submitting form:", error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: "Sorry, something went wrong. Please try again or contact us on WhatsApp.", isBot: true, type: "text" },
            ]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = { id: Date.now(), text: inputValue, isBot: false, type: "text" };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");

        // Default response for manual typing
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Thanks for your message! Please choose an option below or use WhatsApp for faster response.",
                    isBot: true,
                    type: "text",
                    options: [
                        { label: "Explore Our Services", action: "explore_services" },
                        { label: "Talk to Expert", action: "talk_expert" },
                    ]
                },
            ]);
        }, 1000);
    };

    return (
        <>
            {/* Toggle Button Wrapper */}
            <div className={cn("fixed bottom-24 right-9 md:bottom-12 md:right-9 z-50 flex items-center justify-center group", isOpen && "pointer-events-none")}>
                <button
                    suppressHydrationWarning={true}
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:bg-slate-800 hover:scale-105",
                        isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                    )}
                >
                    <MessageSquare size={24} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                </button>

                {/* Tooltip Label */}
                <div
                    className={cn(
                        "absolute right-16 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl border border-slate-200 hidden md:block transition-all duration-300 transform",
                        isOpen ? "opacity-0 translate-x-4 pointer-events-none" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                >
                    <p className="whitespace-nowrap font-bold text-slate-700 text-sm">Need Help? Ask AI!</p>
                    <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white transform -translate-y-1/2 rotate-45 border-t border-r border-slate-200"></div>
                </div>
            </div>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-32 right-8 z-50 w-[400px] max-w-[calc(100vw-5rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-90 opacity-0 translate-y-10 pointer-events-none"
                )}
                style={{ height: "600px", maxHeight: "80vh" }}
            >
                {/* Header */}
                <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center relative">
                            <Bot size={24} />
                            {/* <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span> */}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">StudySmith Assistant</h3>
                            <p className="pt-2 text-xs text-slate-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                            </p>
                        </div>
                    </div>
                    <button
                        suppressHydrationWarning={true}
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex flex-col gap-2", !msg.isBot && "items-end")}>
                            {/* Text Message */}
                            {msg.type === "text" && (
                                <div
                                    className={cn(
                                        "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line",
                                        msg.isBot
                                            ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                                            : "bg-blue-600 text-white rounded-tr-none"
                                    )}
                                >
                                    {msg.text}

                                    {/* Options INSIDE Text Bubble */}
                                    {msg.options && (
                                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200/50">
                                            {msg.options.map((opt, idx) => (
                                                <button
                                                    suppressHydrationWarning={true}
                                                    key={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-1"
                                                >
                                                    {opt.label}
                                                    <ChevronRight size={12} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Options Message (Standalone fallback) */}
                            {msg.type === "options" && msg.options && (
                                <div className="flex flex-wrap gap-2 max-w-[90%]">
                                    {msg.options.map((opt, idx) => (
                                        <button
                                            suppressHydrationWarning={true}
                                            key={idx}
                                            onClick={() => handleOptionClick(opt)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-100 hover:bg-blue-100 hover:scale-105 transition-all flex items-center gap-1 shadow-sm"
                                        >
                                            {opt.label}
                                            <ChevronRight size={14} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Form Message */}
                            {msg.type === "form" && (
                                <div className="max-w-[95%] w-full bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                    {/* Optional Text Header inside Form Bubble */}
                                    {msg.text && (
                                        <p className="text-sm text-slate-700 mb-3 whitespace-pre-line leading-relaxed">
                                            {msg.text}
                                        </p>
                                    )}
                                    <form onSubmit={(e) => handleFormSubmit(e, msg.formType)} className="space-y-3">
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-3 text-slate-400" />
                                            <input suppressHydrationWarning={true} required name="name" type="text" placeholder="Full Name" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                        {msg.formType === "inquiry" && (
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                                                <input suppressHydrationWarning={true} required name="email" type="email" placeholder="Email Address" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                            </div>
                                        )}
                                        <div className="relative">
                                            <Smartphone size={16} className="absolute left-3 top-3 text-slate-400" />
                                            <input
                                                suppressHydrationWarning={true}
                                                required
                                                name="phone"
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                maxLength={10}
                                                title="Please enter a valid 10-digit phone number"
                                                placeholder="Phone Number (10 digits)"
                                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                onInput={(e) => {
                                                    const target = e.target as HTMLInputElement;
                                                    target.value = target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                                }}
                                            />
                                        </div>
                                        {msg.formType === "inquiry" && (
                                            <div className="relative">
                                                <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                                                <input suppressHydrationWarning={true} name="projectTitle" type="text" placeholder="Project Title / Query" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                            </div>
                                        )}
                                        <button
                                            suppressHydrationWarning={true}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-slate-100 bg-white shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            suppressHydrationWarning={true}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                        />
                        <button
                            suppressHydrationWarning={true}
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="text-center mt-4 mb-2 flex items-center justify-center gap-1 text-xs text-slate-800">
                        Powered by
                        <Link
                            href="https://thestudysmith9.wordpress.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors font-semibold"
                            onClick={(e) => {
                                e.preventDefault();
                                const target = e.currentTarget;
                                target.classList.add("animate-pulse", "text-blue-500");
                                setTimeout(() => {
                                    target.classList.remove("animate-pulse", "text-blue-500");
                                    window.open("https://thestudysmith9.wordpress.com", "_blank");
                                }, 500);
                            }}
                        >
                            TheStudySmith
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
