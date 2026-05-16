self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // POST 등 GET이 아닌 요청은 서비스 워커가 개입하지 않고 그대로 통과시킵니다.
  if (event.request.method !== 'GET') {
    return;
  }

  // 간단한 네트워크 우선(Network First) 전략
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
