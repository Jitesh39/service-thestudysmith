import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
    if (admin.apps.length > 0) return;

    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
        
        // Strategy 1: Full JSON string from environment variable
        if (serviceAccountJson) {
            const parsedAccount = typeof serviceAccountJson === 'string' 
                ? JSON.parse(serviceAccountJson.replace(/\\n/g, '\n')) 
                : serviceAccountJson;
                
            admin.initializeApp({
                credential: admin.credential.cert(parsedAccount),
                projectId: parsedAccount.project_id
            });
            console.log("Firebase Admin initialized via JSON Service Account.");
            return;
        }

        // Strategy 2: Individual variables (Easier for local dev)
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
                projectId
            });
            console.log("Firebase Admin initialized via individual credentials.");
            return;
        }

        // Strategy 3: Default application credentials (GCP/Firebase hosting)
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE) {
            admin.initializeApp();
            console.log("Firebase Admin initialized via Default Application Credentials.");
        } else {
            console.warn("⚠️ Firebase Admin credentials NOT detected. Ensure FIREBASE_SERVICE_ACCOUNT or individual ENV variables are set.");
        }
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

// Execute initialization
initializeFirebaseAdmin();

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
