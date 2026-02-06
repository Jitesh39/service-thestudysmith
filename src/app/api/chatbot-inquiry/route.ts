import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, email, phone, projectTitle, formType } = data;

        // 1. Store data in Firebase
        await addDoc(collection(db, "inquire-bot"), {
            name,
            email: email || "N/A",
            phone,
            projectTitle: projectTitle || "N/A",
            formType,
            timestamp: serverTimestamp(),
            source: "Chatbot"
        });

        // 2. Send Email Notification to Admin
        const adminEmail = process.env.ADMIN_EMAIL || "thestudysmithpu@gmail.com";

        await resend.emails.send({
            from: "TheStudySmith Chatbot <onboarding@resend.dev>",
            to: [adminEmail],
            subject: "📩 Service Inquiry - From Chatbot",
            html: `
                <h3>New Chatbot Inquiry Received</h3>
                <p><b>Type:</b> ${formType === 'inquiry' ? 'Service Inquiry' : 'Callback Request'}</p>
                <hr/>
                <p><b>Name:</b> ${name}</p>
                <p><b>Phone:</b> ${phone}</p>
                ${email ? `<p><b>Email:</b> ${email}</p>` : ''}
                ${projectTitle ? `<p><b>Project/Query:</b> ${projectTitle}</p>` : ''}
                <br/>
                <p><i>Received via TheStudySmith Chatbot</i></p>
            `,
        });

        return NextResponse.json({ message: "Inquiry processed successfully" });
    } catch (error) {
        console.error("Chatbot processing error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
