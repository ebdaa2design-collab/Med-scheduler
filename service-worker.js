/* ==========================================
   Service Worker
   Offline Support + Cache
========================================== */

const CACHE_NAME = "med-app-v1";

const FILES_TO_CACHE = [

  "/",
  "/index.html",
  "/css/style.css",
  "/css/responsive.css",
  "/css/animations.css",
  "/js/app.js",
  "/js/storage.js",
  "/js/scheduler.js",
  "/js/timer.js",
  "/js/notifications.js",
  "/manifest.json"

];



/* تثبيت الـ Service Worker */
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => {

        return cache.addAll(FILES_TO_CACHE);

      })

  );

});



/* تفعيل الـ Service Worker */
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      );

    })

  );

});



/* اعتراض الطلبات وتشغيل أوفلاين */
self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        return response || fetch(event.request);

      })

  );

});