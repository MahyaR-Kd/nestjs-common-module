export function getMainUrlPath(url: string): string {
  const path = url.replace('/api/v1/', '');
  return path.slice(0, path.indexOf('?'));
}
