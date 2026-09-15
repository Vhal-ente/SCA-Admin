import type { ApiTournament, ApiLeague } from "@/lib/api";
import type { Tournament } from "@/components/TournamentModal";
import type { League } from "@/interfaces/league-modal";

type Bucket = "Active" | "Upcoming" | "Completed";
type Registration = "Scheduled" | "Open" | "Closed";

// The console groups competitions into three buckets plus a registration state;
// the API tracks the finer lifecycle the public site needs. "Active" splits in
// two: registration still open, or closed with play under way.
const FROM_API: Record<string, { status: Bucket; registration: Registration }> = {
  draft: { status: "Upcoming", registration: "Scheduled" },
  upcoming: { status: "Upcoming", registration: "Scheduled" },
  registration: { status: "Active", registration: "Open" },
  live: { status: "Active", registration: "Closed" },
  active: { status: "Active", registration: "Closed" },
  ended: { status: "Completed", registration: "Closed" },
  cancelled: { status: "Completed", registration: "Closed" },
};

const fromApiStatus = (status: string) => FROM_API[status] || FROM_API.upcoming;

// `playing` is the status a competition takes once registration closes:
// tournaments go "live", leagues go "active".
const toApiStatus = (status: Bucket | undefined, registration: Registration | undefined, playing: "live" | "active") => {
  if (status === "Completed") return "ended";
  if (status === "Upcoming") return "upcoming";
  return registration === "Closed" ? playing : "registration";
};

// Only send a status the console actually changed, so saving an unrelated
// field never turns a draft into "upcoming" or a cancelled event into "ended".
const changedStatus = (apiStatus: string | undefined, next: string) => {
  if (!apiStatus) return next;
  const current = fromApiStatus(apiStatus);
  const { status, registration } = fromApiStatus(next);
  return current.status === status && current.registration === registration ? undefined : next;
};

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

// An entry fee arrives from the form as free text ("₦10,000", "10000").
const feeToAmount = (value?: string) => (value || "").replace(/[^\d.]/g, "") || "0";

export const toUiTournament = (item: ApiTournament): Tournament => {
  const { status, registration } = fromApiStatus(item.status);
  return {
    id: item.id,
    name: item.name,
    game: item.game,
    status,
    registrationStatus: registration,
    apiStatus: item.status,
    mode: item.mode === "solo" ? "Player" : "Team",
    entryType: item.entryFee > 0 ? "Paid" : "Free",
    entryFee: item.entryFee > 0 ? naira.format(item.entryFee) : "",
    startDate: item.startsAt ? item.startsAt.slice(0, 10) : "",
    teams: item.maxParticipants || item.participantsCount,
    prize: item.prizeText,
    bannerUrl: item.bannerUrl,
    publicationStatus: item.publicationStatus === "published" ? "Published" : "Draft",
    phase: (item.phase as Tournament["phase"]) || "Registration",
  };
};

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
  status: changedStatus(item.apiStatus, toApiStatus(item.status, item.registrationStatus, "live")),
  publicationStatus: item.publicationStatus === "Published" ? "published" : "draft",
});

export const toUiLeague = (item: ApiLeague): League => {
  const { status, registration } = fromApiStatus(item.status);
  const seasonNumber = Number(item.season.match(/\d+/)?.[0]) || 1;
  return {
    id: item.id,
    name: item.name,
    game: item.game,
    status,
    registrationStatus: registration,
    apiStatus: item.status,
    // Leagues have no phase column, so the workspace phase follows the status.
    phase: status === "Completed" ? "Finalized" : registration === "Closed" ? "Drafting" : "Registration",
    season: item.season,
    isSeasonal: Boolean(item.season),
    seasonNumber,
    teams: item.maxTeams || item.teamsCount,
    prize: item.prizeText,
    mode: "Team",
    entryType: item.entryFee > 0 ? "Paid" : "Free",
    entryFee: item.entryFee > 0 ? naira.format(item.entryFee) : "",
    bannerUrl: item.bannerUrl,
    publicationStatus: item.publicationStatus === "published" ? "Published" : "Draft",
  };
};

export const toLeaguePayload = (item: Partial<League>) => ({
  name: item.name,
  game: item.game,
  season: item.isSeasonal ? `Season ${item.seasonNumber || 1}` : "",
  entryFee: item.entryType === "Free" ? "0" : feeToAmount(item.entryFee),
  prizeText: item.prize,
  maxParticipants: item.teams,
  bannerUrl: item.bannerUrl,
  status: changedStatus(item.apiStatus, toApiStatus(item.status, item.registrationStatus, "active")),
  publicationStatus: item.publicationStatus === "Published" ? "published" : "draft",
});
