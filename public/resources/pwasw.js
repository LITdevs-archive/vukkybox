caches.delete('v1');

//this function triggers when the user clicks the Install app button.
self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open('v2').then((cache)=>{
      return cache.addAll([
        "/resources/fuckyou.html"
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