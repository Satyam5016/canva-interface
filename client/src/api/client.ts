import type { AppSummary, GraphResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  getApps: () => request<AppSummary[]>("/api/apps"),
  getGraph: (appId: string, forceError = false) =>
    request<GraphResponse>(`/api/apps/${appId}/graph${forceError ? "?error=true" : ""}`)
};
