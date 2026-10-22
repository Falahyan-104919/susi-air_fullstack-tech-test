export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  statusCode: number;
  rawMessage: string | string[];

  constructor(message: string, statusCode: number, rawMessage: string | string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.rawMessage = rawMessage;
  }
}

export function useApiClient() {
  const config = useRuntimeConfig();
  const tokenCookie = useCookie<string | null>('susi_token');

  async function request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    const { params, headers = {}, requiresAuth = true } = options;

    const requestHeaders: Record<string, string> = { ...headers };

    if (requiresAuth && tokenCookie.value) {
      requestHeaders['Authorization'] = `Bearer ${tokenCookie.value}`;
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${config.public.apiBase}${cleanEndpoint}`;

    try {
      const response = await $fetch<T>(url, {
        method,
        params,
        body,
        headers: requestHeaders,
      });
      return response;
    } catch (err: any) {
      const statusCode = err?.statusCode || err?.response?.status || 500;
      const rawMessage =
        err?.data?.message ||
        err?.response?._data?.message ||
        err?.message ||
        'An unexpected server error occurred';

      const formattedMessage = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : String(rawMessage);

      // Handle 401 Unauthorized centrally
      if (statusCode === 401 && requiresAuth) {
        tokenCookie.value = null;
        if (process.client) {
          navigateTo('/login');
        }
      }

      throw new ApiError(formattedMessage, statusCode, rawMessage);
    }
  }

  return {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, 'GET', undefined, options),
    post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
      request<T>(endpoint, 'POST', body, options),
  };
}
