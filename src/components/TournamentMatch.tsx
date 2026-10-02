import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Brackets, CalendarDays, Check, ChevronRight, Clock, Layers3, Lock, MapPin, Pencil, Plus, RefreshCw, Swords, Trophy, X } from "lucide-react";
import { api, type ApiEntry, type ApiFixture, type ApiFixtures, type FixtureEntrant, type FixtureStructure } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { structureLabel } from "@/lib/competitions";

export type StructureType = "Single elimination" | "Double elimination" | "Round robin" | "Swiss" | "Single lobby" | "Multiple lobbies";
type Phase = "Registration" | "Drafting" | "Finalized";

// Structures the server generates; the rest are shown as coming later.
const API_STRUCTURE: Partial<Record<StructureType, FixtureStructure>> = {
  "Single elimination": "single_elimination",
  "Round robin": "round_robin",
};

const structureOptions: Array<{ name: StructureType; description: string; lobby?: boolean }> = [
  { name: "Single elimination", description: "One loss eliminates a participant." },
  { name: "Round robin", description: "Every participant plays every other participant." },
  { name: "Double elimination", description: "Winners and lower brackets with two-loss elimination." },
  { name: "Swiss", description: "Participants face opponents with similar records." },
  { name: "Single lobby", description: "All participants compete together in one scored lobby.", lobby: true },
  { name: "Multiple lobbies", description: "Split participants into groups, then advance qualifiers.", lobby: true },
];

const SERIES = [1, 3, 5, 7];

// <input type="date"> and <input type="time"> hold local values; the API stores UTC.
const pad = (value: number) => String(value).padStart(2, "0");
const localDate = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const localTime = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const toIso = (date: string, time: string) => (date ? new Date(`${date}T${time || "00:00"}`).toISOString() : "");

const isPlayed = (fixture: ApiFixture) =>
  !["scheduled", "cancelled"].includes(fixture.status) || fixture.homeScore !== null || fixture.awayScore !== null || fixture.verified;

type Draft = { date: string; time: string; venue: string; streamUrl: string; bestOf: number; home: string; away: string };

