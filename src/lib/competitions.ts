import type { ApiTournament, ApiLeague } from "@/lib/api";
import type { Tournament } from "@/components/TournamentModal";

// The console groups competitions into three buckets; the API tracks the finer
// lifecycle the public site needs.
const TO_UI_STATUS: Record<string, Tournament["status"]> = {
  registration: "Active",
  live: "Active",
  upcoming: "Upcoming",
  draft: "Upcoming",
  ended: "Completed",
  cancelled: "Completed",
};

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export const toUiTournament = (item: ApiTournament): Tournament => ({
  id: item.id,
  name: item.name,
  game: item.game,
  status: TO_UI_STATUS[item.status] || "Upcoming",
  mode: item.mode === "solo" ? "Player" : "Team",
  entryType: item.entryFee > 0 ? "Paid" : "Free",
  entryFee: item.entryFee > 0 ? naira.format(item.entryFee) : "",
  startDate: item.startsAt ? item.startsAt.slice(0, 10) : "",
  teams: item.maxParticipants || item.participantsCount,
  prize: item.prizeText,
  bannerUrl: item.bannerUrl,
  publicationStatus: item.publicationStatus === "published" ? "Published" : "Draft",
  phase: (item.phase as Tournament["phase"]) || "Registration",
});

// An entry fee arrives from the form as free text ("₦10,000", "10000").
const feeToAmount = (value?: string) => (value || "").replace(/[^\d.]/g, "") || "0";

export const toTournamentPayload = (item: Partial<Tournament>) => ({
  name: item.name,
  game: item.game,
  mode: item.mode === "Player" ? "solo" : "team",
  entryFee: item.entryType === "Free" ? "0" : feeToAmount(item.entryFee),
  prizeText: item.prize,
  maxParticipants: item.teams,
  startsAt: item.startDate || undefined,
  bannerUrl: item.bannerUrl,
  phase: item.phase,
  status: item.status === "Completed" ? "ended" : item.status === "Upcoming" ? "upcoming" : "registration",
  publicationStatus: item.publicationStatus === "Published" ? "published" : "draft",
});

export type UiLeague = {
  id: string;
  name: string;
  game: string;
  description: string;
  season: string;
  format: string;
  teams: number;
  entryFee: string;
  status: string;
  publicationStatus: "Draft" | "Published";
};

export const toUiLeague = (item: ApiLeague): UiLeague => ({
  id: item.id,
  name: item.name,
  game: item.game,
  description: item.description,
  season: item.season,
  format: item.format,
  teams: item.maxTeams || item.teamsCount,
  entryFee: item.entryFee > 0 ? naira.format(item.entryFee) : "",
  status: item.status,
  publicationStatus: item.publicationStatus === "published" ? "Published" : "Draft",
});
