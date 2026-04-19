const PORTAL_TIME_ZONE = 'Asia/Baghdad';

const normalizePortalValue = (value) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
    }
  }
  return new Date(value);
};

const buildParts = (value = new Date(), options = {}) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PORTAL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  }).formatToParts(value);

  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
};

export const getPortalDateKey = (value = new Date()) => {
  const parts = buildParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const formatPortalDate = (value = new Date()) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: PORTAL_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(normalizePortalValue(value));

export const formatPortalDateTime = (value) => {
  if (!value) return '-';
  const date = normalizePortalValue(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: PORTAL_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const formatPortalTime = (value) => {
  if (!value) return '-';
  const date = normalizePortalValue(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: PORTAL_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const formatPortalChatDateLabel = (value, reference = new Date()) => {
  const date = normalizePortalValue(value);
  if (Number.isNaN(date.getTime())) return '-';

  const targetKey = getPortalDateKey(date);
  const todayKey = getPortalDateKey(reference);
  if (targetKey === todayKey) return 'Today';

  const yesterday = new Date(normalizePortalValue(reference));
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  if (targetKey === getPortalDateKey(yesterday)) return 'Yesterday';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: PORTAL_TIME_ZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatPortalPrettyDate = (value = new Date()) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: PORTAL_TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(normalizePortalValue(value));
