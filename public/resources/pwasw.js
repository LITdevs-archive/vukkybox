caches.delete('v1');
caches.delete('v2');
caches.delete('v3');

//this function triggers when the user clicks the Install app button.
self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open('v3').then((cache)=>{
      return cache.addAll([
        "/resources/offline.html",
        "/resources/loading.ogg"
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
      return caches.match('/resources/offline.html');
    })
  );
});