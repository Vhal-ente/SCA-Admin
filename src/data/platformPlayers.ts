export type PlatformPlayer = {
  id: string;
  name: string;
  email: string;
  ign: string;
  team: string;
  rank: string;
  wins: number;
  losses: number;
  status: "Active" | "Offline";
};

export const PLATFORM_PLAYERS: PlatformPlayer[] = [
  { id: "1", name: "Player1", email: "player1@sca.gg", ign: "Giyu", team: "Team Alpha", rank: "Diamond", wins: 150, losses: 120, status: "Active" },
  { id: "2", name: "ShadowHunter", email: "shadowhunter@sca.gg", ign: "Kage", team: "Viper Esports", rank: "Grandmaster", wins: 210, losses: 45, status: "Active" },
  { id: "3", name: "GlitchOps", email: "glitchops@sca.gg", ign: "Rei", team: "Neon Legion", rank: "Platinum", wins: 98, losses: 82, status: "Offline" },
  { id: "4", name: "Aisha Bello", email: "aisha.bello@sca.gg", ign: "Akuma", team: "Shogun CODM", rank: "Master", wins: 188, losses: 62, status: "Active" },
  { id: "5", name: "Chidi Okoro", email: "chidi.okoro@sca.gg", ign: "Tora", team: "Shogun CODM", rank: "Diamond", wins: 134, losses: 91, status: "Active" },
  { id: "6", name: "Tobi Mensah", email: "tobi.mensah@sca.gg", ign: "Haru", team: "Unassigned", rank: "Platinum", wins: 102, losses: 77, status: "Active" },
];
