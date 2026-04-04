// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// These values are required for FCM service worker. 
// They should ideally match your firebaseConfig in src/lib/firebase.ts
// These values are required for FCM service worker. 
// They now match your firebaseConfig from .env.local
const firebaseConfig = {
    apiKey: "AIzaSyDiu47OFOeQTYcQCH6szMumBH4VnKANztQ",
    authDomain: "service-thestudysmith.firebaseapp.com",
    projectId: "service-thestudysmith",
    storageBucket: "service-thestudysmith.firebasestorage.app",
    messagingSenderId: "117806073315",
    appId: "1:117806073315:web:435393f8230a829ddd0cd6",
};

// Initialize the Firebase app in the service worker.
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// If you want to handle background notifications (not just show them)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Ensure you have this or another icon in public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
