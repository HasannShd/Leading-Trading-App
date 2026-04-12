export const parseJwtPayload = (token) => {
  if (!token) return null;
  try {
    const [, payload = ''] = String(token).split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

export const getTokenExpiryMs = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
};

export const isTokenExpired = (token, skewMs = 5000) => {
  const expiry = getTokenExpiryMs(token);
  if (!expiry) return false;
  return Date.now() >= expiry - skewMs;
};
