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

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // IMPORTANT: Chrome flags sites as "Spam" if you show a manual notification 
  // when the payload already contains a "notification" object (which Firebase shows automatically).
  if (payload.notification) {
    console.log('FCM notification detected, letting the SDK handle display to avoid spam filters.');
    return;
  }

  // If there is no notification object (data-only message), show one manually
  const notificationTitle = payload.data?.title || "Update from TheStudySmith";
  const notificationOptions = {
    body: payload.data?.body || "Check your dashboard for new updates.",
    icon: '/logo1.png',
    badge: '/logo1.png',
    tag: 'thestudysmith-update',
    requireInteraction: true,
    data: {
      url: payload.data?.click_action || '/dashboard'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click - Redirect to the specified URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
