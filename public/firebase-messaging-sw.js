// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// These values are required for FCM service worker. 
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

  const notificationTitle = payload.notification?.title || payload.data?.title || "Update from TheStudySmith";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "Check your dashboard for new updates.",
    icon: '/logo1.png',
    badge: '/logo1.png',
    tag: 'thestudysmith-important',
    requireInteraction: true,
    data: {
      url: payload.data?.click_action || payload.notification?.click_action || '/login'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click - Redirect to the specified URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/login';
  const absoluteTargetUrl = targetUrl.startsWith('http') ? targetUrl : new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Try to find an existing window with this EXACT absolute URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === absoluteTargetUrl && 'focus' in client) {
          return client.focus();
        }
      }

      // 2. Fallback: If no exact window is found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(absoluteTargetUrl);
      }
    })
  );
});
