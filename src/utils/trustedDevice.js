const TRUSTED_DEVICE_KEYS = {
  user: 'trustedDeviceToken',
  sales_staff: 'staffTrustedDeviceToken',
  admin: 'adminTrustedDeviceToken',
};

export const getTrustedDeviceStorageKey = (scope = 'user') =>
  TRUSTED_DEVICE_KEYS[scope] || TRUSTED_DEVICE_KEYS.user;

export const getTrustedDeviceToken = (scope = 'user') => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(getTrustedDeviceStorageKey(scope)) || '';
};

export const setTrustedDeviceToken = (scope = 'user', token) => {
  if (typeof window === 'undefined') return;
  const key = getTrustedDeviceStorageKey(scope);
  if (token) {
    localStorage.setItem(key, token);
    return;
  }
  localStorage.removeItem(key);
};
