"use client";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { requestPermission, getFCMToken, onForegroundMessage } from "@/lib/notifications";

const NotificationHandler = () => {
    useEffect(() => {
        const setupNotifications = async (user: any) => {
            // Step 1: Handle permission and token generation
            const hasPermission = await requestPermission();
            
            if (hasPermission) {
                // Step 2: Get FCM Token and log it
                const token = await getFCMToken();
                if (token) {
                    console.log("Successfully retrieved FCM Device Token: ", token);
                    
                    // Store the token in Firestore for this user
                    if (user?.uid) {
                        try {
                            const userRef = doc(db, "users", user.uid);
                            await setDoc(userRef, { 
                                fcmToken: token,
                                lastTokenUpdate: new Date().toISOString()
                            }, { merge: true });
                            console.log("FCM Token stored in database for user:", user.email);
                        } catch (err) {
                            console.error("Error storing FCM token:", err);
                        }
                    }
                }
            }
            
            // Step 3: Listen for messages when the app is in foreground
            onForegroundMessage();
        };

        // Listen for auth state to handle logged-in users
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setupNotifications(user);
            }
        });

        return () => unsubscribe();
    }, []);

    // This component does not render any visual output
    return null;
};

export default NotificationHandler;
