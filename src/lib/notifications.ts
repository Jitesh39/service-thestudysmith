import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { messaging as firebaseMessaging } from "./firebase";

// VAPID Public Key provided by user
const VAPID_KEY = "BG_iRC6bmYjB13E7CWLpXx3E3tt66a8ZLFh67NbtJjGACjOVEcdffirdAFiJG9oNZL8TYteVQpiUUuiOPu2bnVk";

/**
 * Request notification permission from the user
 */
export const requestPermission = async (): Promise<boolean> => {
  console.log("Requesting permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");
    return true;
  } else {
    console.log("Unable to get permission to notify.");
    return false;
  }
};

/**
 * Get the FCM token for the current device
 */
export const getFCMToken = async (): Promise<string | null> => {
  if (!firebaseMessaging) return null;

  try {
    // Explicitly register the service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker registered successfully:", registration);

    const currentToken = await getToken(firebaseMessaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // You can store this token in Firestore or send to your server
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("FCM Token Error Details:", err);
    return null;
  }
};

/**
 * Handle foreground messages
 */
export const onForegroundMessage = () => {
  if (!firebaseMessaging) return;

  onMessage(firebaseMessaging, (payload) => {
    console.log("Message received in foreground. ", payload);

    // Show a custom UI-based notification since browser push 
    // doesn't usually show when the app is in the foreground
    if (typeof window !== "undefined") {
      // For production, you may want to use a toast/alert or custom UI.
      alert(`Notification: ${payload.notification?.title}\n${payload.notification?.body}`);
    }
  });
};
