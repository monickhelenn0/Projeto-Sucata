const CACHE_NAME = "sucatas-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/compras.html",
    "/saidas.html",
    "/exclusoes.html",
    "/notas-caminhoes.html",
    "/css/sb-admin-2.min.css",
    "/js/funcoes-compras.js",
    "/js/funcoes-saidas.js",
    "/js/funcoes-exclusoes.js",
    "/js/funcoes-notas.js",
    "/vendor/jquery/jquery.min.js",
    "/vendor/bootstrap/js/bootstrap.bundle.min.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// Instalar o Service Worker e adicionar ao cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Responder com cache ou buscar na rede
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Atualizar o cache
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
