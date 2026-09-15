import { useCallback, useEffect, useState } from "react";
import { Ban, CheckCircle2, Clock, Hourglass, Plus, Search, UserPlus, Users, Wallet, X, XCircle } from "lucide-react";
import { api, type AdminUser, type ApiEntry, type ApiTeam, type EntryStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Phase = "Registration" | "Drafting" | "Finalized";

interface TeamsTabProps {
  activeTab: string;
  entityType: "Tournament" | "League";
  // Absent until the competition has been saved once.
  competitionId?: string;
  capacity?: number;
  mode: "Player" | "Team";
  entryType: "Free" | "Paid";
  entryFee: string;
  playerPhase: Phase;
  setPlayerPhase: (phase: Phase) => void;
}

const FILTERS: Array<{ value: EntryStatus | "active"; label: string }> = [
  { value: "active", label: "Active" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "disqualified", label: "Disqualified" },
  { value: "withdrawn", label: "Withdrawn" },
];

const STATUS_STYLE: Record<EntryStatus, { bar: string; badge: string; icon: typeof CheckCircle2 }> = {
  confirmed: { bar: "bg-primary", badge: "border-primary/25 bg-primary/10 text-primary", icon: CheckCircle2 },
  pending: { bar: "bg-amber-500", badge: "border-amber-500/25 bg-amber-500/10 text-amber-500", icon: Clock },
  waitlisted: { bar: "bg-sky-500", badge: "border-sky-500/25 bg-sky-500/10 text-sky-400", icon: Hourglass },
  disqualified: { bar: "bg-destructive", badge: "border-destructive/25 bg-destructive/10 text-destructive", icon: XCircle },
  withdrawn: { bar: "bg-muted-foreground/40", badge: "border-border bg-secondary/60 text-muted-foreground", icon: X },
};

const SEARCH_DELAY_MS = 300;

const initials = (value: string) => value.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";

export const TeamsTab = ({ activeTab, entityType, competitionId, capacity, mode, entryType, entryFee, playerPhase, setPlayerPhase }: TeamsTabProps) => {
  const { toast } = useToast();
  const base = competitionId ? `/admin/${entityType === "League" ? "leagues" : "tournaments"}/${competitionId}/registrations` : "";
  const noun = mode === "Team" ? "team" : "player";

  const [entries, setEntries] = useState<ApiEntry[]>([]);
  const [loading, setLoading] = useState(Boolean(base));
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<EntryStatus | "active">("active");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [toDisqualify, setToDisqualify] = useState<ApiEntry | null>(null);
  const [adding, setAdding] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!base) return;
    try {
      const { registrations } = await api.get<{ registrations: ApiEntry[] }>(base);
      setEntries(registrations);
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  if (activeTab !== "PARTICIPANTS") return null;

  const run = async (entry: ApiEntry, label: string, request: () => Promise<unknown>) => {
    setBusyId(entry.id);
    try {
      await request();
      toast({ title: label });
      await loadEntries();
    } catch (error) {
      toast({ title: "Could not update entry", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusyId("");
    }
  };

  const entryName = (entry: ApiEntry) => entry.team?.name || entry.ign || entry.player?.ign || "Unnamed entrant";
  const setStatus = (entry: ApiEntry, status: EntryStatus, label: string) =>
    run(entry, `${entryName(entry)} ${label}`, () => api.patch(`${base}/${entry.id}`, { status }));
  const recordPayment = (entry: ApiEntry) =>
    run(entry, `Payment recorded for ${entryName(entry)}`, () => api.post(`${base}/${entry.id}/payment`));

  const confirmedCount = entries.filter((entry) => entry.status === "confirmed").length;
  const countFor = (value: EntryStatus | "active") =>
    entries.filter((entry) => (value === "active" ? entry.status !== "withdrawn" : entry.status === value)).length;
  const term = search.trim().toLowerCase();
  const visible = entries
    .filter((entry) => (filter === "active" ? entry.status !== "withdrawn" : entry.status === filter))
    .filter((entry) => !term || [entryName(entry), entry.player?.ign, entry.player?.email, entry.gamePlayerId]
      .some((value) => value?.toLowerCase().includes(term)));

  const paymentChip = (entry: ApiEntry) => {
    if (entry.paymentStatus === "not_required") return { text: "Free entry", style: "border-border bg-secondary/60 text-muted-foreground" };
    if (entry.paymentStatus === "unpaid") return { text: `Unpaid · ${entryFee}`, style: "border-amber-500/25 bg-amber-500/10 text-amber-500" };
    if (entry.paymentStatus === "paid") return { text: `Paid${entry.paymentProvider === "manual" ? " off-site" : ""} · ${entryFee}`, style: "border-primary/20 bg-primary/10 text-primary" };
    return { text: entry.paymentStatus.replace(/_/g, " "), style: "border-border bg-secondary/60 text-muted-foreground" };
  };

  // The main action moves an entry along; drafting swaps confirmed and waitlisted.
  const primaryAction = (entry: ApiEntry) => {
    const drafting = mode === "Player" && playerPhase === "Drafting";
    switch (entry.status) {
      case "pending":
        return { label: entry.paymentStatus === "unpaid" ? "Confirm without fee" : "Confirm", run: () => setStatus(entry, "confirmed", "confirmed") };
      case "confirmed":
        return drafting ? { label: "Remove from draft", run: () => setStatus(entry, "waitlisted", "moved to the waitlist") } : null;
      case "waitlisted":
        return { label: drafting ? "Select for draft" : "Confirm", run: () => setStatus(entry, "confirmed", "confirmed") };
      case "disqualified":
        return { label: "Reinstate as pending", run: () => setStatus(entry, "pending", "reinstated") };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sca-eyebrow mb-2">Registration</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{entityType} {noun}s</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review entries, record fees paid off-site, and manage the confirmed field.</p>
        </div>
        {base && <p className="text-sm font-semibold text-foreground">{confirmedCount}{capacity ? ` of ${capacity}` : ""} <span className="font-normal text-muted-foreground">confirmed</span></p>}
      </div>

      {mode === "Player" && (
        <div className="grid overflow-hidden border border-border bg-card lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary"><UserPlus className="h-5 w-5" /></span>
            <div><h3 className="font-semibold text-foreground">{playerPhase === "Registration" ? "Player registration is open" : playerPhase === "Drafting" ? "Player drafting is in progress" : "Tournament roster finalized"}</h3><p className="mt-1 text-sm text-muted-foreground">{playerPhase === "Registration" ? "Players register from their dashboard. Confirm entries before closing registration." : playerPhase === "Drafting" ? "Select confirmed players for the final field. Removing one moves them to the waitlist." : "The selected player field is locked and ready for match generation."}</p></div>
          </div>
          <div className="flex items-center gap-3 border-t border-border p-5 lg:border-l lg:border-t-0">
            <div className="mr-2 text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workflow</p><p className="text-sm font-semibold text-foreground">{playerPhase} phase</p></div>
            {playerPhase === "Registration" && <button onClick={() => setPlayerPhase("Drafting")} className="h-11 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground">Close registration & start draft</button>}
            {playerPhase === "Drafting" && <button onClick={() => setPlayerPhase("Finalized")} className="h-11 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground">Finalize selected players</button>}
            {playerPhase === "Finalized" && <button onClick={() => setPlayerPhase("Drafting")} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-foreground">Reopen draft</button>}
          </div>
        </div>
      )}

      {!base ? (
        <div className="border border-dashed border-border bg-card px-6 py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-primary" />
          <h3 className="mt-4 font-semibold">Save the {entityType.toLowerCase()} first</h3>
          <p className="mt-1 text-sm text-muted-foreground">Entries can be reviewed and added once it exists.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-sm border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-full gap-1 overflow-x-auto">
              {FILTERS.map((item) => (
                <button key={item.value} onClick={() => setFilter(item.value)} className={`min-w-fit rounded-sm px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === item.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {item.label}<span className="ml-1.5 opacity-70">{countFor(item.value)}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${noun}s...`} className="w-full rounded-sm border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary" />
              </div>
              <button onClick={() => setAdding(true)} className="flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                <Plus className="h-4 w-4 stroke-[3]" /> Add {noun}
              </button>
            </div>
          </div>

          {loadError && <p role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{loadError}</p>}

          {loading ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Loading entries…</p>
          ) : visible.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visible.map((entry) => {
                const style = STATUS_STYLE[entry.status] || STATUS_STYLE.pending;
                const StatusIcon = style.icon;
                const chip = paymentChip(entry);
                const action = primaryAction(entry);
                const busy = busyId === entry.id;
                const active = entry.status !== "withdrawn";
                return (
                  <div key={entry.id} className="relative flex min-h-[18rem] flex-col justify-between overflow-hidden border border-border bg-card p-5 transition-colors hover:border-primary/50">
                    <div className={`absolute inset-x-0 top-0 h-0.5 ${style.bar}`} />
                    <div>
                      <div className="mb-6 flex items-start justify-between">
                        {entry.team?.logoUrl ? (
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden border border-border bg-background"><img src={entry.team.logoUrl} alt="" className="h-full w-full object-cover" /></div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center border border-border bg-background text-sm font-black text-primary">{initials(entryName(entry))}</div>
                        )}
                        <span className={`flex items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${style.badge}`}><StatusIcon className="h-3 w-3" />{entry.status}</span>
                      </div>
                      <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        {entry.team ? `${entry.team.size} on roster` : `@${entry.player?.ign || entry.ign}`}
                      </p>
                      <h4 className="truncate text-lg font-semibold text-foreground">{entryName(entry)}</h4>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {entry.team
                          ? `Entered by ${entry.player?.ign || "unknown"}`
                          : [entry.gamePlayerId && `Game ID ${entry.gamePlayerId}`, entry.platform, entry.contactEmail || entry.player?.email].filter(Boolean).join(" · ")}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5"><span className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${chip.style}`}>{chip.text}</span></div>
                      <div className="mt-5 border-y border-border py-3 text-xs text-muted-foreground"><span className="block text-[9px] font-bold uppercase tracking-wider">Registered</span>{new Date(entry.createdAt).toLocaleDateString()}</div>
                    </div>

                    {active && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {action && <button disabled={busy} onClick={action.run} className="h-11 flex-1 border border-border bg-background px-3 text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40">{action.label}</button>}
                        {entry.paymentStatus === "unpaid" && entry.status !== "disqualified" && (
                          <button disabled={busy} onClick={() => recordPayment(entry)} title="Record a fee paid off-site" className="flex h-11 flex-1 items-center justify-center gap-2 border border-primary/40 bg-primary/10 px-3 text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"><Wallet className="h-4 w-4" />Mark paid</button>
                        )}
                        {entry.status !== "disqualified" && (
                          <button disabled={busy} onClick={() => setToDisqualify(entry)} title="Disqualify" aria-label={`Disqualify ${entryName(entry)}`} className="flex h-11 w-11 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/5 hover:text-destructive disabled:opacity-40"><Ban className="h-4 w-4" /></button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-border bg-card px-6 py-16 text-center">
              <Users className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">{entries.length ? "No entries in this view" : `No ${noun}s entered yet`}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{entries.length ? "Change the filter or search." : `${mode === "Team" ? "Teams" : "Players"} appear here when they register, or when you add them.`}</p>
            </div>
          )}
        </>
      )}

      {adding && base && (
        <AddEntryDialog
          mode={mode}
          entityType={entityType}
          entryType={entryType}
          onClose={() => setAdding(false)}
          onAdd={async (id) => {
            await api.post(base, mode === "Team" ? { teamId: id } : { userId: id });
            toast({ title: `${mode === "Team" ? "Team" : "Player"} entered` });
            setAdding(false);
            await loadEntries();
          }}
        />
      )}

      <AlertDialog open={Boolean(toDisqualify)} onOpenChange={(open) => !open && setToDisqualify(null)}>
        <AlertDialogContent className="rounded-sm border-border bg-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Disqualify {toDisqualify && entryName(toDisqualify)}?</AlertDialogTitle>
            <AlertDialogDescription>They lose their place in the {entityType.toLowerCase()} and their seat opens up. You can reinstate them later if a seat is free.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDisqualify && setStatus(toDisqualify, "disqualified", "disqualified")} className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90">Disqualify</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

type Candidate = { id: string; title: string; detail: string };

function AddEntryDialog({ mode, entityType, entryType, onClose, onAdd }: {
  mode: "Player" | "Team";
  entityType: "Tournament" | "League";
  entryType: "Free" | "Paid";
  onClose: () => void;
  onAdd: (id: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState("");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const q = encodeURIComponent(query.trim());
        const found: Candidate[] = mode === "Team"
          ? (await api.get<{ teams: ApiTeam[] }>(`/admin/teams?limit=20&q=${q}`)).teams.map((team) => ({
              id: team.id,
              title: team.name,
              detail: [`${team.size} on roster`, team.captain && `Captain ${team.captain.ign}`, team.region].filter(Boolean).join(" · "),
            }))
          : (await api.get<{ users: AdminUser[] }>(`/admin/users?limit=20&q=${q}`)).users
              .filter((user) => user.status === "active")
              .map((user) => ({ id: user.id, title: user.ign, detail: [user.fullName || user.name, user.email].filter(Boolean).join(" · ") }));
        if (active) { setCandidates(found); setError(""); }
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setSearching(false);
      }
    }, SEARCH_DELAY_MS);
    return () => { active = false; window.clearTimeout(timer); };
  }, [mode, query]);

  const add = async (candidate: Candidate) => {
    setAddingId(candidate.id);
    try {
      await onAdd(candidate.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAddingId("");
    }
  };

  const noun = mode === "Team" ? "team" : "player";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Add a ${noun}`}>
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-sm border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <p className="sca-eyebrow mb-1">Registration</p>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">Add a {noun}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter an existing {noun} on staff authority. The registration window doesn't apply, but capacity does.
              {entryType === "Paid" && " The entry waits as pending until its fee is recorded."}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={mode === "Team" ? "Search teams by name..." : "Search players by IGN, email, or name..."} className="w-full rounded-sm border border-input bg-background py-3 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary" />
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
        <div className="min-h-40 flex-1 overflow-y-auto p-2">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between gap-4 rounded-sm px-4 py-3 hover:bg-secondary/60">
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{candidate.title}</p>
                <p className="truncate text-xs text-muted-foreground">{candidate.detail}</p>
              </div>
              <button disabled={Boolean(addingId)} onClick={() => add(candidate)} className="shrink-0 rounded-sm border border-border px-4 py-2 text-xs font-bold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary disabled:opacity-40">
                {addingId === candidate.id ? "Adding…" : `Enter ${noun}`}
              </button>
            </div>
          ))}
          {!candidates.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">{searching ? "Searching…" : `No ${noun}s match. ${entityType === "League" || mode === "Team" ? "Only active teams can be entered." : ""}`}</p>
          )}
        </div>
      </div>
    </div>
  );
}
