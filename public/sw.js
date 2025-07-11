const STATIC_CACHE_NAME = "convertly-static-v2"
const DATA_CACHE_NAME = "convertly-data-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/globals.css",
  // Add other assets as needed
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request.url, response.clone())
            return response
          })
          .catch(() => {
            return caches.match(event.request)
          })
      }),
    )
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      }),
    )
  }
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DATA_CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
