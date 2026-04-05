export const normalizeImageSrc = (value) => {
  if (!value) return '';

  const trimmed = String(value).trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname.toLowerCase();
      const isCloudinaryAsset =
        url.hostname.includes('res.cloudinary.com') &&
        pathname.includes('/image/upload/');

      if (isCloudinaryAsset && (pathname.endsWith('.heic') || pathname.endsWith('.heif'))) {
        url.pathname = url.pathname.replace('/image/upload/', '/image/upload/f_jpg,q_auto/');
      }

      return url.toString();
    } catch {
      return encodeURI(trimmed);
    }
  }

  return `${import.meta.env.BASE_URL}${trimmed.replace(/^\//, '')}`;
};
