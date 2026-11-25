/* Service worker · Tutorial Desarrollo Móvil
   Guarda TODOS los archivos del sitio en el teléfono la primera vez que se abre con internet.
   Después la app abre y funciona sin conexión. Generado automáticamente (versión 14608319ba). */
const CACHE = 'tutorial-movil-14608319ba';
const FILES = [
  "./",
  "./css/fonts.css",
  "./css/styles.css",
  "./fonts/exo-2-latin-400-normal.woff2",
  "./fonts/exo-2-latin-500-normal.woff2",
  "./fonts/exo-2-latin-600-normal.woff2",
  "./fonts/exo-2-latin-700-normal.woff2",
  "./fonts/jetbrains-mono-latin-400-normal.woff2",
  "./fonts/jetbrains-mono-latin-500-normal.woff2",
  "./fonts/jetbrains-mono-latin-700-normal.woff2",
  "./fonts/orbitron-latin-500-normal.woff2",
  "./fonts/orbitron-latin-700-normal.woff2",
  "./fonts/orbitron-latin-800-normal.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon-maskable.svg",
  "./icons/icon.svg",
  "./images/icon-database.svg",
  "./images/icon-git.svg",
  "./images/icon-media.svg",
  "./images/icon-notification.svg",
  "./images/icon-security.svg",
  "./images/icon-sensor.svg",
  "./images/icon-toolkit.svg",
  "./images/icon-version.svg",
  "./index.html",
  "./js/main.js",
  "./manifest.webmanifest",
  "./pages/01-control-versiones.html",
  "./pages/02-persistencia-datos.html",
  "./pages/03-sensores.html",
  "./pages/04-multimedia.html",
  "./pages/05-servicios-notificaciones.html",
  "./pages/06-librerias-toolkits.html",
  "./pages/07-depuracion-seguridad.html",
  "./pages/08-referencias.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('tutorial-movil-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // enlaces externos (YouTube, documentación): siguen por la red

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => (req.mode === 'navigate'
          ? Response.redirect(new URL('./index.html', self.registration.scope).href, 302)
          : Response.error()));
    })
  );
});
