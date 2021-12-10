//this function triggers when the user clicks the Install app button.
self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.keys().then(function(names) {
      for (let name of names)
          caches.delete(name);
    }),
    caches.open('v12').then((cache)=>{
      return cache.addAll([
        "/resources/offline.html",
        "/resources/loading.ogg",
        "/resources/gallery.ogg",
        "/resources/gallerydone.ogg",
        "/resources/shop.ogg",
        "/resources/admin.ogg",
        "/resources/unbox.wav",
        "/resources/unboxcommon.wav",
        "/resources/unboxgnome.wav",
        "/resources/unboxnudge.mp3",
        "/resources/unboxrare.wav",
        "/resources/unboxspinning.ogg",
        "/resources/unboxsussy.mp3",
        "/resources/unboxunique.wav",
        "/resources/nobalance.wav",
        "/resources/tada.ogg",
        "/resources/menumusic.ogg",
        "/resources/select.flac",
        "/resources/unboxbroken.wav",
        "/resources/purchase.wav",
        "/resources/unboxnancy.mp3",
        "/resources/unboxglitch.mp3",
        "/resources/icons/512.png"
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