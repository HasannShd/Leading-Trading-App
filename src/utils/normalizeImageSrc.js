const UPLOAD_MARKER = '/image/upload/';

/**
 * Normalizes an image src, applying Cloudinary auto-format + auto-quality
 * transforms when the URL is a Cloudinary asset.
 *
 * @param {string} value - Raw image URL or relative path
 * @param {{ width?: number }} options - Optional width cap for Cloudinary (e.g. 480)
 */
export const normalizeImageSrc = (value, { width } = {}) => {
  if (!value) return '';

  const trimmed = String(value).trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const rawPath = url.pathname;
      const pathLower = rawPath.toLowerCase();
      const uploadIdx = rawPath.indexOf(UPLOAD_MARKER);

      const isCloudinary =
        url.hostname.includes('res.cloudinary.com') &&
        pathLower.includes(UPLOAD_MARKER);

      if (isCloudinary && uploadIdx !== -1) {
        const afterUpload = rawPath.substring(uploadIdx + UPLOAD_MARKER.length);

        // Only inject transforms if there are none yet (version segment starts with 'v' + digits)
        const alreadyTransformed =
          /^[a-z_,0-9]+\//.test(afterUpload) && !/^v\d+\//.test(afterUpload);

        if (!alreadyTransformed) {
          const parts = ['f_auto', 'q_auto'];
          if (width) parts.push(`w_${width},c_limit`);
          url.pathname = rawPath.replace(UPLOAD_MARKER, `${UPLOAD_MARKER}${parts.join(',')}/`);
        }
      }

      return url.toString();
    } catch {
      return encodeURI(trimmed);
    }
  }

  return `${import.meta.env.BASE_URL}${trimmed.replace(/^\//, '')}`;
};
