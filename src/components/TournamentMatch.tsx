import { useMemo, useState } from "react";
import { AlertTriangle, Brackets, CalendarDays, Check, ChevronRight, Clock, Layers3, MapPin, Pencil, Plus, RefreshCw, Swords, Trophy, X } from "lucide-react";

export type StructureType = "Single elimination" | "Double elimination" | "Round robin" | "Swiss" | "Single lobby" | "Multiple lobbies";
type SeriesType = "Best of 1" | "Best of 3" | "Best of 5" | "Best of 7";
type GeneratedStructure = { type: StructureType; series: SeriesType; participants: number; rounds: number; matches: number; lobbies: number; advancePerLobby: number };
type Fixture = { id: string; stage: string; slot: number; participantA: string; participantB: string; date: string; time: string; venue: string };

const structureOptions: Array<{ name: StructureType; description: string; lobby?: boolean }> = [
  { name: "Single elimination", description: "One loss eliminates a participant." },
  { name: "Double elimination", description: "Winners and lower brackets with two-loss elimination." },
  { name: "Round robin", description: "Every participant plays every other participant." },
  { name: "Swiss", description: "Participants face opponents with similar records." },
  { name: "Single lobby", description: "All participants compete together in one scored lobby.", lobby: true },
  { name: "Multiple lobbies", description: "Split participants into groups, then advance qualifiers.", lobby: true },
];

const fixtureDate = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset + 1);
  return date.toISOString().split("T")[0];
};

function createFixtures(structure: GeneratedStructure, mode: "Player" | "Team"): Fixture[] {
  const label = (index: number) => `${mode} ${String(index + 1).padStart(2, "0")}`;
  const make = (stage: string, slot: number, participantA: string, participantB: string, day: number): Fixture => ({ id: `${stage}-${slot}-${day}`.replace(/\s+/g, "-").toLowerCase(), stage, slot, participantA, participantB, date: fixtureDate(day), time: `${String(12 + slot % 7).padStart(2, "0")}:00`, venue: "Online" });
  const fixtures: Fixture[] = [];
  if (structure.type === "Round robin") {
    const count = structure.participants % 2 === 0 ? structure.participants : structure.participants + 1;
    const rotation = Array.from({ length: count }, (_, index) => index < structure.participants ? index : -1);
    for (let round = 0; round < count - 1; round++) {
      for (let match = 0; match < count / 2; match++) {
        const first = rotation[match]; const second = rotation[count - 1 - match];
        if (first >= 0 && second >= 0) fixtures.push(make(`Round ${round + 1}`, match + 1, label(first), label(second), round));
      }
      rotation.splice(1, 0, rotation.pop()!);
    }
    return fixtures;
  }
  if (structure.type === "Swiss") {
    for (let round = 0; round < structure.rounds; round++) for (let match = 0; match < Math.ceil(structure.participants / 2); match++) fixtures.push(make(`Swiss round ${round + 1}`, match + 1, round === 0 ? label(match * 2) : "Paired by record", round === 0 ? label(match * 2 + 1) : "Paired by record", round));
    return fixtures;
  }
  if (structure.type === "Single lobby" || structure.type === "Multiple lobbies") {
    const lobbyCount = Math.max(1, structure.lobbies);
    for (let lobby = 0; lobby < lobbyCount; lobby++) fixtures.push(make(`Lobby ${String.fromCharCode(65 + lobby)}`, 1, `${mode}s assigned to lobby`, `${structure.advancePerLobby} advance`, lobby));
    if (structure.type === "Multiple lobbies") fixtures.push(make("Final lobby", 1, "Qualified finalists", "Championship session", lobbyCount));
    return fixtures;
  }
  const rounds = Math.ceil(Math.log2(structure.participants));
  for (let round = 0; round < rounds; round++) {
    const matchCount = Math.max(1, Math.ceil(structure.participants / 2 ** (round + 1)));
    const stage = round === rounds - 1 ? "Grand final" : round === rounds - 2 ? "Semifinals" : round === rounds - 3 ? "Quarterfinals" : `Winners round ${round + 1}`;
    for (let match = 0; match < matchCount; match++) fixtures.push(make(stage, match + 1, round === 0 ? label(match * 2) : "TBD", round === 0 ? label(match * 2 + 1) : "TBD", round));
  }
  if (structure.type === "Double elimination") for (let round = 0; round < Math.max(1, rounds - 1); round++) { const matchCount = Math.max(1, Math.ceil(structure.participants / 2 ** (round + 2))); for (let match = 0; match < matchCount; match++) fixtures.push(make(`Lower bracket round ${round + 1}`, match + 1, "TBD", "TBD", rounds + round)); }
  return fixtures;
}

