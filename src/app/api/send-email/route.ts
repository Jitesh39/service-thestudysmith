import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, university, projectTitle, deadline, message } = await request.json();

        // 1. Send Notification to Admin
        await resend.emails.send({
            from: "TheStudySmith <onboarding@resend.dev>",

            //  ADMIN EMAIL (Main Receiver)
            to: ["thestudysmithpu@gmail.com"],

            //  Admin directly client ko reply kar sake
            replyTo: email,

            subject: "New Client Enquiry | Service - TheStudySmith",

            html: `
            <h2>New Enquiry Received</h2>
            <hr/>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>University:</b> ${university}</p>
            <p><b>Project Title:</b> ${projectTitle}</p>
            <p><b>Deadline:</b> ${deadline}</p>
            <p><b>Message:</b></p>
            <p>${message}</p>
            <br/>
            `,
        });

        // 2. Send Auto-reply to User
        //     await resend.emails.send({
        //         from: "TheStudySmith <onboarding@resend.dev>",
        //         to: [email], // Works only if sending to delivered@resend.dev in test mode or verified domain
        //         subject: "We received your enquiry",
        //         html: `
        //     <p>Hi ${name},</p>
        //     <p>Thanks for contacting TheStudySmith.</p>
        //     <p>Our team will get back to you shortly.</p>
        //   `,
        //     });

        return NextResponse.json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Email error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
