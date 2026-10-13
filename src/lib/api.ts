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
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
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
  // single_elimination, round_robin, or "" before fixtures are generated.
  fixtureStructure: string;
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

export type FixtureStructure = "single_elimination" | "round_robin";

// A team, or a player in a solo tournament.
export type FixtureEntrant = { id: string; name: string; logoUrl: string };

export type ApiFixture = {
  id: string;
  round: string;
  roundNumber: number;
  // Position within the round; a bracket's byes leave gaps.
  matchNumber: number;
  scheduledAt: string;
  venue: string;
  streamUrl: string;
  bestOf: number;
  status: string;
  // Null until a bracket winner fills the place.
  home: FixtureEntrant | null;
  away: FixtureEntrant | null;
  homeScore: number | null;
  awayScore: number | null;
  winnerId: string;
  verified: boolean;
  // The bracket match the winner moves on to, and on which side.
  nextMatchId: string;
  nextMatchSlot: "home" | "away" | "";
};

export type ApiFixtures = {
  structure: FixtureStructure | "";
  bestOf: number;
  fixtures: ApiFixture[];
};

export type ApiStandingRow = {
  rank: number;
  entrant: FixtureEntrant;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type ApiStandings = {
  structure: FixtureStructure | "";
  // Round robin table, ranked by verified results.
  table: ApiStandingRow[];
  // Knockout placings: place 0 means still in the bracket.
  placements: { place: number; round: string; entrant: FixtureEntrant }[];
  winner: FixtureEntrant | null;
  runnerUp: FixtureEntrant | null;
};

export type NewsCategory = "tournament" | "league" | "partnership" | "community" | "announcement" | "esports";

export type ApiArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  // One entry per paragraph.
  content: string[];
  imageUrl: string;
  authorName: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
  publishedAt: string;
  updatedAt: string;
};

export type ApiGame = {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  iconUrl: string;
  active: boolean;
  sortOrder: number;
  // Accounts listing the game; console listings only.
  players?: number;
};

export type ApiGamePlayer = { id: string; ign: string; name: string; status: string; teams: string[] };

type Payer = { id: string; ign: string; email: string };

export type ApiPayment = {
  id: string;
  reference: string;
  payer: Payer | null;
  serviceType: "tournament" | "league" | "other";
  serviceName: string;
  amount: number;
  refundedAmount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "abandoned" | "partially_refunded" | "refunded";
  provider: string;
  method: string;
  paidAt: string;
  createdAt: string;
};

export type ApiRefundStatus = "requested" | "under_review" | "approved" | "rejected" | "processing" | "refunded" | "failed" | "cancelled";

export type ApiRefund = {
  id: string;
  reference: string;
  payer: Payer | null;
  payment: ApiPayment | null;
  reason: string;
  amountRequested: number;
  approvedAmount: number | null;
  status: ApiRefundStatus;
  adminNote: string;
  providerReference: string;
  requestedAt: string;
  completedAt: string;
  events: { status: string; note: string; at: string }[];
};