function StructureView({ structure, mode }: { structure: GeneratedStructure; mode: "Player" | "Team" }) {
  const noun = mode === "Team" ? "teams" : "players";
  const participantLabel = (index: number) => `${mode} ${String(index + 1).padStart(2, "0")}`;
  const stageName = (round: number, total: number) => round === total ? "Grand final" : round === total - 1 ? "Semifinals" : round === total - 2 ? "Quarterfinals" : `Round ${round}`;

  if (structure.type === "Single lobby" || structure.type === "Multiple lobbies") {
    const lobbyCount = Math.max(1, structure.lobbies);
    const perLobby = Math.ceil(structure.participants / lobbyCount);
    return <div className="space-y-5"><div><p className="sca-eyebrow mb-1">Lobby stage</p><h3 className="text-xl font-semibold">{structure.type === "Single lobby" ? "Main lobby" : "Qualifying lobbies"}</h3><p className="mt-1 text-sm text-muted-foreground">{structure.participants} {noun} distributed across {lobbyCount} {lobbyCount === 1 ? "lobby" : "lobbies"}.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: lobbyCount }, (_, lobbyIndex) => { const start = lobbyIndex * perLobby; const count = Math.max(0, Math.min(perLobby, structure.participants - start)); return <div key={lobbyIndex} className="border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3"><span className="text-xs font-bold uppercase tracking-widest text-primary">Lobby {String.fromCharCode(65 + lobbyIndex)}</span><span className="text-xs text-muted-foreground">Top {Math.min(structure.advancePerLobby, count)} advance</span></div><div className="divide-y divide-border">{Array.from({ length: count }, (_, index) => <div key={index} className="flex items-center justify-between px-4 py-2.5 text-sm"><span className="text-foreground">{participantLabel(start + index)}</span><span className="text-xs text-muted-foreground">Seed {start + index + 1}</span></div>)}</div></div>; })}</div>{structure.type === "Multiple lobbies" && <div className="border border-primary/30 bg-primary/5 p-5"><div className="flex items-center gap-3"><Trophy className="h-5 w-5 text-primary" /><div><p className="font-semibold">Final lobby</p><p className="text-sm text-muted-foreground">{Math.min(structure.participants, lobbyCount * structure.advancePerLobby)} qualifiers advance from the lobby stage.</p></div></div></div>}</div>;
  }

  if (structure.type === "Round robin" || structure.type === "Swiss") {
    const matchesPerRound = Math.ceil(structure.participants / 2);
    return <div className="space-y-5"><div><p className="sca-eyebrow mb-1">{structure.type} stage</p><h3 className="text-xl font-semibold">Full round plan</h3><p className="mt-1 text-sm text-muted-foreground">{structure.rounds} rounds · {structure.matches} total matches · {structure.series}</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: structure.rounds }, (_, roundIndex) => <div key={roundIndex} className="border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3"><span className="text-xs font-bold uppercase tracking-widest text-primary">Round {roundIndex + 1}</span><span className="text-xs text-muted-foreground">{matchesPerRound} fixtures</span></div><div className="divide-y divide-border">{Array.from({ length: Math.min(matchesPerRound, 8) }, (_, matchIndex) => <div key={matchIndex} className="flex items-center gap-3 px-4 py-3 text-xs"><span className="flex h-6 w-6 items-center justify-center bg-secondary font-bold text-primary">{matchIndex + 1}</span><span className="text-muted-foreground">{structure.type === "Swiss" && roundIndex > 0 ? "Paired by current record" : `${participantLabel(matchIndex * 2)} vs ${participantLabel(matchIndex * 2 + 1)}`}</span></div>)}{matchesPerRound > 8 && <div className="px-4 py-3 text-xs font-semibold text-muted-foreground">+ {matchesPerRound - 8} additional fixtures generated</div>}</div></div>)}</div></div>;
  }

  const bracketRounds = Math.max(1, Math.ceil(Math.log2(structure.participants)));
  const bracket = (title: string, rounds: number, lower = false) => <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{title}</p><div className="flex min-w-max gap-4">{Array.from({ length: rounds }, (_, roundIndex) => { const matchCount = Math.max(1, Math.ceil(structure.participants / 2 ** (roundIndex + (lower ? 2 : 1)))); return <div key={roundIndex} className="w-56 border border-border bg-card"><div className="border-b border-border bg-secondary/50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary">{lower ? `Lower round ${roundIndex + 1}` : stageName(roundIndex + 1, rounds)}</div><div className="space-y-3 p-3">{Array.from({ length: matchCount }, (_, matchIndex) => <div key={matchIndex} className="border border-border bg-background"><div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">{roundIndex === 0 && !lower ? participantLabel(matchIndex * 2) : "TBD"}</div><div className="px-3 py-2 text-xs text-muted-foreground">{roundIndex === 0 && !lower ? participantLabel(matchIndex * 2 + 1) : "TBD"}</div></div>)}</div></div>; })}</div></div>;
  return <div className="space-y-7 overflow-x-auto"><div><p className="sca-eyebrow mb-1">Bracket structure</p><h3 className="text-xl font-semibold">{structure.type}</h3><p className="mt-1 text-sm text-muted-foreground">{structure.participants} {noun} · {structure.series} · {structure.matches} matches</p></div>{bracket("Winners bracket", bracketRounds)}{structure.type === "Double elimination" && bracket("Lower bracket", Math.max(1, bracketRounds - 1), true)}{structure.type === "Double elimination" && <div className="flex w-56 items-center gap-3 border border-primary/30 bg-primary/5 p-4"><Trophy className="h-5 w-5 text-primary" /><div><p className="font-semibold">Grand final</p><p className="text-xs text-muted-foreground">Winners bracket finalist vs lower bracket finalist</p></div></div>}</div>;
}

function FixtureSchedule({ fixtures, onEdit }: { fixtures: Fixture[]; onEdit: (fixture: Fixture) => void }) {
  const stages = Array.from(new Set(fixtures.map(fixture => fixture.stage)));
  return <div className="space-y-5"><div className="flex items-end justify-between"><div><p className="sca-eyebrow mb-1">Full competition schedule</p><h3 className="text-xl font-semibold text-foreground">Fixtures from start to finish</h3><p className="mt-1 text-sm text-muted-foreground">Review every generated slot and adjust individual fixtures where needed.</p></div><span className="border border-border bg-card px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{fixtures.length} fixtures</span></div><div className="space-y-4">{stages.map(stage => <div key={stage} className="overflow-hidden border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3"><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{stage}</span><span className="text-xs text-muted-foreground">{fixtures.filter(fixture => fixture.stage === stage).length} slots</span></div><div className="divide-y divide-border">{fixtures.filter(fixture => fixture.stage === stage).map(fixture => <div key={fixture.id} className="grid gap-4 px-5 py-4 md:grid-cols-[3rem_1.4fr_1fr_1fr_auto] md:items-center"><span className="text-xs font-bold text-muted-foreground">#{String(fixture.slot).padStart(2, "0")}</span><div className="flex items-center gap-3 text-sm"><span className="font-semibold text-foreground">{fixture.participantA}</span><span className="text-primary">vs</span><span className="font-semibold text-foreground">{fixture.participantB}</span></div><p className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" />{fixture.date}<Clock className="ml-1 h-4 w-4 text-primary" />{fixture.time}</p><p className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{fixture.venue}</p><button onClick={() => onEdit(fixture)} className="flex h-9 items-center justify-center gap-2 border border-border bg-background px-3 text-[10px] font-bold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary"><Pencil className="h-3.5 w-3.5" />Edit</button></div>)}</div></div>)}</div></div>;
}

