export interface League {
  id?: number;
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
}

export interface LeagueModalProps {
  // onOpenChange: (open: boolean) => void;
  league: League | null;
  onSave: (data: League) => void;
  onBack: () => void;
}

