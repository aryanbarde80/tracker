const memoryStorage = new Map<string, string>();
const memoryOverrides = new Map<string, string>();

/**
 * Read a value from localStorage, falling back to the in-memory copy when the
 * browser blocks storage access (for example, in restricted webviews).
 */
export function getLocalStorageItem(key: string): string | null {
  const override = memoryOverrides.get(key);
  if (override !== undefined)
    return override;

  try {
    const value = window.localStorage.getItem(key);
    if (value !== null) {
      memoryStorage.set(key, value);
      return value;
    }
  }
  catch {
    // Storage can be unavailable even when the browser exposes the API.
  }

  return memoryStorage.get(key) ?? null;
}

/**
 * Persist a value when possible and keep a page-lifetime copy if storage
 * access fails.
 */
export function setLocalStorageItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
    memoryStorage.set(key, value);
    memoryOverrides.delete(key);
  }
  catch {
    // Keep the in-memory copy; storage is optional for app functionality.
    memoryStorage.set(key, value);
    memoryOverrides.set(key, value);
  }
}
