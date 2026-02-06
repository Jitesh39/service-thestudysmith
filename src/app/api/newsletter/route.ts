import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Store email in Firebase "newsletter" collection
        await addDoc(collection(db, "newsletter"), {
            email,
            timestamp: serverTimestamp(),
            source: "Website Footer"
        });

        return NextResponse.json({ message: "Subscribed successfully" });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
