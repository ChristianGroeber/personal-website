self.addEventListener('install', function (event) {
    console.log(event);
});

self.addEventListener('activate', function (event) {
    console.log(event);
});

self.addEventListener('fetch', function (event) {
    console.log(event);
    event.respondWith(cacheFirst(event));
});

function cacheFirst(event) {
    let promise = cacheOnly(event);
    return promise.then(function (response) {
        if (response !== undefined) {
            return response;
        }

        return networkOnly(event).then(function (networkResponse) {
            if (networkResponse === undefined) {
                throw Error();
            }

            let clone = networkResponse.clone();
            caches.open(cacheName).then(function (cache) {
                cache.put(event.request, clone);
            });

            return networkResponse;
        });
    });
}

function networkFirst(event) {
    let response = networkOnly(event);
    if (response !== undefined) {
        return response;
    }

    return cacheOnly(event);
}

function cacheOnly(event) {
    return caches.match(event).then(function (response) {
        return response;
    });
}

function networkOnly(event) {
    return fetch(event.request);
}
