import type { WatchLinks } from "@/lib/api";

export interface League {
  id?: string;
  name: string;
  game: string;
  status: "Active" | "Upcoming" | "Completed";
  season: string;
  isSeasonal?: boolean;
  seasonNumber?: number;
  teams: number;
  prize: string;
  mode?: "Player" | "Team";
  entryType?: "Free" | "Paid";
  entryFee?: string;
  bannerUrl?: string;
  prizeAllocations?: number[];
  publicationStatus?: "Draft" | "Published";
  phase?: "Registration" | "Drafting" | "Finalized";
  registrationStatus?: "Scheduled" | "Open" | "Closed";
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  watchLinks?: WatchLinks;
  // The API's own status, kept so a save only sends a status the console changed.
  apiStatus?: string;
}

