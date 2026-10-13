import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Ban, MoreVertical, RotateCcw, Search, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { api, type ApiTeam } from "@/lib/api";

const SEARCH_DELAY_MS = 300;

const STATUS_STYLE: Record<ApiTeam["status"], string> = {
  active: "bg-emerald-500/10 text-primary", inactive: "bg-secondary text-muted-foreground",
  suspended: "bg-rose-500/10 text-rose-400", disbanded: "bg-secondary text-muted-foreground",
};

const joined = (iso: string) => new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(iso));

export function TeamDirectory() {
  const { toast } = useToast();
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async (term: string) => {
    try {
      const query = term.trim() ? `&q=${encodeURIComponent(term.trim())}` : "";
      const { teams: list } = await api.get<{ teams: ApiTeam[] }>(`/admin/teams?status=all&limit=200${query}`);
      setTeams(list);
    } catch (error) {
      toast({ title: "Could not load teams", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => load(search), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [load, search]);

  const update = async (team: ApiTeam, body: { verified?: boolean; status?: "active" | "suspended" }, done: string) => {
    setBusyId(team.id);
    try {
      await api.patch(`/admin/teams/${team.id}`, body);
      toast({ title: done, description: team.name });
      await load(search);
    } catch (error) {
      toast({ title: "Could not update team", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusyId("");
    }
  };

  const counts = [
    { label: "Active teams", count: teams.filter(team => team.status === "active").length },
    { label: "Verified", count: teams.filter(team => team.verified).length },
    { label: "Suspended", count: teams.filter(team => team.status === "suspended").length },
    { label: "Players on rosters", count: teams.reduce((sum, team) => sum + team.size, 0) },
  ];

  return <>
    <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
      <div>
        <p className="sca-eyebrow mb-2">Organizations</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Team directory</h2>
        <p className="mt-1 text-sm text-muted-foreground">Verify teams, and suspend those barred from entering competitions.</p>
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team names..." className="h-11 w-full rounded-sm border-border bg-card pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary" />
      </div>
    </div>

    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {counts.map(item => <div key={item.label} className="flex h-28 flex-col justify-between rounded-sm border border-border bg-card p-5"><div><p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{item.count}</p></div></div>)}
    </section>

    <div className="flex flex-col space-y-4 overflow-x-auto rounded-sm border border-border bg-card p-5">
      <Table className="w-full min-w-[650px] border-collapse text-left text-xs">
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            {["Team Name", "Captain", "Region", "Roster", "Status", ""].map(head => <TableHead key={head} className={`pb-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground ${head ? "" : "text-right"}`}>{head || "Actions"}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border font-medium">
          {teams.map(team => <TableRow key={team.id} className="group border-b border-border transition-colors hover:bg-secondary/50">
            <td className="py-4"><div className="flex items-center space-x-3">{team.logoUrl ? <img src={team.logoUrl} alt="" className="h-9 w-9 border border-border object-cover" /> : <div className="flex h-9 w-9 items-center justify-center border border-border bg-primary/10 text-xs font-black text-primary">{team.name.slice(0, 2).toUpperCase()}</div>}<div><div className="flex items-center gap-1.5 font-bold text-foreground transition-colors group-hover:text-primary">{team.name}{team.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-label="Verified" />}</div><div className="mt-0.5 text-[9px] text-muted-foreground">Founded {joined(team.createdAt)}</div></div></div></td>
            <td className="py-4 text-muted-foreground">{team.captain?.ign || "—"}</td>
            <td className="py-4 font-semibold text-muted-foreground">{team.region || "—"}</td>
            <td className="py-4 text-muted-foreground">{team.size} {team.size === 1 ? "player" : "players"}</td>
            <td className="py-4"><span className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${STATUS_STYLE[team.status]}`}><span>●</span> <span>{team.status}</span></span></td>
            <td className="py-4 text-right">{team.status !== "disbanded" && <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" disabled={busyId === team.id} className="h-9 w-9 rounded-sm p-0 text-muted-foreground hover:bg-secondary hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-sm border-border bg-popover text-popover-foreground">
                {team.verified
                  ? <DropdownMenuItem onClick={() => update(team, { verified: false }, "Verification removed")} className="cursor-pointer"><ShieldOff className="mr-2 h-4 w-4" />Remove verification</DropdownMenuItem>
                  : <DropdownMenuItem onClick={() => update(team, { verified: true }, "Team verified")} className="cursor-pointer"><BadgeCheck className="mr-2 h-4 w-4" />Verify team</DropdownMenuItem>}
                {team.status === "suspended"
                  ? <DropdownMenuItem onClick={() => update(team, { status: "active" }, "Team reinstated")} className="cursor-pointer"><RotateCcw className="mr-2 h-4 w-4" />Reinstate</DropdownMenuItem>
                  : <DropdownMenuItem onClick={() => window.confirm(`Suspend ${team.name}? They can no longer be entered into competitions.`) && update(team, { status: "suspended" }, "Team suspended")} className="cursor-pointer text-destructive"><Ban className="mr-2 h-4 w-4" />Suspend</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>}</td>
          </TableRow>)}
          {!teams.length && <TableRow><td colSpan={6} className="py-8 text-center text-muted-foreground">{loading ? "Loading teams…" : "No teams match this search."}</td></TableRow>}
        </TableBody>
      </Table>
    </div>
  </>;
}
