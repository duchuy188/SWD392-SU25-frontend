// Thêm event listeners để tự động cập nhật service worker
self.addEventListener('install', event => {
  self.skipWaiting(); // Kích hoạt service worker mới ngay lập tức
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Chiếm quyền kiểm soát tất cả clients
});

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAJ20wtlrrkAUizVuEUTsR9apUm7dFfK-M",
  authDomain: "edubot-47b75.firebaseapp.com",
  projectId: "edubot-47b75",
  storageBucket: "edubot-47b75.firebasestorage.app",
  messagingSenderId: "1017917720831",
  appId: "1:1017917720831:web:edbc678e8b43b3d9bfe4ca",
  measurementId: "G-V7XM0YTW8Q"
});

const messaging = firebase.messaging();

// Lưu trữ ID của các thông báo đã xử lý
const processedMessageIds = new Set();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Tạo ID duy nhất cho thông báo này
  const messageId = payload.data?.messageId || `${payload.notification?.title}-${Date.now()}`;
  
  // Kiểm tra xem đã xử lý thông báo này chưa
  if (processedMessageIds.has(messageId)) {
    console.log('Message already processed, ignoring:', messageId);
    return;
  }
  
  // Thêm vào danh sách đã xử lý
  processedMessageIds.add(messageId);
  // Giới hạn kích thước Set để tránh tràn bộ nhớ
  if (processedMessageIds.size > 100) {
    const iterator = processedMessageIds.values();
    processedMessageIds.delete(iterator.next().value);
  }
  
  self.clients.matchAll().then(clients => {
    if (clients.length > 0) {
      // Chỉ gửi đến client đầu tiên để tránh trùng lặp
      const client = clients[0];
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        messageId: messageId, 
        notification: {
          id: messageId,
          title: payload.notification?.title || 'Thông báo mới',
          body: payload.notification?.body || '',
          timestamp: new Date().toISOString(),
          read: false,
          data: payload.data || {}
        }
      });
    } else {
      const notificationTitle = payload.notification?.title || 'Thông báo mới';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/favicon.ico',
        data: {
          messageId: messageId,
          ...payload.data
        }
      };
      
      return self.registration.showNotification(notificationTitle, notificationOptions);
    }
  });
}); 