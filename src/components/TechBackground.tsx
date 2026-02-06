import { Code2, Database, Cpu, Globe, Server, Laptop } from "lucide-react";

export default function TechBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: "0s" }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-400/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
            <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-purple-400/20 rounded-full blur-[90px] animate-float" style={{ animationDelay: "4s" }} />

            {/* Floating Icons */}
            <div className="absolute top-[15%] left-[10%] text-blue-200/40 animate-float" style={{ animationDuration: "7s" }}>
                <Code2 size={64} />
            </div>
            <div className="absolute top-[25%] right-[15%] text-indigo-200/30 animate-float" style={{ animationDuration: "8s", animationDelay: "1s" }}>
                <Database size={80} />
            </div>
            <div className="absolute bottom-[20%] left-[15%] text-cyan-200/30 animate-float" style={{ animationDuration: "9s", animationDelay: "2s" }}>
                <Cpu size={72} />
            </div>
            <div className="absolute bottom-[30%] right-[10%] text-slate-300/30 animate-float" style={{ animationDuration: "10s", animationDelay: "1.5s" }}>
                <Globe size={96} />
            </div>
            <div className="absolute top-[10%] right-[30%] text-purple-200/20 animate-float" style={{ animationDuration: "11s", animationDelay: "0.5s" }}>
                <Server size={56} />
            </div>
            <div className="absolute bottom-[10%] left-[40%] text-blue-300/20 animate-float" style={{ animationDuration: "12s", animationDelay: "3s" }}>
                <Laptop size={60} />
            </div>

            {/* 3D-ish Grid Overlay (Optional Subtle Effect) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]"></div>
        </div>
    );
}
