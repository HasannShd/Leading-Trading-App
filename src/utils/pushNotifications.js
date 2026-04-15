const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.err || data?.message || 'Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const isPushSupported = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

const registerPush = async ({ token, pathPrefix, scope }) => {
  if (!isPushSupported()) {
    throw new Error('This browser does not support web push notifications.');
  }

  const keyData = await fetchJson(`/auth/${pathPrefix}/push/public-key`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Auth-Scope': scope,
    },
  });

  const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription =
    existingSubscription ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
    }));

  await fetchJson(`/auth/${pathPrefix}/push/subscribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Auth-Scope': scope,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  });

  return subscription;
};

const unregisterPush = async ({ token, endpoint, pathPrefix, scope }) => {
  if (!isPushSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration('/');
  const activeSubscription = registration ? await registration.pushManager.getSubscription() : null;
  const targetEndpoint = endpoint || activeSubscription?.endpoint || '';

  if (activeSubscription) {
    await activeSubscription.unsubscribe().catch(() => {});
  }

  if (targetEndpoint) {
    await fetchJson(`/auth/${pathPrefix}/push/unsubscribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Auth-Scope': scope,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint: targetEndpoint }),
    });
  }
};

export const registerAdminPush = async (token) =>
  registerPush({ token, pathPrefix: 'admin', scope: 'admin' });

export const unregisterAdminPush = async (token, endpoint) =>
  unregisterPush({ token, endpoint, pathPrefix: 'admin', scope: 'admin' });

export const registerStaffPush = async (token) =>
  registerPush({ token, pathPrefix: 'staff', scope: 'sales_staff' });

export const unregisterStaffPush = async (token, endpoint) =>
  unregisterPush({ token, endpoint, pathPrefix: 'staff', scope: 'sales_staff' });
