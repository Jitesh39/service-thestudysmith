"use client";
import { useEffect } from "react";
import { requestPermission, getFCMToken, onForegroundMessage } from "@/lib/notifications";

const NotificationHandler = () => {
    useEffect(() => {
        const setupNotifications = async () => {
            // Step 1: Handle permission and token generation
            const hasPermission = await requestPermission();
            
            if (hasPermission) {
                // Step 2: Get FCM Token and log it
                const token = await getFCMToken();
                if (token) {
                    console.log("Successfully retrieved FCM Device Token: ", token);
                }
            }
            
            // Step 3: Listen for messages when the app is in foreground
            onForegroundMessage();
        };

        // Run setup once the component mounts
        setupNotifications();
    }, []);

    // This component does not render any visual output
    return null;
};

export default NotificationHandler;
