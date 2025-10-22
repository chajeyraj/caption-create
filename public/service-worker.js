import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// This will be replaced with the actual precache manifest during the build
precacheAndRoute(self.__WB_MANIFEST || []);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle navigation requests for SPA
const navigationRoute = new NavigationRoute(
  createHandlerBoundToURL('/index.html'),
  {
    // Only match these URLs
    allowlist: [
      new RegExp('^/'),
      // Add other routes that should be handled by the SPA
      new RegExp('^/profile'),
      new RegExp('^/auth'),
      new RegExp('^/admin'),
      new RegExp('^/explore'),
      new RegExp('^/categories'),
      new RegExp('^/trending'),
    ],
    // Don't match these URLs
    denylist: [
      // Add any routes that should not be handled by the SPA
      new RegExp('/_'),
      new RegExp('/[^/]+\\.[^/]+$'),
    ],
  }
);

registerRoute(navigationRoute);

// Cache API responses with a stale-while-revalidate strategy
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses
      }),
    ],
  })
);

// Cache Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' ||
               url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Claim control of the page as soon as the service worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(clientsClaim());
});
