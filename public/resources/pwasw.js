//this function triggers when the user clicks the Install app button.
self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open('v1').then((cache)=>{
      return cache.addAll([
        "/resources/style.css",
        "/resources/spin.js",
        "/resources/fuckyou.html",
        "/",
      ]);
    })
  );
});

//this function kinda acts like a middlware to all requests
self.addEventListener('fetch', (event)=>{
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request);
    }).catch(()=>{
      return caches.match('/resources/fuckyou.html');
    })
  );
});