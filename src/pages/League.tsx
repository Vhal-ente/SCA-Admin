import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Pencil, Plus, Trash2, Trophy, Users } from "lucide-react";
import { Overview } from "@/components/TournamentOverview";
import type { League } from "@/interfaces/league-modal";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialLeagues: League[] = [
  { id: 1, name: "CODM Pro League", game: "Call of Duty Mobile", status: "Active", season: "Season 2", isSeasonal: true, seasonNumber: 2, teams: 12, prize: "$25,000", mode: "Team", publicationStatus: "Published", phase: "Drafting", entryType: "Paid", entryFee: "10000", prizeAllocations: [50, 30, 20] },
  { id: 2, name: "MLBB Masters League", game: "Mobile Legends", status: "Upcoming", season: "Season 1", isSeasonal: true, seasonNumber: 1, teams: 16, prize: "$30,000", mode: "Team", publicationStatus: "Draft", phase: "Registration", entryType: "Free", prizeAllocations: [60, 25, 15] },
  { id: 3, name: "Valorant Champions League", game: "Valorant", status: "Completed", season: "", isSeasonal: false, teams: 10, prize: "$50,000", mode: "Team", publicationStatus: "Published", phase: "Finalized", entryType: "Free", prizeAllocations: [50, 25, 15, 10] },
];

const filters = ["All", "Active", "Upcoming", "Completed"] as const;
type Filter = typeof filters[number];

export default function LeaguePage() {
  const { toast } = useToast();
  const [leagues, setLeagues] = useState<League[]>(initialLeagues);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [leagueToDelete, setLeagueToDelete] = useState<League | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const filteredLeagues = useMemo(
    () => filter === "All" ? leagues : leagues.filter((league) => league.status === filter),
    [filter, leagues],
  );

  const createLeague = () => setSelectedLeague({
    name: "", game: "", status: "Upcoming", season: "", isSeasonal: false, seasonNumber: 1, teams: 16, prize: "0",
    mode: "Team", entryType: "Free", publicationStatus: "Draft", phase: "Registration",
    prizeAllocations: [60, 25, 15],
  });

  const saveLeague = (data: League) => {
    const teamLeague = { ...data, mode: "Team" as const };
    if (data.id) setLeagues((current) => current.map((league) => league.id === data.id ? { ...league, ...teamLeague } : league));
    else setLeagues((current) => [...current, { ...teamLeague, id: Date.now() }]);
    toast({ title: data.publicationStatus === "Published" ? "League published" : "League draft saved", description: `${data.name || "Untitled league"} was updated successfully.` });
    setSelectedLeague(null);
  };

  const deleteLeague = () => {
    if (!leagueToDelete?.id) return;
    setLeagues((current) => current.filter((league) => league.id !== leagueToDelete.id));
    toast({ title: "League deleted", description: `${leagueToDelete.name} was removed.` });
    setLeagueToDelete(null);
  };

  if (selectedLeague) {
    return <Overview tournament={selectedLeague} onSave={saveLeague} onBack={() => setSelectedLeague(null)} entityType="League" />;
  }

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="sca-eyebrow mb-3">Season operations</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">League management</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">Create seasons, manage participants and fixtures, and publish every league from one workspace.</p>
          </div>
          <button onClick={createLeague} className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="h-5 w-5" /> New league
          </button>
        </header>

        <div className="my-7 flex max-w-full gap-1 overflow-x-auto border-b border-border">
          {filters.map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={`min-w-fit border-b-2 px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${filter === item ? "border-primary bg-primary/5 text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {item}<span className="ml-2 text-[10px] opacity-70">{item === "All" ? leagues.length : leagues.filter((league) => league.status === item).length}</span>
            </button>
          ))}
        </div>

        {filteredLeagues.length ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {filteredLeagues.map((league) => (
              <article key={league.id} className="group flex min-h-[360px] flex-col border border-border bg-card p-6 transition-colors hover:border-primary/45 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{league.status}</span>
                    <span className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${league.publicationStatus === "Published" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-amber-500/30 bg-amber-500/10 text-amber-500"}`}>{league.publicationStatus === "Published" ? "Live" : "Draft"}</span>
                  </div>
                  <div className="flex gap-1">
                    <button aria-label={`Edit ${league.name}`} onClick={() => setSelectedLeague(league)} className="border border-border p-2 text-muted-foreground hover:border-primary/50 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                    <button aria-label={`Delete ${league.name}`} onClick={() => setLeagueToDelete(league)} className="border border-border p-2 text-muted-foreground hover:border-destructive/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{league.game || "Game not selected"}</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">{league.name || "Untitled league"}</h2>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 border-y border-border py-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{league.isSeasonal ? `Season ${league.seasonNumber || 1}` : "One-off event"}</span>
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{league.teams} teams</span>
                  <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />{league.prize || "No prize"}</span>
                  <span className="font-semibold text-foreground">Phase · {league.phase || "Registration"}</span>
                </div>

                <button onClick={() => setSelectedLeague(league)} className="mt-auto flex items-center justify-between pt-6 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Open league workspace <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border bg-card px-6 py-20 text-center"><Trophy className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-5 text-xl font-semibold">No leagues in this view</h2><p className="mt-2 text-sm text-muted-foreground">Change the filter or create a new league.</p></div>
        )}
      </div>

      <AlertDialog open={Boolean(leagueToDelete)} onOpenChange={(open) => !open && setLeagueToDelete(null)}>
        <AlertDialogContent className="rounded-sm border-border bg-card text-foreground">
          <AlertDialogHeader><AlertDialogTitle>Delete league?</AlertDialogTitle><AlertDialogDescription>This permanently removes {leagueToDelete?.name} and its local management data.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteLeague} className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete league</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
