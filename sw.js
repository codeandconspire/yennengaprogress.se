/* eslint-env serviceworker */

var CACHE_KEY = getCacheKey()
var FILES = ['/'].concat(process.env.ASSET_LIST).filter(Boolean)

self.addEventListener('install', function oninstall (event) {
  event.waitUntil(
    caches
      .open(CACHE_KEY)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', function onactivate (event) {
  event.waitUntil(clear().then(function () {
    if (!self.registration.navigationPreload) return self.clients.claim()
    // enable navigation preloads
    self.registration.navigationPreload.enable().then(function () {
      return self.clients.claim()
    })
  }))
})

self.addEventListener('fetch', function onfetch (event) {
  var req = event.request
  var url = new self.URL(req.url)
  var sameOrigin = self.location.origin === url.origin
  var acceptHTML = req.headers.get('accept').includes('text/html')

  event.respondWith(
    caches.open(CACHE_KEY).then(function (cache) {
      return cache.match(req).then(function (cached) {
        if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') {
          return cached
        }

        if (event.preloadResponse) {
          return event.preloadResponse.then(function (response) {
            return response || self.fetch(req)
          }).then(onresponse).catch(onerror)
        }

        return self.fetch(req).then(onresponse).catch(onerror)

        // handle network response
        // Response -> Response
        function onresponse (response) {
          if (!response.ok) throw response
          if (req.method.toUpperCase() === 'GET') {
            return cache.put(req, response.clone()).then(() => response)
          }
          return response
        }

        // handle fetch error
        // Response -> Response
        function onerror (err) {
          if (cached) return cached
          if (sameOrigin && acceptHTML) return render()
          return err
        }
      })
    })
  )
})

function render () {
  var script = process.env.ASSET_LIST.find(function (url) {
    return /\/(?:\w+\.)?bundle\.js/.test(url)
  })
  var style = process.env.ASSET_LIST.find(function (url) {
    return /\/(?:\w+\.)?bundle\.css/.test(url)
  })
  var doc = `
    <!doctype html>
    <html>
    <head>
      <script>window.initialState = { offline: true }</script>
      <script src="${script}" defer></script>
      <link rel="stylesheet" href="${style}">
    </head>
    <body></body>
    </html>
  `
  return new self.Response(doc, {
    status: 503,
    headers: { 'Content-Type': 'text/html' }
  })
}

// clear application cache
// () -> Promise
function clear () {
  return caches.keys().then(function (keys) {
    return Promise.all(
      keys.filter((key) => key !== CACHE_KEY).map((key) => caches.delete(key))
    )
  })
}

// get application cache key
// () -> str
function getCacheKey () {
  if (process.env.NOW_URL) {
    return process.env.NOW_URL.match(/\w+(?=\.now\.sh)/)[0]
  } else {
    return process.env.npm_package_version
  }
}
