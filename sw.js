// ==============================================================================
// SERVICE WORKER - 7 DIAS COM JESUS (PWA)
// ==============================================================================

const CACHE_NAME = '7dias-jesus-v1.1.0';

const PRECACHE_ASSETS = [
  '/',
  '/app',
  '/app.html',
  '/index.html',
  '/config.js',
  '/manifest.json',
  '/logo.svg',
  '/logo.jpg',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✝ [Service Worker] Pré-carregando arquivos para uso offline...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('⚠️ Alguns arquivos não puderam ser pré-cacheados:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 [Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Fetch inteligente
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Requisições de API: Network-first (sempre tenta online)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            error: 'Você está sem conexão com a internet no momento.'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // 2. Navegação em páginas HTML: Network-first com fallback para cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const cachedApp = await caches.match('/app.html');
          if (cachedApp) return cachedApp;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 3. Arquivos estáticos (imagens, scripts, estilos, fontes): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
