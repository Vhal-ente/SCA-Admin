export interface Tournament {
  id: number;
  name: string;
  game: string;
  status: "Active" | "Upcoming" | "Completed";
  startDate: string; // ISO date format string (YYYY-MM-DD)
  teams: number;
  prize: string;     // e.g., "$10,000" or "10000"
  season?: string;   // e.g., "Spring 2025", "Summer 2025"
  bannerUrl?: string;
}

export interface TournamentModalProps {
  tournament: Tournament | null;
  onSave: (tournamentData: Omit<Tournament, "id"> & { id?: number }) => void;
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