function StructureView({ structure, fixtures, mode }: { structure: StructureType; fixtures: ApiFixture[]; mode: "Player" | "Team" }) {
  const rounds = Array.from(new Set(fixtures.map(fixture => fixture.roundNumber))).sort((a, b) => a - b);
  const noun = mode === "Team" ? "teams" : "players";
  // An empty bracket place is filled by the winner of the match that feeds it.
  const placeholder = (fixture: ApiFixture, slot: "home" | "away") => {
    const feeder = fixtures.find(item => item.nextMatchId === fixture.id && item.nextMatchSlot === slot);
    return feeder ? `Winner of ${feeder.round} #${feeder.matchNumber}` : "TBD";
  };
  const side = (fixture: ApiFixture, slot: "home" | "away") => {
    const entrant = fixture[slot];
    const won = entrant && fixture.winnerId === entrant.id;
    return <div className={`flex items-center justify-between px-3 py-2 text-xs ${slot === "home" ? "border-b border-border" : ""} ${entrant ? "text-foreground" : "text-muted-foreground"}`}><span className={won ? "font-bold text-primary" : ""}>{entrant?.name || placeholder(fixture, slot)}</span>{fixture[`${slot}Score`] !== null && <span className="font-mono">{fixture[`${slot}Score`]}</span>}</div>;
  };
  const entrantCount = new Set(fixtures.flatMap(fixture => [fixture.home?.id, fixture.away?.id]).filter(Boolean)).size;

  if (structure === "Round robin") {
    return <div className="space-y-5"><div><p className="sca-eyebrow mb-1">Round robin stage</p><h3 className="text-xl font-semibold">Full round plan</h3><p className="mt-1 text-sm text-muted-foreground">{entrantCount} {noun} · {rounds.length} rounds · {fixtures.length} matches</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rounds.map(round => { const inRound = fixtures.filter(fixture => fixture.roundNumber === round); return <div key={round} className="border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3"><span className="text-xs font-bold uppercase tracking-widest text-primary">Round {round}</span><span className="text-xs text-muted-foreground">{inRound.length} fixtures</span></div><div className="divide-y divide-border">{inRound.map(fixture => <div key={fixture.id} className="flex items-center gap-3 px-4 py-3 text-xs"><span className="flex h-6 w-6 items-center justify-center bg-secondary font-bold text-primary">{fixture.matchNumber}</span><span className="text-muted-foreground">{fixture.home?.name || "TBD"} vs {fixture.away?.name || "TBD"}</span></div>)}</div></div>; })}</div></div>;
  }

  return <div className="space-y-7 overflow-x-auto"><div><p className="sca-eyebrow mb-1">Bracket structure</p><h3 className="text-xl font-semibold">{structure}</h3><p className="mt-1 text-sm text-muted-foreground">{entrantCount} {noun} · {fixtures.length} matches · byes go straight to round 2</p></div><div className="flex min-w-max gap-4">{rounds.map(round => { const inRound = fixtures.filter(fixture => fixture.roundNumber === round); return <div key={round} className="w-60 border border-border bg-card"><div className="border-b border-border bg-secondary/50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary">{inRound[0]?.round || `Round ${round}`}</div><div className="space-y-3 p-3">{inRound.map(fixture => <div key={fixture.id} className="border border-border bg-background"><div className="border-b border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">#{fixture.matchNumber} · BO{fixture.bestOf}</div>{side(fixture, "home")}{side(fixture, "away")}</div>)}</div></div>; })}<div className="flex w-56 items-center gap-3 self-center border border-primary/30 bg-primary/5 p-4"><Trophy className="h-5 w-5 text-primary" /><div><p className="font-semibold">Champion</p><p className="text-xs text-muted-foreground">Winner of the final</p></div></div></div></div>;
}

function FixtureSchedule({ fixtures, onEdit }: { fixtures: ApiFixture[]; onEdit: (fixture: ApiFixture) => void }) {
  const rounds = Array.from(new Set(fixtures.map(fixture => fixture.roundNumber))).sort((a, b) => a - b);
  return <div className="space-y-5"><div className="flex items-end justify-between"><div><p className="sca-eyebrow mb-1">Full competition schedule</p><h3 className="text-xl font-semibold text-foreground">Fixtures from start to finish</h3><p className="mt-1 text-sm text-muted-foreground">Set dates, venues, and streams, or swap entrants before a match is played.</p></div><span className="border border-border bg-card px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{fixtures.length} fixtures</span></div><div className="space-y-4">{rounds.map(round => { const inRound = fixtures.filter(fixture => fixture.roundNumber === round); return <div key={round} className="overflow-hidden border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3"><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{inRound[0]?.round}</span><span className="text-xs text-muted-foreground">{inRound.length} slots</span></div><div className="divide-y divide-border">{inRound.map(fixture => <div key={fixture.id} className="grid gap-4 px-5 py-4 md:grid-cols-[3rem_1.4fr_1fr_1fr_auto] md:items-center"><span className="text-xs font-bold text-muted-foreground">#{pad(fixture.matchNumber)}</span><div className="flex items-center gap-3 text-sm"><span className={`font-semibold ${fixture.home ? "text-foreground" : "text-muted-foreground"}`}>{fixture.home?.name || "TBD"}</span><span className="text-primary">vs</span><span className={`font-semibold ${fixture.away ? "text-foreground" : "text-muted-foreground"}`}>{fixture.away?.name || "TBD"}</span><span className="text-[10px] font-bold uppercase text-muted-foreground">BO{fixture.bestOf}</span></div><p className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" />{fixture.scheduledAt ? localDate(fixture.scheduledAt) : "Not scheduled"}{fixture.scheduledAt && <><Clock className="ml-1 h-4 w-4 text-primary" />{localTime(fixture.scheduledAt)}</>}</p><p className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{fixture.venue || "Venue not set"}</p><button onClick={() => onEdit(fixture)} className="flex h-9 items-center justify-center gap-2 border border-border bg-background px-3 text-[10px] font-bold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary"><Pencil className="h-3.5 w-3.5" />Edit</button></div>)}</div></div>; })}</div></div>;
}

