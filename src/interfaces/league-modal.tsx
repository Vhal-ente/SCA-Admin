export interface League {
  id?: number;
  name: string;
  game: string;
  status: string;
  season: string;
  teams: number;
  prize: string;
}

export interface LeagueModalProps {
  // onOpenChange: (open: boolean) => void;
  league: League | null;
  onSave: (data: League) => void;
  onBack: () => void;
}

