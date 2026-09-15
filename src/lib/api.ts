const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const BASE = `${API_URL}/api/v1`;

type Options = { method?: string; body?: unknown; retry?: boolean };

async function request<T>(path: string, { method = "GET", body, retry = true }: Options = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && retry && !path.startsWith("/auth/refresh") && !path.startsWith("/auth/login")) {
    const refreshed = await fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "include" });
    if (refreshed.ok) return request<T>(path, { method, body, retry: false });
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || "Something went wrong. Please try again.");
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export type AdminUser = {
  id: string;
  ign: string;
  name: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  country: string;
  multiTeamAllowed: boolean;
  createdAt: string;
  lastLoginAt: string;
};

export type ApiTournament = {
  id: string;
  name: string;
  slug: string;
  game: string;
  organizer: string;
  description: string;
  bannerUrl: string;
  mode: string;
  entryType: string;
  entryFee: number;
  prizeText: string;
  format: string;
  maxParticipants: number;
  participantsCount: number;
  startsAt: string;
  endsAt: string;
  status: string;
  phase: string;
  publicationStatus: string;
};

export type ApiLeague = {
  id: string;
  name: string;
  slug: string;
  game: string;
  description: string;
  bannerUrl: string;
  season: string;
  format: string;
  maxTeams: number;
  teamsCount: number;
  entryFee: number;
  prizeText: string;
  startsAt: string;
  status: string;
  publicationStatus: string;
};
