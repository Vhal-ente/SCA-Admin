import { useCallback, useEffect, useState } from "react";
import { BarChart2, Brackets, Medal, Trophy } from "lucide-react";
import { api, type ApiStandings } from "@/lib/api";
import type { StructureType } from "./TournamentMatch";

type Props = {
  activeTab: string;
  entityType: "Tournament" | "League";
  // Absent until the competition has been saved once.
  competitionId?: string;
  mode: "Player" | "Team";
  structureType: StructureType | null;
};

const placeLabel = (place: number, round: string) =>
  place === 0 ? "Still in" : place === 1 ? "Champion" : place === 2 ? "Runner-up" : `Out in the ${round.toLowerCase()}`;

export default function TournamentStandings({ activeTab, entityType, competitionId, mode, structureType }: Props) {
  const base = competitionId ? `/admin/${entityType === "League" ? "leagues" : "tournaments"}/${competitionId}/standings` : "";
  const [standings, setStandings] = useState<ApiStandings | null>(null);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    if (!base) return;
    try {
      setStandings(await api.get<ApiStandings>(base));
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    }
  }, [base]);

  useEffect(() => { load(); }, [load]);

  if (activeTab !== "STANDINGS") return null;
  const participantLabel = mode === "Team" ? "Team" : "Player";

  if (!structureType || !base) return <div className="flex min-h-[28rem] flex-col items-center justify-center border border-dashed border-border bg-card px-6 text-center"><BarChart2 className="h-8 w-8 text-primary" /><h2 className="mt-4 text-xl font-semibold">No standings yet</h2><p className="mt-2 text-sm text-muted-foreground">Generate fixtures in Matches. Standings follow from verified results.</p></div>;
  if (loadError) return <div className="border border-destructive/30 bg-destructive/10 px-6 py-10 text-center"><p className="text-sm text-destructive">{loadError}</p><button onClick={load} className="mt-4 h-10 border border-border bg-background px-4 text-xs font-bold uppercase tracking-wide">Try again</button></div>;
  if (!standings) return <div className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">Loading standings…</div>;

  const champion = <section className="border border-border bg-card"><div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div><p className="sca-eyebrow mb-1">Result governance</p><h3 className="text-xl font-semibold">Champion</h3><p className="mt-1 text-sm text-muted-foreground">Set by verified results. To change it, correct or clear a result in Matches.</p></div><div className="flex flex-wrap gap-2"><span className="border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-bold text-primary">Winner · {standings.winner?.name || "Not decided"}</span>{standings.runnerUp && <span className="border border-border bg-secondary/50 px-3 py-2 text-xs font-bold text-muted-foreground">Runner-up · {standings.runnerUp.name}</span>}</div></div></section>;

  if (standings.structure === "single_elimination") return <div className="space-y-6 animate-in fade-in duration-200">{champion}<div><p className="sca-eyebrow mb-2">Bracket progression</p><h2 className="text-2xl font-semibold tracking-tight">Elimination standings</h2><p className="mt-1 text-sm text-muted-foreground">Placement follows progress through the bracket. Everyone knocked out in the same round shares a place.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{standings.placements.map(({ place, round, entrant }) => <div key={entrant.id} className={`border bg-card p-5 ${place === 1 ? "border-primary" : "border-border"}`}><div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center ${place === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{place === 1 || place === 2 ? <Medal className="h-5 w-5" /> : <Brackets className="h-5 w-5" />}</span><span className="text-2xl font-semibold text-foreground">{place ? `#${place}` : "—"}</span></div><p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-primary">{placeLabel(place, round)}</p><h3 className="mt-1 text-lg font-semibold text-foreground">{entrant.name}</h3></div>)}</div></div>;

  return <div className="space-y-6 animate-in fade-in duration-200">{champion}<div className="overflow-hidden border border-border bg-card"><div className="flex items-center gap-3 border-b border-border p-5"><Trophy className="h-5 w-5 text-primary" /><div><p className="sca-eyebrow mb-1">{entityType === "League" ? "League table" : "Round robin table"}</p><h3 className="text-xl font-semibold text-foreground">{structureType} standings</h3><p className="mt-1 text-xs text-muted-foreground">3 points for a win, 1 for a draw. Ties break on goal difference, then goals scored.</p></div></div><div className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr className="border-b border-border bg-secondary text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><th className="w-20 px-5 py-3 text-center">Rank</th><th className="px-4 py-3">{participantLabel}</th><th className="px-4 py-3 text-center">Played</th><th className="px-4 py-3 text-center text-emerald-400">W</th><th className="px-4 py-3 text-center">D</th><th className="px-4 py-3 text-center text-rose-400">L</th><th className="px-4 py-3 text-center">GD</th><th className="px-5 py-3 text-center text-foreground">PTS</th></tr></thead><tbody className="divide-y divide-border text-sm">{standings.table.map(row => <tr key={row.entrant.id} className="transition-colors hover:bg-secondary/50"><td className="px-5 py-4 text-center">{row.rank <= 2 && row.played > 0 ? <Medal className={`mx-auto h-5 w-5 ${row.rank === 1 ? "text-amber-400" : "text-slate-300"}`} /> : <span className="font-mono text-muted-foreground">{row.rank}</span>}</td><td className="px-4 py-4 font-bold text-foreground">{row.entrant.name}</td><td className="px-4 py-4 text-center font-mono text-muted-foreground">{row.played}</td><td className="px-4 py-4 text-center font-mono text-emerald-400">{row.won}</td><td className="px-4 py-4 text-center font-mono text-muted-foreground">{row.drawn}</td><td className="px-4 py-4 text-center font-mono text-rose-400">{row.lost}</td><td className="px-4 py-4 text-center font-mono text-muted-foreground">{row.goalsFor - row.goalsAgainst}</td><td className="px-5 py-4 text-center font-mono text-base font-black text-primary">{row.points}</td></tr>)}</tbody></table></div></div></div>;
}
