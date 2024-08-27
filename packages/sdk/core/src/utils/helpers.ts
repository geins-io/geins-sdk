export function isServerContext() {
  return typeof window === 'undefined';
}
