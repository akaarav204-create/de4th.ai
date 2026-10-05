const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://de4th-ai.onrender.com";
export const API_BASE_URL = DEFAULT_API_BASE_URL;
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || API_BASE_URL.replace(/^http/, "ws");

export function api(path) {
  return `${API_BASE_URL}${path}`;
}

export function ws(path) {
  return `${WS_BASE_URL}${path}`;
}