interface MatchTabProps {
  activeTab: string;
  entityType: "Tournament" | "League";
  // Absent until the competition has been saved once.
  competitionId?: string;
  mode: "Player" | "Team";
  tournamentPhase: Phase;
  onPhaseChange: (phase: Phase) => void;
  onStructureGenerated: (structure: StructureType | null) => void;
}

export default function MatchTab({ activeTab, entityType, competitionId, mode, tournamentPhase, onPhaseChange, onStructureGenerated }: MatchTabProps) {
  const { toast } = useToast();
  const collection = entityType === "League" ? "leagues" : "tournaments";
  const base = competitionId ? `/admin/${collection}/${competitionId}` : "";
  const noun = mode === "Team" ? "teams" : "players";

  const [data, setData] = useState<ApiFixtures | null>(null);
  const [entrants, setEntrants] = useState<FixtureEntrant[]>([]);
  const [loading, setLoading] = useState(Boolean(base));
  const [loadError, setLoadError] = useState("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [structureType, setStructureType] = useState<StructureType>("Single elimination");
  const [bestOf, setBestOf] = useState(3);
  const [seeding, setSeeding] = useState<"registration" | "random">("registration");
  const [firstRoundDate, setFirstRoundDate] = useState("");
  const [firstRoundTime, setFirstRoundTime] = useState("18:00");
  const [daysBetweenRounds, setDaysBetweenRounds] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState<ApiFixture | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const applyFixtures = useCallback((next: ApiFixtures) => {
    setData(next);
    onStructureGenerated(structureLabel(next.structure));
  }, [onStructureGenerated]);

  const load = useCallback(async () => {
    if (!base) return;
    try {
      const [fixtures, { registrations }] = await Promise.all([
        api.get<ApiFixtures>(`${base}/fixtures`),
        api.get<{ registrations: ApiEntry[] }>(`${base}/registrations`),
      ]);
      applyFixtures(fixtures);
      // Fixtures name teams, or players in a solo tournament.
      setEntrants(registrations.filter(entry => entry.status === "confirmed").flatMap(entry => {
        if (mode === "Team") return entry.team ? [{ id: entry.team.id, name: entry.team.name, logoUrl: entry.team.logoUrl }] : [];
        return entry.player ? [{ id: entry.player.id, name: entry.ign || entry.player.ign, logoUrl: "" }] : [];
      }));
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [applyFixtures, base, mode]);

  useEffect(() => { load(); }, [load]);

  const fixtures = useMemo(() => data?.fixtures || [], [data]);
  const generated = structureLabel(data?.structure);
  const resultsIn = fixtures.some(isPlayed);
  const supported = Boolean(API_STRUCTURE[structureType]);
  const preview = useMemo(() => {
    const count = entrants.length;
    if (structureType === "Round robin") return { rounds: count % 2 ? count : Math.max(0, count - 1), matches: (count * (count - 1)) / 2 };
    return { rounds: count > 1 ? Math.ceil(Math.log2(count)) : 0, matches: Math.max(0, count - 1) };
  }, [entrants.length, structureType]);

  if (activeTab !== "MATCHES") return null;

  if (!base) return <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-border bg-card px-6 text-center"><Brackets className="h-7 w-7 text-primary" /><h3 className="mt-5 text-xl font-semibold text-foreground">Save this {entityType.toLowerCase()} first</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">Fixtures are drawn from confirmed entrants once the {entityType.toLowerCase()} exists.</p></div>;
  if (loading) return <div className="border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">Loading fixtures…</div>;
  if (loadError) return <div className="border border-destructive/30 bg-destructive/10 px-6 py-10 text-center"><p className="text-sm text-destructive">{loadError}</p><button onClick={() => { setLoading(true); load(); }} className="mt-4 h-10 border border-border bg-background px-4 text-xs font-bold uppercase tracking-wide">Try again</button></div>;

  const openBuilder = () => {
    if (generated) setStructureType(generated);
    if (data?.bestOf) setBestOf(data.bestOf);
    setBuilderOpen(true);
  };

  const generateStructure = async () => {
    const structure = API_STRUCTURE[structureType];
    if (!structure) return;
    setGenerating(true);
    try {
      const next = await api.post<ApiFixtures>(`${base}/fixtures`, {
        structure, bestOf, seeding, daysBetweenRounds,
        firstRoundAt: toIso(firstRoundDate, firstRoundTime),
      });
      applyFixtures(next);
      if (tournamentPhase === "Registration") onPhaseChange("Drafting");
      setBuilderOpen(false);
      toast({ title: `${next.fixtures.length} fixtures generated` });
    } catch (error) {
      toast({ title: "Could not generate fixtures", description: (error as Error).message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const fedSlot = (fixture: ApiFixture, slot: "home" | "away") =>
    fixtures.some(item => item.nextMatchId === fixture.id && item.nextMatchSlot === slot);

  const openEditor = (fixture: ApiFixture) => {
    setEditing(fixture);
    setDraft({
      date: localDate(fixture.scheduledAt), time: localTime(fixture.scheduledAt), venue: fixture.venue,
      streamUrl: fixture.streamUrl, bestOf: fixture.bestOf, home: fixture.home?.id || "", away: fixture.away?.id || "",
    });
  };

  const saveFixture = async () => {
    if (!editing || !draft) return;
    // Send only what changed, so an untouched line-up is never re-placed.
    const scheduledAt = toIso(draft.date, draft.time);
    const body: Record<string, unknown> = {};
    if (scheduledAt !== (editing.scheduledAt ? new Date(editing.scheduledAt).toISOString() : "")) body.scheduledAt = scheduledAt;
    if (draft.venue !== editing.venue) body.venue = draft.venue;
    if (draft.streamUrl !== editing.streamUrl) body.streamUrl = draft.streamUrl;
    if (draft.bestOf !== editing.bestOf) body.bestOf = draft.bestOf;
    if (draft.home && draft.home !== (editing.home?.id || "")) body.home = draft.home;
    if (draft.away && draft.away !== (editing.away?.id || "")) body.away = draft.away;
    if (!Object.keys(body).length) {
      setEditing(null);
      return;
    }
    setSaving(true);
    try {
      applyFixtures(await api.patch<ApiFixtures>(`${base}/fixtures/${editing.id}`, body));
      setEditing(null);
      toast({ title: "Fixture saved" });
    } catch (error) {
      toast({ title: "Could not save fixture", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const played = editing ? isPlayed(editing) : false;
  const entrantSelect = (slot: "home" | "away") => {
    if (!editing || !draft) return null;
    const locked = played || fedSlot(editing, slot);
    const current = editing[slot];
    const options = current && !entrants.some(entrant => entrant.id === current.id) ? [current, ...entrants] : entrants;
    return <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{slot === "home" ? "Participant A" : "Participant B"}</span><select disabled={locked} value={draft[slot]} onChange={event => setDraft({ ...draft, [slot]: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary disabled:opacity-60">{!draft[slot] && <option value="">{fedSlot(editing, slot) ? "Winner of an earlier match" : "TBD"}</option>}{options.map(entrant => <option key={entrant.id} value={entrant.id}>{entrant.name}</option>)}</select>{locked && <span className="mt-1.5 block text-[11px] text-muted-foreground">{played ? "This match has a result." : "Filled by the winner of an earlier match."}</span>}</label>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="sca-eyebrow mb-2">Match operations</p><h2 className="text-2xl font-semibold tracking-tight">Matches</h2><p className="mt-1 text-sm text-muted-foreground">Generate fixtures from confirmed {noun} and manage each match.</p></div>
        <button onClick={openBuilder} disabled={resultsIn} title={resultsIn ? "Results are in, so the draw is fixed." : undefined} className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">{generated ? <RefreshCw className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{generated ? "Regenerate structure" : "Generate structure"}</button>
      </div>

      {generated && (
        <><div className="grid border border-primary/30 bg-primary/5 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="border-b border-primary/20 p-4 sm:border-b-0 sm:border-r"><p className="text-[10px] font-bold uppercase tracking-widest text-primary">Active structure</p><p className="mt-1 font-semibold text-foreground">{generated}</p><p className="text-xs text-muted-foreground">Best of {data?.bestOf}</p></div>
          {[{ label: "Rounds", value: new Set(fixtures.map(fixture => fixture.roundNumber)).size }, { label: "Matches", value: fixtures.length }, { label: "Confirmed " + noun, value: entrants.length }].map(item => <div key={item.label} className="border-r border-primary/20 p-4 last:border-r-0"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p><p className="mt-1 text-xl font-semibold text-foreground">{item.value}</p></div>)}
        </div>{tournamentPhase === "Drafting" && <div className="flex flex-col gap-4 border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-amber-500">Drafting phase active</p><p className="mt-1 text-sm text-muted-foreground">Finalize the selected {noun} when the field is ready. This will unlock Standings.</p></div><button onClick={() => onPhaseChange("Finalized")} className="h-10 shrink-0 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground">Finalize draft & unlock standings</button></div>}</>
      )}

      {generated ? (
        <div className="space-y-10"><StructureView structure={generated} fixtures={fixtures} mode={mode} /><FixtureSchedule fixtures={fixtures} onEdit={openEditor} /></div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-border bg-card px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center bg-primary/10 text-primary"><Brackets className="h-7 w-7" /></span>
          <h3 className="mt-5 text-xl font-semibold text-foreground">No {entityType.toLowerCase()} structure</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Fixtures are drawn from the {entrants.length} confirmed {noun}. Nothing appears until a structure is generated.</p>
          <button onClick={openBuilder} className="mt-6 inline-flex h-11 items-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground"><Plus className="h-4 w-4" />Generate structure</button>
        </div>
      )}

      {builderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border bg-secondary/35 px-7 py-6"><div className="flex items-start gap-4"><span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary"><Brackets className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Structure generator</p><h3 className="mt-1 text-2xl font-semibold">Build {entityType.toLowerCase()} format</h3><p className="mt-1 text-sm text-muted-foreground">Configured for <strong className="text-foreground">{mode} mode</strong> — fixtures use the {entrants.length} confirmed {noun}.</p></div></div><button onClick={() => setBuilderOpen(false)} className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="h-5 w-5" /></button></div>

            <div className="space-y-7 p-7">
              <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">1. Select competition structure</p><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{structureOptions.map(option => { const available = Boolean(API_STRUCTURE[option.name]); return <button key={option.name} type="button" disabled={!available} onClick={() => setStructureType(option.name)} className={`min-h-28 border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${structureType === option.name ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50"}`}><div className="flex items-start justify-between"><span className={structureType === option.name ? "text-primary" : "text-muted-foreground"}>{option.lobby ? <Layers3 className="h-5 w-5" /> : <Swords className="h-5 w-5" />}</span>{structureType === option.name ? <Check className="h-4 w-4 text-primary" /> : !available && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><Lock className="h-3 w-3" />Coming later</span>}</div><p className="mt-3 text-sm font-bold text-foreground">{option.name}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{option.description}</p></button>; })}</div></div>

              <div className="grid gap-5 border-t border-border pt-6 md:grid-cols-2 lg:grid-cols-3">
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Match series</span><select value={bestOf} onChange={event => setBestOf(Number(event.target.value))} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary">{SERIES.map(item => <option key={item} value={item}>Best of {item}</option>)}</select></label>
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Seeding</span><select value={seeding} onChange={event => setSeeding(event.target.value as "registration" | "random")} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary"><option value="registration">Registration order</option><option value="random">Random draw</option></select></label>
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Days between rounds</span><input type="number" min="0" max="30" value={daysBetweenRounds} onChange={event => setDaysBetweenRounds(Math.min(30, Math.max(0, Number(event.target.value))))} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">First round date (optional)</span><input type="date" value={firstRoundDate} onChange={event => setFirstRoundDate(event.target.value)} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">First round time</span><input type="time" value={firstRoundTime} onChange={event => setFirstRoundTime(event.target.value)} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              </div>

              <div className="border border-border bg-secondary/35 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Generated preview</p><div className="mt-4 grid gap-4 sm:grid-cols-4">{[{ label: "Format", value: structureType }, { label: `Confirmed ${noun}`, value: entrants.length }, { label: "Rounds", value: preview.rounds }, { label: "Matches", value: preview.matches }].map(item => <div key={item.label}><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p><p className="mt-1 font-semibold text-foreground">{item.value}</p></div>)}</div></div>
              {entrants.length < 2 && <p className="border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Confirm at least two {noun} in Participants before generating fixtures.</p>}
              <div className="flex items-start gap-4 border border-amber-500/35 bg-amber-500/10 p-5"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /><div><p className="text-sm font-bold text-foreground">{generated ? "Regenerating replaces every current fixture" : "Generating this structure will start the Drafting phase"}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{generated ? "Dates, venues, and swaps made to the current fixtures are discarded. This is only possible until the first result is recorded." : <>The {entityType.toLowerCase()} moves from <strong>{tournamentPhase}</strong> to <strong>Drafting</strong>. {noun[0].toUpperCase() + noun.slice(1)} confirmed later are not added until you regenerate.</>}</p></div></div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-7 py-5"><button onClick={() => setBuilderOpen(false)} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground">Cancel</button><button onClick={generateStructure} disabled={!supported || generating || entrants.length < 2} className="flex h-11 items-center gap-2 bg-primary px-6 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">{generating ? "Generating…" : generated ? "Regenerate fixtures" : "Generate & start drafting"} <ChevronRight className="h-4 w-4" /></button></div>
          </div>
        </div>
      )}

      {editing && draft && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border bg-secondary/35 px-7 py-6"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Fixture editor</p><h3 className="mt-1 text-2xl font-semibold text-foreground">{editing.round} · #{editing.matchNumber}</h3><p className="mt-1 text-sm text-muted-foreground">Choosing an entrant swaps them with whoever is there now.</p></div><button onClick={() => setEditing(null)} className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-5 p-7 sm:grid-cols-2">
              {entrantSelect("home")}
              {entrantSelect("away")}
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</span><input type="date" value={draft.date} onChange={event => setDraft({ ...draft, date: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</span><input type="time" value={draft.time} onChange={event => setDraft({ ...draft, time: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Venue or channel</span><input value={draft.venue} onChange={event => setDraft({ ...draft, venue: event.target.value })} placeholder="Online, Discord, or a venue" className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Series</span><select disabled={played} value={draft.bestOf} onChange={event => setDraft({ ...draft, bestOf: Number(event.target.value) })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary disabled:opacity-60">{SERIES.map(item => <option key={item} value={item}>Best of {item}</option>)}</select></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Stream link</span><input value={draft.streamUrl} onChange={event => setDraft({ ...draft, streamUrl: event.target.value })} placeholder="https://" className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-7 py-5"><button onClick={() => setEditing(null)} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Cancel</button><button onClick={saveFixture} disabled={saving} className="h-11 bg-primary px-6 text-xs font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-50">{saving ? "Saving…" : "Save fixture"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
