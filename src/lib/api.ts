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
} & ApiWorkspace;

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
} & ApiWorkspace;

export type WatchLinks = {
  youtube: string;
  twitch: string;
  replays: { title: string; url: string }[];
};

// Fields tournaments and leagues share in the console's competition workspace.
export type ApiWorkspace = {
  registrationOpensAt: string;
  registrationClosesAt: string;
  prizeAllocations: number[];
  watchLinks: WatchLinks;
};

export type EntryStatus = "pending" | "confirmed" | "waitlisted" | "disqualified" | "withdrawn";

type EntryPerson = { id: string; ign: string; name: string; email: string };

export type ApiEntry = {
  id: string;
  status: EntryStatus;
  createdAt: string;
  checkedInAt: string;
  // The tournament entrant, or whoever submitted a league entry.
  player: EntryPerson | null;
  team: { id: string; name: string; slug: string; logoUrl: string; size: number } | null;
  ign: string;
  gamePlayerId: string;
  platform: string;
  contactEmail: string;
  // not_required, unpaid, or the payment's own status (paid, refunded, ...).
  paymentStatus: string;
  paymentProvider: string;
};

export type ApiTeam = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  region: string;
  verified: boolean;
  size: number;
  captain: EntryPerson | null;
  createdAt: string;
};
