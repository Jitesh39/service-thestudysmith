import Image from "next/image";

export default function LoaderUI() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-xl transition-all">
            <div className="relative flex flex-col items-center">
                <div className="relative w-30 h-30  md:w-32 md:h-32 animate-pulse">
                    <Image
                        src="/logo1.png"
                        alt="TheStudySmith Logo"
                        fill
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </div>
                <div className="w-56 mt-4 relative">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-progress origin-left w-full"></div>
                    </div>
                    {/* Person for initial load */}
                    <div className="absolute -top-8 left-0 animate-run-person text-2xl"></div>
                </div>
            </div>
        </div>
    );
}
