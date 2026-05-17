const DEBUG_MODE_STORAGE_KEY = 'dockernet-debug';

const truthyDebugValues = new Set(['1', 'true', 'on', 'yes']);

export interface DebugErrorDetails {
  operation: string;
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  serverError?: string;
  responseBody?: string;
  networkError?: string;
  durationMs?: number;
  timestamp: string;
}

export const isDebugModeEnabled = () => {
  if (typeof window === 'undefined') return false;

  const storedValue =
    window.localStorage.getItem(DEBUG_MODE_STORAGE_KEY)?.toLowerCase() || '';

  return truthyDebugValues.has(storedValue);
};

export const debugLog = (message: string, payload?: unknown) => {
  if (!isDebugModeEnabled()) return;

  if (payload === undefined) {
    console.log(`[DockerNet][debug] ${message}`);
    return;
  }

  console.log(`[DockerNet][debug] ${message}`, payload);
};
