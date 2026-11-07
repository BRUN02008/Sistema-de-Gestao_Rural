import {
  clearUsuarioLogado,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from "./authStorage";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : "")
).replace(/\/+$/, "");
export const SESSION_EXPIRED_EVENT = "idam:session-expired";

function ensureApiConfigured() {
  if (!API_BASE_URL) {
    throw new ApiError(
      "API nao configurada. Defina VITE_API_URL nas variaveis de ambiente do deploy.",
    );
  }
}

interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
  retryOnUnauthorized?: boolean;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json") ? response.json() : null;
}

function getErrorMessage(data: any) {
  return (
    data?.detail ||
    data?.non_field_errors?.[0] ||
    data?.email?.[0] ||
    data?.password?.[0] ||
    data?.cpf?.[0] ||
    "Erro ao comunicar com a API."
  );
}

async function refreshAccessToken() {
  ensureApiConfigured();
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const data = await parseResponse(response);
  if (!response.ok || !data?.access) {
    clearUsuarioLogado();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    return null;
  }

  saveAccessToken(data.access);
  return data.access as string;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  ensureApiConfigured();
  const {
    authenticated = true,
    retryOnUnauthorized = true,
    headers,
    ...requestOptions
  } = options;
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await parseResponse(response);

  if (response.status === 401 && authenticated && retryOnUnauthorized) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest<T>(path, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status);
  }

  return data as T;
}
