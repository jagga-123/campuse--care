const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

const normalizeBaseUrl = (value) => {
  const withoutSlash = stripTrailingSlash(value);
  return withoutSlash.endsWith('/api')
    ? withoutSlash.slice(0, -4)
    : withoutSlash;
};

export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    return normalizeBaseUrl(envUrl);
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return 'http://localhost:5000';
}

export function getApiPath(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
