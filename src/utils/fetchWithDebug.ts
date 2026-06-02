import { debugLog, DebugErrorDetails, isDebugModeEnabled } from './debugMode';

const DEBUG_HEADER_NAME = 'x-dockernet-debug';
const RESPONSE_BODY_PREVIEW_LIMIT = 1000;

class DebuggableRequestError extends Error {
  debugDetails: DebugErrorDetails;

  constructor(message: string, debugDetails: DebugErrorDetails) {
    super(message);
    this.name = 'DebuggableRequestError';
    this.debugDetails = debugDetails;
  }
}

const extractServerError = (responseBody: string) => {
  try {
    const parsed = JSON.parse(responseBody);

    if (typeof parsed?.err === 'string') return parsed.err;
    if (typeof parsed?.message === 'string') return parsed.message;
  } catch (error) {
    // Intentionally ignored because some error responses are not JSON.
  }

  return responseBody || undefined;
};

export const fetchJsonWithDebug = <T>(
  url: string,
  init: RequestInit,
  operation: string
): Promise<T> => {
  const debugEnabled = isDebugModeEnabled();
  const startedAt = Date.now();
  const method = (init.method || 'GET').toUpperCase();

  const headers = new Headers(init.headers || {});
  if (debugEnabled) headers.set(DEBUG_HEADER_NAME, '1');

  return fetch(url, {
    ...init,
    headers,
  })
    .then((response) => {
      const durationMs = Date.now() - startedAt;

      if (!response.ok) {
        return response.text().then((responseBody) => {
          const debugDetails: DebugErrorDetails = {
            operation,
            method,
            url,
            status: response.status,
            statusText: response.statusText,
            serverError: extractServerError(responseBody),
            responseBody: responseBody.slice(0, RESPONSE_BODY_PREVIEW_LIMIT),
            durationMs,
            timestamp: new Date().toISOString(),
          };

          debugLog('request failed', debugDetails);

          throw new DebuggableRequestError(
            debugDetails.serverError ||
              `Request failed with status ${response.status}`,
            debugDetails
          );
        });
      }

      return response.json().then((data) => {
        debugLog('request succeeded', {
          operation,
          method,
          url,
          status: response.status,
          durationMs,
          timestamp: new Date().toISOString(),
        });

        return data as T;
      });
    })
    .catch((error: unknown) => {
      if (error instanceof DebuggableRequestError) throw error;

      const debugDetails: DebugErrorDetails = {
        operation,
        method,
        url,
        networkError: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      };

      debugLog('request threw network/runtime error', debugDetails);

      throw new DebuggableRequestError(
        debugDetails.networkError || 'Network request failed',
        debugDetails
      );
    });
};

export const getDebugErrorDetails = (error: unknown) => {
  if (error instanceof DebuggableRequestError) {
    return error.debugDetails;
  }

  return undefined;
};
