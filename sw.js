const CACHE = "borne-v1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// Cache d'abord pour les fichiers de l'app, réseau sinon (polices Google, liens Maps).
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
    return res;
  })));
});
