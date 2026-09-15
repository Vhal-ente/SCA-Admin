import { useState, useEffect } from "react";
import { TournamentModalProps } from "@/interfaces/tournament-modal";
import {
  LayoutGrid,
  Users,
  Swords,
  BarChart2,
  Settings,
  Upload,
  ImageIcon,
  Trash2,
  CalendarDays,
  Radio,
} from "lucide-react";
import { TeamsTab } from "./TournamentTeam";       // Refactored child imports
import SettingsTab from "./TournamentSettings";
import TournamentStandings from "./TournamentStanding";
import MatchTab, { type StructureType } from "./TournamentMatch";
import WatchTab from "./TournamentWatch";
import ScheduleTab from "./TournamentSchedule";
import { emptyWatchLinks } from "@/lib/competitions";

// ─── Constants ───────────────────────────────────────────────

const cardClass = "bg-card p-6 rounded-sm border border-border shadow-none";
const primaryBtn =
  "px-6 py-2.5 bg-primary text-primary-foreground rounded-sm font-bold hover:bg-primary/90 transition-colors";
const secondaryBtn =
  "px-6 py-2.5 border border-border text-muted-foreground rounded-sm font-semibold hover:border-primary/50 hover:text-foreground transition-colors";
const inputClass =
  "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

// ─── Reusable Components ─────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return <div className={cardClass}>{children}</div>;
}

