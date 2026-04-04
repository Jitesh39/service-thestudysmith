import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// This only initializes it once
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccount) {
        // Parse the JSON string from environment variable
        const parsedServiceAccount = JSON.parse(serviceAccount);
        admin.initializeApp({
            credential: admin.credential.cert(parsedServiceAccount),
        });
    } else {
        // Fallback for local development if running on GCP/Firebase hosting
        // or if credentials are set via GOOGLE_APPLICATION_CREDENTIALS env var
        admin.initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, clickAction } = await req.json();

    if (!token || !title || !body) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      webpush: {
        fcmOptions: {
          link: clickAction || "/dashboard",
        },
      },
      data: {
        click_action: clickAction || "/dashboard",
      }
    };

    const response = await admin.messaging().send(message);
    
    return NextResponse.json({ success: true, messageId: response });
  } catch (error: any) {
    console.error("FCM Send error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
