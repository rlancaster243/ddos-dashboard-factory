const CACHE_NAME = '{{CACHE_NAME}}';
const PRECACHE = [
  './index.html',
  './app.js',
  './styles.css',
  './theme.css',
  './manifest.json',
  './config.json',
  './data/country_metrics.json',
  './data/hubs.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  'https://unpkg.com/three@0.158.0/build/three.min.js',
  'https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js',
  'https://unpkg.com/d3-array@3.2.4/dist/d3-array.min.js',
  'https://unpkg.com/d3-color@3.1.0/dist/d3-color.min.js',
  'https://unpkg.com/d3-interpolate@3.0.1/dist/d3-interpolate.min.js',
  'https://unpkg.com/d3-scale@4.0.2/dist/d3-scale.min.js',
  'https://unpkg.com/d3-scale-chromatic@3.0.0/dist/d3-scale-chromatic.min.js',
  'https://unpkg.com/globe.gl@2.32.4/dist/globe.gl.min.js',
  'https://unpkg.com/world-atlas@2.0.2/countries-110m.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE).catch(err => console.warn('Precache partial:', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
