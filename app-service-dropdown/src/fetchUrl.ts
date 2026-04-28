export function buildFetchUrl(url: string): string {
  if (import.meta.env.DEV) {
    return `/cors-proxy/${url}`;
  }
  return url;
}
