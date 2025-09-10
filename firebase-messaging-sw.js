// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// ✅ Initialize with full config (safe in SW, warning will not appear now)
firebase.initializeApp({
  apiKey: "AIzaSyBiWsonOZd8AqVMMAtccfn6VHGZffS0qkI",
  authDomain: "to-do-list-3303a.firebaseapp.com",
  projectId: "to-do-list-3303a",
  storageBucket: "to-do-list-3303a.firebasestorage.app",
  messagingSenderId: "141852903889",
  appId: "1:141852903889:web:92250a0dd4a5462e2238f0",
  measurementId: "G-EW81HT12Y4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/todoList/icon.png" // optional
  });
  self.registration.showNotification(notificationTitle, notificationOptions);
});