export default function MatchTab({ activeTab, mode, participantCount, tournamentPhase, onPhaseChange, onStructureGenerated }: { activeTab: string; mode: "Player" | "Team"; participantCount: number; tournamentPhase: "Registration" | "Drafting" | "Finalized"; onPhaseChange: (phase: "Registration" | "Drafting" | "Finalized") => void; onStructureGenerated: (structure: StructureType) => void }) {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [structureType, setStructureType] = useState<StructureType>("Single elimination");
  const [series, setSeries] = useState<SeriesType>("Best of 3");
  const [participants, setParticipants] = useState(Math.max(2, participantCount || 16));
  const [lobbies, setLobbies] = useState(2);
  const [advancePerLobby, setAdvancePerLobby] = useState(4);
  const [generated, setGenerated] = useState<GeneratedStructure | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);

  const isLobby = structureType === "Single lobby" || structureType === "Multiple lobbies";
  const noun = mode === "Team" ? "teams" : "players";
  const participantFieldLabel = mode === "Team" ? "Number of teams" : "Number of players";
  const preview = useMemo(() => {
    const safeParticipants = Math.max(2, participants);
    const lobbyCount = structureType === "Single lobby" ? 1 : structureType === "Multiple lobbies" ? Math.max(2, lobbies) : 0;
    if (structureType === "Round robin") return { rounds: safeParticipants - 1, matches: safeParticipants * (safeParticipants - 1) / 2, lobbies: 0 };
    if (structureType === "Swiss") return { rounds: Math.max(3, Math.ceil(Math.log2(safeParticipants))), matches: Math.ceil(safeParticipants / 2) * Math.max(3, Math.ceil(Math.log2(safeParticipants))), lobbies: 0 };
    if (structureType === "Double elimination") return { rounds: Math.ceil(Math.log2(safeParticipants)) * 2, matches: safeParticipants * 2 - 2, lobbies: 0 };
    if (isLobby) return { rounds: structureType === "Single lobby" ? 1 : 2, matches: lobbyCount + (structureType === "Multiple lobbies" ? 1 : 0), lobbies: lobbyCount };
    return { rounds: Math.ceil(Math.log2(safeParticipants)), matches: safeParticipants - 1, lobbies: 0 };
  }, [advancePerLobby, isLobby, lobbies, participants, structureType]);

  if (activeTab !== "MATCHES") return null;

  const generateStructure = () => {
    const nextStructure = { type: structureType, series, participants, rounds: preview.rounds, matches: preview.matches, lobbies: preview.lobbies, advancePerLobby };
    setGenerated(nextStructure);
    setFixtures(createFixtures(nextStructure, mode));
    onStructureGenerated(structureType);
    onPhaseChange("Drafting");
    setBuilderOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="sca-eyebrow mb-2">Match operations</p><h2 className="text-2xl font-semibold tracking-tight">Matches</h2><p className="mt-1 text-sm text-muted-foreground">Generate a competition structure and manage fixtures for {noun}.</p></div>
        <button onClick={() => setBuilderOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:brightness-105">{generated ? <RefreshCw className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{generated ? "Regenerate structure" : "Generate structure"}</button>
      </div>

      {generated && (
        <><div className="grid border border-primary/30 bg-primary/5 sm:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="border-b border-primary/20 p-4 sm:border-b-0 sm:border-r"><p className="text-[10px] font-bold uppercase tracking-widest text-primary">Active structure</p><p className="mt-1 font-semibold text-foreground">{generated.type}</p><p className="text-xs text-muted-foreground">{isLobby ? `${generated.lobbies} ${generated.lobbies === 1 ? "lobby" : "lobbies"}` : generated.series}</p></div>
          {[{ label: participantFieldLabel, value: generated.participants }, { label: "Rounds", value: generated.rounds }, { label: isLobby ? "Lobby sessions" : "Matches", value: generated.matches }, { label: isLobby ? "Advance / lobby" : "Series", value: isLobby ? generated.advancePerLobby : generated.series.replace("Best of ", "BO") }].map(item => <div key={item.label} className="border-r border-primary/20 p-4 last:border-r-0"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p><p className="mt-1 text-xl font-semibold text-foreground">{item.value}</p></div>)}
        </div>{tournamentPhase === "Drafting" && <div className="flex flex-col gap-4 border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-amber-500">Drafting phase active</p><p className="mt-1 text-sm text-muted-foreground">Finalize the selected {noun} when the tournament field is ready. This will unlock Standings.</p></div><button onClick={() => onPhaseChange("Finalized")} className="h-10 shrink-0 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground">Finalize draft & unlock standings</button></div>}</>
      )}

      {generated ? (
        <div className="space-y-10"><StructureView structure={generated} mode={mode} /><FixtureSchedule fixtures={fixtures} onEdit={setEditingFixture} /></div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-border bg-card px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center bg-primary/10 text-primary"><Brackets className="h-7 w-7" /></span>
          <h3 className="mt-5 text-xl font-semibold text-foreground">No tournament structure</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">No fixtures or lobbies will appear until a structure is generated for this tournament.</p>
          <button onClick={() => setBuilderOpen(true)} className="mt-6 inline-flex h-11 items-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground"><Plus className="h-4 w-4" />Generate structure</button>
        </div>
      )}

      {builderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border bg-secondary/35 px-7 py-6"><div className="flex items-start gap-4"><span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary"><Brackets className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Structure generator</p><h3 className="mt-1 text-2xl font-semibold">Build tournament format</h3><p className="mt-1 text-sm text-muted-foreground">Configured for <strong className="text-foreground">{mode} mode</strong> — fixtures will use {noun} as participants.</p></div></div><button onClick={() => setBuilderOpen(false)} className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="h-5 w-5" /></button></div>

            <div className="space-y-7 p-7">
              <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">1. Select competition structure</p><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{structureOptions.map(option => <button key={option.name} type="button" onClick={() => setStructureType(option.name)} className={`min-h-28 border p-4 text-left transition-colors ${structureType === option.name ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50"}`}><div className="flex items-start justify-between"><span className={structureType === option.name ? "text-primary" : "text-muted-foreground"}>{option.lobby ? <Layers3 className="h-5 w-5" /> : <Swords className="h-5 w-5" />}</span>{structureType === option.name && <Check className="h-4 w-4 text-primary" />}</div><p className="mt-3 text-sm font-bold text-foreground">{option.name}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{option.description}</p></button>)}</div></div>

              <div className="grid gap-5 border-t border-border pt-6 md:grid-cols-2 lg:grid-cols-4">
                <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{participantFieldLabel}</span><input type="number" min="2" value={participants} onChange={event => setParticipants(Math.max(2, Number(event.target.value)))} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
                {!isLobby && <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Match series</span><select value={series} onChange={event => setSeries(event.target.value as SeriesType)} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary">{["Best of 1", "Best of 3", "Best of 5", "Best of 7"].map(item => <option key={item}>{item}</option>)}</select></label>}
                {structureType === "Multiple lobbies" && <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Number of lobbies</span><input type="number" min="2" value={lobbies} onChange={event => setLobbies(Math.max(2, Number(event.target.value)))} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>}
                {isLobby && <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Advance per lobby</span><input type="number" min="1" value={advancePerLobby} onChange={event => setAdvancePerLobby(Math.max(1, Number(event.target.value)))} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>}
              </div>

              <div className="border border-border bg-secondary/35 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Generated preview</p><div className="mt-4 grid gap-4 sm:grid-cols-4">{[{ label: "Format", value: structureType }, { label: participantFieldLabel, value: participants }, { label: "Rounds", value: preview.rounds }, { label: isLobby ? "Sessions" : "Matches", value: preview.matches }].map(item => <div key={item.label}><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p><p className="mt-1 font-semibold text-foreground">{item.value}</p></div>)}</div></div>
              <div className="flex items-start gap-4 border border-amber-500/35 bg-amber-500/10 p-5"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /><div><p className="text-sm font-bold text-foreground">Generating this structure will start the Drafting phase</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">The tournament will move from <strong>{tournamentPhase}</strong> to <strong>Drafting</strong>. Registration will be treated as closed, and the admin can select approved {noun} for the generated fixtures.</p></div></div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-7 py-5"><button onClick={() => setBuilderOpen(false)} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground">Cancel</button><button onClick={generateStructure} className="flex h-11 items-center gap-2 bg-primary px-6 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:brightness-105">Generate & start drafting <ChevronRight className="h-4 w-4" /></button></div>
          </div>
        </div>
      )}

      {editingFixture && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border bg-secondary/35 px-7 py-6"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Fixture editor</p><h3 className="mt-1 text-2xl font-semibold text-foreground">Adjust {editingFixture.stage}</h3><p className="mt-1 text-sm text-muted-foreground">Update this slot without regenerating the rest of the structure.</p></div><button onClick={() => setEditingFixture(null)} className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-5 p-7 sm:grid-cols-2">
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Participant A</span><input value={editingFixture.participantA} onChange={event => setEditingFixture({ ...editingFixture, participantA: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Participant B</span><input value={editingFixture.participantB} onChange={event => setEditingFixture({ ...editingFixture, participantB: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</span><input type="date" value={editingFixture.date} onChange={event => setEditingFixture({ ...editingFixture, date: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</span><input type="time" value={editingFixture.time} onChange={event => setEditingFixture({ ...editingFixture, time: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Venue or channel</span><input value={editingFixture.venue} onChange={event => setEditingFixture({ ...editingFixture, venue: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-7 py-5"><button onClick={() => setEditingFixture(null)} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Cancel</button><button onClick={() => { setFixtures(current => current.map(fixture => fixture.id === editingFixture.id ? editingFixture : fixture)); setEditingFixture(null); }} className="h-11 bg-primary px-6 text-xs font-bold uppercase tracking-wide text-primary-foreground">Save fixture</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
