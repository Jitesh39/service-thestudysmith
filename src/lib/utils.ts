import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: any): string {
    if (!date) return "Recently";

    // Handle Firestore timestamp
    const d = typeof date.toDate === 'function' ? date.toDate() : new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Just Now";
    if (minutes < 60) return `${minutes} Min Ago`;
    if (hours < 24) return `${hours} Hr${hours > 1 ? 's' : ''} Ago`;
    if (days < 30) return `${days} Day${days > 1 ? 's' : ''} Ago`;
    if (months < 12) return `${months} Month${months > 1 ? 's' : ''} Ago`;
    return `${years} Year${years > 1 ? 's' : ''} Ago`;
}
