self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = {
      title: 'LTE Admin Alert',
      body: event.data ? event.data.text() : '',
      url: '/admin/dashboard',
      tag: 'lte-admin-alert',
    };
  }

  const title = payload.title || 'LTE Admin Alert';
  const options = {
    body: payload.body || '',
    icon: '/company-logo.png',
    badge: '/favicon.png',
    tag: payload.tag || 'lte-admin-alert',
    data: {
      url: payload.url || '/admin/dashboard',
      ...(payload.data || {}),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.includes(targetUrl));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
