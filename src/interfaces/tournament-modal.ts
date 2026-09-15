export interface Tournament {
  id: string;
  name: string;
  game: string;
  status: "Active" | "Upcoming" | "Completed";
  mode: "Player" | "Team";
  entryType: "Free" | "Paid";
  entryFee: string;
  startDate: string; // ISO date format string (YYYY-MM-DD)
  teams: number;
  prize: string;     // e.g., "$10,000" or "10000"
  prizeAllocations?: number[]; // Percentage awarded to each finishing position
  season?: string;   // e.g., "Spring 2025", "Summer 2025"
  isSeasonal?: boolean;
  seasonNumber?: number;
  bannerUrl?: string;
  publicationStatus?: "Draft" | "Published";
  phase?: "Registration" | "Drafting" | "Finalized";
  registrationStatus?: "Scheduled" | "Open" | "Closed";
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  apiStatus?: string;
}

export interface TournamentModalProps {
  tournament: Tournament | null;
  onSave: (tournamentData: Omit<Tournament, "id"> & { id?: string }) => void;
  onBack: () => void;
}

// Optional helper metadata definitions for your sub-tab states if needed later
export interface TournamentTeam {
  id: string;
  name: string;
  logoUrl?: string;
  registeredAt: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface TournamentMatch {
  id: string;
  round: number;
  teamAId: string;
  teamBId: string;
  teamAScore?: number;
  teamBScore?: number;
  status: "Scheduled" | "Live" | "Completed";
  scheduledTime: string;
}