function Button({ label, variant = "primary", onClick }: { label: string; variant?: "primary" | "secondary"; onClick: () => void }) {
  return (
    <button
      className={variant === "primary" ? primaryBtn : secondaryBtn}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────

export const Overview = ({
  tournament,
  onSave,
  onSaveWatchLinks,
  onBack,
  entityType = "Tournament",
}: TournamentModalProps & { entityType?: "Tournament" | "League" }) => {
  const entityLabel = entityType;
  const entityLabelLower = entityType.toLowerCase();
  // Local states tied back directly to Tournament object fallbacks
  const [tournamentName, setTournamentName] = useState(tournament?.name || "");
  const [game, setGame] = useState(tournament?.game || "");
  const [isSeasonal, setIsSeasonal] = useState(tournament?.isSeasonal ?? Boolean(tournament?.season));
  const [seasonNumber, setSeasonNumber] = useState(tournament?.seasonNumber || 1);
  const [status, setStatus] = useState<"Active" | "Upcoming" | "Completed">(
    tournament?.status || "Active"
  );
  const [mode, setMode] = useState<"Player" | "Team">(entityType === "League" ? "Team" : tournament?.mode || "Team");
  const [prize, setPrize] = useState(tournament?.prize || "0");
  const [bannerUrl, setBannerUrl] = useState(tournament?.bannerUrl || "");
  const [prizeAllocations, setPrizeAllocations] = useState<number[]>(tournament?.prizeAllocations || [60, 25, 15]);
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [tournamentPhase, setTournamentPhase] = useState<"Registration" | "Drafting" | "Finalized">(
    tournament?.phase || "Registration"
  );
  const [publicationStatus, setPublicationStatus] = useState<"Draft" | "Published">(
    tournament?.publicationStatus || "Draft"
  );
  const [registrationStatus, setRegistrationStatus] = useState<"Scheduled" | "Open" | "Closed">(
    tournament?.registrationStatus || (tournament?.status === "Active" ? "Open" : "Scheduled")
  );
  const [registrationOpensAt, setRegistrationOpensAt] = useState(tournament?.registrationOpensAt || "");
  const [registrationClosesAt, setRegistrationClosesAt] = useState(tournament?.registrationClosesAt || "");
  const [watchLinks, setWatchLinks] = useState(tournament?.watchLinks || emptyWatchLinks());
  const [lastSavedLabel, setLastSavedLabel] = useState("");
  const [tournamentStructure, setTournamentStructure] = useState<StructureType | null>(null);

  // Keep state sync bounds clear if the active context model profiles shift
  useEffect(() => {
    if (tournament) {
      setTournamentName(tournament.name || "");
      setGame(tournament.game || "");
      setIsSeasonal(tournament.isSeasonal ?? Boolean(tournament.season));
      setSeasonNumber(tournament.seasonNumber || 1);
      setPrize(tournament.prize || "0");
      setBannerUrl(tournament.bannerUrl || "");
      setPrizeAllocations(tournament.prizeAllocations || [60, 25, 15]);
      if (tournament.status) setStatus(tournament.status);
      setMode(entityType === "League" ? "Team" : tournament.mode || "Team");
      setTournamentPhase(tournament.phase || "Registration");
      setPublicationStatus(tournament.publicationStatus || "Draft");
      setRegistrationStatus(tournament.registrationStatus || (tournament.status === "Active" ? "Open" : "Scheduled"));
      setRegistrationOpensAt(tournament.registrationOpensAt || "");
      setRegistrationClosesAt(tournament.registrationClosesAt || "");
      setWatchLinks(tournament.watchLinks || emptyWatchLinks());
    }
  }, [tournament, entityType]);

  // A save hands back the stored record; only a different competition clears the save note.
  useEffect(() => setLastSavedLabel(""), [tournament?.id]);

  useEffect(() => {
    const applyRegistrationTimeline = () => {
      const now = Date.now();
      const opens = registrationOpensAt ? new Date(registrationOpensAt).getTime() : 0;
      const closes = registrationClosesAt ? new Date(registrationClosesAt).getTime() : 0;
      if (closes && closes <= now && registrationStatus !== "Closed") {
        setRegistrationStatus("Closed");
        setStatus("Active");
        setTournamentPhase("Drafting");
      } else if (opens && opens <= now && (!closes || closes > now) && registrationStatus === "Scheduled") {
        setRegistrationStatus("Open");
        setStatus("Active");
        setTournamentPhase("Registration");
      }
    };
    applyRegistrationTimeline();
    const timer = window.setInterval(applyRegistrationTimeline, 60000);
    return () => window.clearInterval(timer);
  }, [registrationClosesAt, registrationOpensAt, registrationStatus]);

  const saveTournament = async (nextPublicationStatus: "Draft" | "Published") => {
    const saved = await onSave({
      ...tournament,
      name: tournamentName,
      game,
      season: isSeasonal ? `Season ${seasonNumber}` : "",
      isSeasonal,
      seasonNumber: isSeasonal ? seasonNumber : undefined,
      status,
      mode: entityType === "League" ? "Team" : mode,
      prize,
      bannerUrl: bannerUrl || undefined,
      prizeAllocations,
      publicationStatus: nextPublicationStatus,
      phase: tournamentPhase,
      registrationStatus,
      registrationOpensAt: registrationOpensAt || undefined,
      registrationClosesAt: registrationClosesAt || undefined,
    });
    if (saved === false) return;
    setPublicationStatus(nextPublicationStatus);
    setLastSavedLabel(
      nextPublicationStatus === "Published"
        ? `Changes published to the live ${entityLabelLower} page.`
        : `Draft saved. The live ${entityLabelLower} remains unchanged.`
    );
  };

  const handleSaveChanges = () => saveTournament(publicationStatus);
  const handleSaveAsDraft = () => saveTournament("Draft");
  const handlePublish = () => saveTournament("Published");

  const handleDiscardChanges = () => {
    setTournamentName(tournament?.name || "");
    setGame(tournament?.game || "");
    setIsSeasonal(tournament?.isSeasonal ?? Boolean(tournament?.season));
    setSeasonNumber(tournament?.seasonNumber || 1);
    setStatus(tournament?.status || "Active");
    setMode(entityType === "League" ? "Team" : tournament?.mode || "Team");
    setPrize(tournament?.prize || "0");
    setBannerUrl(tournament?.bannerUrl || "");
    setPrizeAllocations(tournament?.prizeAllocations || [60, 25, 15]);
    setTournamentPhase(tournament?.phase || "Registration");
    setPublicationStatus(tournament?.publicationStatus || "Draft");
    setRegistrationStatus(tournament?.registrationStatus || (tournament?.status === "Active" ? "Open" : "Scheduled"));
    setRegistrationOpensAt(tournament?.registrationOpensAt || "");
    setRegistrationClosesAt(tournament?.registrationClosesAt || "");
    setLastSavedLabel("");
  };

  const setPaidPositions = (count: number) => {
    const safeCount = Math.max(1, Math.min(15, count));
    const base = Math.floor(100 / safeCount);
    const remainder = 100 - base * safeCount;
    setPrizeAllocations(Array.from({ length: safeCount }, (_, index) => base + (index < remainder ? 1 : 0)));
  };

  const updateAllocation = (index: number, value: number) => {
    setPrizeAllocations(current => current.map((allocation, allocationIndex) => allocationIndex === index ? Math.max(0, Math.min(100, value || 0)) : allocation));
  };

  const allocationTotal = prizeAllocations.reduce((total, allocation) => total + allocation, 0);
  const numericPrize = Number(prize.replace(/[^0-9.]/g, "")) || 0;
  const ordinal = (position: number) => {
    const remainder = position % 100;
    if (remainder >= 11 && remainder <= 13) return `${position}th`;
    return `${position}${position % 10 === 1 ? "st" : position % 10 === 2 ? "nd" : position % 10 === 3 ? "rd" : "th"}`;
  };

  const handleBannerUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBannerUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const scheduleRegistration = () => {
    setRegistrationStatus("Scheduled");
    setStatus("Upcoming");
    setTournamentPhase("Registration");
    setLastSavedLabel("Registration schedule staged. Save or publish to apply it.");
  };

  const openRegistration = () => {
    setRegistrationStatus("Open");
    setStatus("Active");
    setTournamentPhase("Registration");
    setPublicationStatus("Published");
    setLastSavedLabel(`Registration is open and the ${entityLabelLower} is visible to participants. Publish changes to push it live.`);
  };

  const closeRegistration = () => {
    setRegistrationStatus("Closed");
    setStatus("Active");
    setTournamentPhase("Drafting");
    setLastSavedLabel("Registration closed. The competition has moved to drafting.");
  };

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      {/* Header */}
      <div className="mx-auto max-w-[1600px]">
      <div className="mb-7 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button type="button" onClick={onBack} className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary hover:text-primary/80">← Back to {entityLabelLower}s</button>
          <p className="sca-eyebrow mb-2">{entityLabel} editor</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{tournamentName || `Unnamed ${entityLabel}`}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{game || "Game not selected"} · {isSeasonal ? `Season ${seasonNumber}` : "One-off event"}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-sm border border-primary/35 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Current phase · {tournamentPhase}
            </span>
            <span className={`rounded-sm border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${publicationStatus === "Published" ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-400" : "border-amber-500/35 bg-amber-500/10 text-amber-400"}`}>
              {publicationStatus === "Published" ? "Live" : "Draft"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleSaveAsDraft} className="h-11 rounded-sm border border-border bg-card px-6 text-sm font-bold text-foreground transition-colors hover:border-primary/60 hover:text-primary">
              Save as draft
            </button>
            <button type="button" onClick={handlePublish} className="h-11 rounded-sm bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
              {publicationStatus === "Published" ? "Publish changes" : "Publish"}
            </button>
          </div>
          {lastSavedLabel && <p className="max-w-sm text-right text-xs text-muted-foreground" role="status">{lastSavedLabel}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-7 flex overflow-x-auto border-b border-border">
        {[
          { label: "OVERVIEW", icon: <LayoutGrid size={20} /> },
          { label: "WATCH", icon: <Radio size={20} /> },
          { label: "PARTICIPANTS", displayLabel: mode === "Team" ? "TEAMS" : "PLAYERS", icon: <Users size={20} /> },
          { label: "MATCHES", icon: <Swords size={20} /> },
          { label: "SCHEDULE", icon: <CalendarDays size={20} /> },
          { label: "STANDINGS", icon: <BarChart2 size={20} /> },
          { label: "SETTINGS", icon: <Settings size={20} /> },
        ].map(({ label, displayLabel, icon }) => {
          const isActive = label === activeTab;
          return (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex min-w-28 items-center justify-center gap-2 border-b-2 px-5 py-3 text-[10px] font-bold tracking-widest transition-colors
          ${
            isActive
              ? "border-primary bg-primary/5 text-primary"
              : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
            >
              {icon}
              {displayLabel || label}
            </button>
          );
        })}
      </div>

      {/* --- OVERVIEW TAB MAIN CONTAINER WORKSPACE --- */}
      {activeTab === "OVERVIEW" && (
        <>
          <div className="relative mb-6 h-60 overflow-hidden rounded-sm border border-border">
            <img
              src="/arena.png"
              alt="hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07100e]/95 via-[#07100e]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-2xl p-6 md:p-8">
              <span className="mb-3 inline-block rounded-sm bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                CHAMPIONSHIP SERIES
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-white">{entityLabel} overview</h2>
              <p className="mt-2 text-sm text-white/65">
                Manage core parameters, competition status, schedule, and prize distribution.
              </p>
            </div>
          </div>

          <div className="mb-6 border border-border bg-card">
            <div className="flex flex-col gap-4 border-b border-border p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="sca-eyebrow mb-2">Registration operations</p>
                <h3 className="text-xl font-semibold">Open registration manually or by schedule</h3>
                <p className="mt-2 text-sm text-muted-foreground">Scheduled competitions remain Upcoming. Open registration makes them Active; closing registration starts Drafting.</p>
              </div>
              <span className={`border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] ${registrationStatus === "Open" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : registrationStatus === "Closed" ? "border-border text-muted-foreground" : "border-amber-500/30 bg-amber-500/10 text-amber-500"}`}>Registration · {registrationStatus}</span>
            </div>
            <div className="grid gap-4 p-6 lg:grid-cols-2">
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Registration opens</span><input type="datetime-local" value={registrationOpensAt} onChange={event => setRegistrationOpensAt(event.target.value)} className={inputClass} /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Registration closes</span><input type="datetime-local" value={registrationClosesAt} onChange={event => setRegistrationClosesAt(event.target.value)} className={inputClass} /></label>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-border p-6">
              <button type="button" onClick={scheduleRegistration} disabled={!registrationOpensAt} className={`${secondaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}><CalendarDays className="mr-2 inline h-4 w-4" />Schedule registration</button>
              <button type="button" onClick={openRegistration} className={primaryBtn}>Open registration now</button>
              <button type="button" onClick={closeRegistration} disabled={registrationStatus !== "Open"} className={`${secondaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}>Close &amp; begin drafting</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6 flex flex-col">
              <Card>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="sca-eyebrow mb-1">Competition setup</p>
                    <h3 className="text-xl font-semibold tracking-tight">General Information</h3>
                  </div>
                  <span className="rounded-sm border border-primary/20 bg-primary/5 px-3 py-2 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live session</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tournament Name */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{entityLabel} name</p>
                    <input
                      value={tournamentName}
                      onChange={(e) => setTournamentName(e.target.value)}
                      placeholder={`Enter ${entityLabelLower} name`}
                      className={inputClass}
                    />
                  </div>

                  {/* Game */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Game</p>
                    <input
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                      placeholder="Call of Duty Mobile"
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Seasonal event</p>
                    <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isSeasonal}
                        onClick={() => setIsSeasonal((current) => !current)}
                        className={`flex min-h-12 items-center justify-between rounded-sm border px-4 py-3 text-left transition-colors ${isSeasonal ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                      >
                        <span>
                          <span className={`block text-sm font-semibold ${isSeasonal ? "text-primary" : "text-foreground"}`}>{isSeasonal ? "Seasonal competition" : "One-off competition"}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">{isSeasonal ? "This event belongs to a numbered season." : "This event does not use seasons."}</span>
                        </span>
                        <span className={`relative ml-4 h-6 w-11 shrink-0 rounded-full transition-colors ${isSeasonal ? "bg-primary" : "bg-muted"}`}>
                          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${isSeasonal ? "translate-x-6" : "translate-x-1"}`} />
                        </span>
                      </button>
                      <label className={`block ${isSeasonal ? "" : "pointer-events-none opacity-45"}`}>
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Season number</span>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          disabled={!isSeasonal}
                          value={seasonNumber}
                          onChange={(event) => setSeasonNumber(Math.max(1, Number(event.target.value) || 1))}
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{isSeasonal ? `Public label: Season ${seasonNumber}` : "No season label will appear on the public page."}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lifecycle status</p>
                    <div className="border border-border bg-background px-4 py-3"><p className="text-sm font-semibold text-primary">{status}</p><p className="mt-1 text-xs text-muted-foreground">Driven by registration and competition phase controls.</p></div>
                  </div>

                  {/* Prize Pool Splitter */}
                  <div className="md:col-span-2">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prize pool allocation</p><p className="mt-1 text-sm text-muted-foreground">Choose the final paid position, then assign a percentage to every winner from 1st through that place.</p></div>
                      <label className="w-full sm:w-56"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Pay winners through</span><select value={prizeAllocations.length} onChange={event => setPaidPositions(Number(event.target.value))} className={inputClass}>{Array.from({ length: 15 }, (_, index) => index + 1).map(position => <option key={position} value={position}>{ordinal(position)} place</option>)}</select></label>
                    </div>

                    <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Total prize pool</span><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span><input value={prize} onChange={(e) => setPrize(e.target.value)} className={`${inputClass} pl-8 text-lg font-semibold`} /></div></label>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {prizeAllocations.map((allocation, index) => (
                        <div key={index} className="border border-border bg-background p-4">
                          <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{ordinal(index + 1)} place</span><span className="text-xs text-muted-foreground">${Math.round(numericPrize * allocation / 100).toLocaleString()}</span></div>
                          <div className="relative"><input aria-label={`${ordinal(index + 1)} place percentage`} type="number" min="0" max="100" value={allocation} onChange={event => updateAllocation(index, Number(event.target.value))} className={`${inputClass} pr-9 font-semibold`} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span></div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex h-2 overflow-hidden bg-muted">
                      {prizeAllocations.map((allocation, index) => <div key={index} style={{ width: `${allocation}%`, opacity: Math.max(0.28, 1 - index * 0.09) }} className="h-full bg-primary" />)}
                    </div>
                    <div className={`mt-3 flex items-center justify-between border px-4 py-3 text-xs font-bold uppercase tracking-wide ${allocationTotal === 100 ? "border-primary/30 bg-primary/5 text-primary" : "border-destructive/30 bg-destructive/5 text-destructive"}`}><span>Total allocated</span><span>{allocationTotal}% / 100%</span></div>
                    {allocationTotal !== 100 && <p className="mt-2 text-xs text-destructive">Prize allocations must total exactly 100% before saving.</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button label="Discard Changes" variant="secondary" onClick={handleDiscardChanges} />
                  <button disabled={allocationTotal !== 100} onClick={handleSaveChanges} className={`${primaryBtn} disabled:cursor-not-allowed disabled:opacity-40`}>Save Changes</button>
                </div>
              </Card>
            </div>

            {/* Side Information Panels */}
            <div className="space-y-6">
              <Card>
                <p className="sca-eyebrow mb-1">Live metrics</p>
                <h4 className="mb-5 text-xl font-semibold tracking-tight">Quick Stats</h4>
                <div className="divide-y divide-border border-y border-border">
                  <div className="flex items-start justify-between py-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Registered {mode === "Team" ? "Teams" : "Players"}</p>
                      <p className="text-3xl font-semibold text-foreground">24<span className="text-muted-foreground text-lg">/{tournament?.teams || 32}</span></p>
                    </div>
                    <span className="text-xs font-semibold text-primary mt-1">+12%</span>
                  </div>

                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Participation mode</p>
                    <div className={`grid gap-2 ${entityType === "League" ? "grid-cols-1" : "grid-cols-2"}`}>
                      {(entityType === "League" ? (["Team"] as const) : (["Team", "Player"] as const)).map((item) => (
                        <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-sm border px-4 py-3 text-left transition-colors ${mode === item ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                          <span className="block text-sm font-semibold">{entityType === "League" ? "Team league" : `${item} ${entityLabelLower}`}</span>
                          <span className="mt-1 block text-xs opacity-75">{item === "Team" ? "Teams register and compete as rosters." : "Individual players register and compete directly."}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start justify-between py-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Matches</p>
                      <p className="text-3xl font-semibold text-foreground">114</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">0 Pending</span>
                  </div>
                </div>
              </Card>

              <Card>
                <p className="sca-eyebrow mb-1">Media</p>
                <h4 className="text-xl font-semibold tracking-tight">{entityLabel} banner</h4>
                <p className="mb-4 mt-1 text-sm text-muted-foreground">Displayed at the top of the public {entityLabelLower} page.</p>

                {bannerUrl ? (
                  <div className="overflow-hidden border border-border bg-background">
                    <div className="relative aspect-[16/7] overflow-hidden bg-secondary">
                      <img src={bannerUrl} alt={`${tournamentName || entityLabel} banner`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                      <span className="absolute bottom-3 left-3 border border-white/20 bg-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Current banner</span>
                    </div>
                    <div className="grid grid-cols-2 border-t border-border">
                      <button type="button" onClick={() => document.getElementById("banner-upload")?.click()} className="flex h-11 items-center justify-center gap-2 border-r border-border text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary hover:text-primary"><Upload className="h-4 w-4" />Replace</button>
                      <button type="button" onClick={() => setBannerUrl("")} className="flex h-11 items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"><Trash2 className="h-4 w-4" />Remove</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => document.getElementById("banner-upload")?.click()} className="group flex aspect-[16/7] w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-background px-4 text-center text-foreground transition-colors hover:border-primary hover:bg-primary/5">
                    <span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary"><ImageIcon className="h-5 w-5" /></span>
                    <span className="text-sm font-bold uppercase tracking-wide">Upload {entityLabelLower} banner</span>
                    <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground">Recommended 1920 × 840px · JPG, PNG or WebP</span>
                  </button>
                )}
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleBannerUpload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </Card>
            </div>
          </div>
        </>
      )}

      {/* --- RELATIONAL ROUTED TAB MODULE SUB-VIEWS --- */}
      {activeTab === "PARTICIPANTS" && <TeamsTab activeTab={activeTab} mode={mode} entryType={tournament?.entryType || "Free"} entryFee={tournament?.entryFee || ""} playerPhase={tournamentPhase} setPlayerPhase={setTournamentPhase} />}
      {activeTab === "WATCH" && (
        <WatchTab
          activeTab={activeTab}
          entityLabel={entityLabel}
          links={watchLinks}
          onChange={setWatchLinks}
          onSave={tournament?.id ? onSaveWatchLinks : undefined}
        />
      )}
      {activeTab === "SCHEDULE" && <ScheduleTab activeTab={activeTab} />}
      {activeTab === "SETTINGS" && <SettingsTab activeTab={activeTab} />}
      {activeTab === "STANDINGS" && <TournamentStandings activeTab={activeTab} mode={mode} tournamentPhase={tournamentPhase} structureType={tournamentStructure} />}
      {activeTab === "MATCHES" && <MatchTab activeTab={activeTab} mode={mode} participantCount={tournament?.teams || 16} tournamentPhase={tournamentPhase} onPhaseChange={setTournamentPhase} onStructureGenerated={setTournamentStructure} />}
      </div>
    </div>
  );
};
