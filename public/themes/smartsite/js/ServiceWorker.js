self.addEventListener('install', function (event) {
});

self.addEventListener('activate', function (event) {
});

self.addEventListener('fetch', function (event) {
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
            caches.open('v1').then(function (cache) {
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
