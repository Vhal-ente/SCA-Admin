import { useState } from "react";
import { 
  Users, CheckCircle2, Clock, XCircle, Trash2, 
  Search, Plus, X, Save, Shield, UserPlus, Sliders, Upload 
} from "lucide-react";
import { playerCreatedTeams } from "@/data/playerTeams";

interface Team {
  id: string;
  name: string;
  tag: string;
  members: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  source: "Admin" | "Player Dashboard";
  paymentStatus: "Not Required" | "Pending" | "Paid" | "Failed";
  players: Array<{ id: string; name: string; gamerTag: string; role: "Captain" | "Player" | "Substitute"; status: "Active" | "Pending" }>;
  logoUrl?: string; // Appended to store image preview base64 or URL pointers
}

interface TournamentPlayer {
  id: string;
  name: string;
  gamerTag: string;
  gameId: string;
  status: "Approved" | "Pending" | "Rejected";
  source: "Player Dashboard" | "Admin";
  paymentStatus: "Not Required" | "Pending" | "Paid" | "Failed";
  registeredAt: string;
  drafted: boolean;
}

export const TeamsTab = ({ activeTab, mode, entryType, entryFee, playerPhase, setPlayerPhase }: { activeTab: string; mode: "Player" | "Team"; entryType: "Free" | "Paid"; entryFee: string; playerPhase: "Registration" | "Drafting" | "Finalized"; setPlayerPhase: (phase: "Registration" | "Drafting" | "Finalized") => void }) => {
  const roster = (tag: string, names: string[]) => names.map((name, index) => ({ id: `${tag}-${index + 1}`, name, gamerTag: `${tag}${index + 1}`, role: (index === 0 ? "Captain" : "Player") as "Captain" | "Player", status: "Active" as const }));
  
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Sentinels Alpha", tag: "SEN", members: 5, status: "Approved", date: "2026-06-01", source: "Player Dashboard", paymentStatus: "Paid", players: roster("SEN", ["Marcus Vance", "Elena Cruz", "Dayo Cole", "Mira James", "Tobi Adeyemi"]) },
    { id: "2", name: "Natus Vincere", tag: "NAVI", members: 5, status: "Pending", date: "2026-06-05", source: "Player Dashboard", paymentStatus: "Pending", players: roster("NAVI", ["Alex Koval", "Ivan Petrov", "Mika Stone", "Nora Vale", "Sam Ridge"]) },
    { id: "3", name: "Fnatic Rising", tag: "FNC", members: 6, status: "Approved", date: "2026-05-28", source: "Admin", paymentStatus: "Not Required", players: roster("FNC", ["Jamie Brooks", "Lena Hart", "Kofi Mensah", "Ava Cole", "Noah Miles", "Rae Quinn"]) },
    { id: "4", name: "T1 Academy", tag: "T1", members: 5, status: "Rejected", date: "2026-05-20", source: "Player Dashboard", paymentStatus: "Failed", players: roster("T1", ["Jin Park", "Min Seo", "Kai Lee", "Han Kim", "Yun Choi"]) },
  ]);
  const [players, setPlayers] = useState<TournamentPlayer[]>([
    { id: "p1", name: "Marcus Vance", gamerTag: "ArcVance", gameId: "WZ-10482", status: "Approved", source: "Player Dashboard", paymentStatus: "Paid", registeredAt: "2026-06-01", drafted: true },
    { id: "p2", name: "Elena Cruz", gamerTag: "NovaCruz", gameId: "WZ-20891", status: "Pending", source: "Player Dashboard", paymentStatus: "Pending", registeredAt: "2026-06-05", drafted: false },
    { id: "p3", name: "Kofi Mensah", gamerTag: "KoFury", gameId: "WZ-31576", status: "Approved", source: "Player Dashboard", paymentStatus: "Paid", registeredAt: "2026-05-28", drafted: false },
    { id: "p4", name: "Ava Cole", gamerTag: "AvaStrike", gameId: "WZ-41730", status: "Rejected", source: "Admin", paymentStatus: "Failed", registeredAt: "2026-05-20", drafted: false },
  ]);

  // Interactivity Visibility State Engine Hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [registrationSource, setRegistrationSource] = useState<"existing" | "manual">("existing");
  const [selectedExistingTeamId, setSelectedExistingTeamId] = useState("");
  const [newPlayerGameId, setNewPlayerGameId] = useState("");

  // Form Configuration Targeting Hooks
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({ 
    name: "", 
    tag: "", 
    members: 5, 
    status: "Pending" as Team["status"],
    logoUrl: "",
    paymentStatus: (entryType === "Paid" ? "Pending" : "Not Required") as Team["paymentStatus"],
  });
  
  if (activeTab !== "PARTICIPANTS") return null;

  // Image Conversion Processor Stream Logic
  const handleImageUpload = (file: File, type: "CREATE" | "UPDATE") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "CREATE") {
        setNewTeam(prev => ({ ...prev, logoUrl: reader.result as string }));
      } else if (type === "UPDATE" && selectedTeam) {
        setSelectedTeam(prev => prev ? { ...prev, logoUrl: reader.result as string } : null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Action Process Flows
  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.tag) return;

    if (mode === "Player") {
      if (!newPlayerGameId.trim()) return;
      setPlayers(current => [...current, { id: `player-${Date.now()}`, name: newTeam.name, gamerTag: newTeam.tag, gameId: newPlayerGameId, status: newTeam.status, source: "Admin", paymentStatus: newTeam.paymentStatus, registeredAt: new Date().toISOString().split("T")[0], drafted: false }]);
      setNewTeam({ name: "", tag: "", members: 5, status: "Pending", logoUrl: "", paymentStatus: entryType === "Paid" ? "Pending" : "Not Required" });
      setNewPlayerGameId("");
      setIsAddModalOpen(false);
      return;
    }
    
    const teamRecord: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      tag: newTeam.tag.toUpperCase(),
      members: Number(newTeam.members),
      status: newTeam.status,
      date: new Date().toISOString().split("T")[0],
      logoUrl: newTeam.logoUrl || undefined
      ,source: "Admin",
      paymentStatus: newTeam.paymentStatus,
      players: selectedExistingTeamId
        ? (playerCreatedTeams.find((team) => team.id === selectedExistingTeamId)?.players || []).map((name, index) => ({ id: `${newTeam.tag}-${index + 1}`, name, gamerTag: `${newTeam.tag}${index + 1}`, role: index === 0 ? "Captain" : "Player", status: "Active" }))
        : roster(newTeam.tag, Array.from({ length: Number(newTeam.members) }, (_, index) => `Player ${index + 1}`)),
    };

    setTeams([...teams, teamRecord]);
    setNewTeam({ name: "", tag: "", members: 5, status: "Pending", logoUrl: "", paymentStatus: entryType === "Paid" ? "Pending" : "Not Required" });
    setSelectedExistingTeamId("");
    setRegistrationSource("existing");
    setIsAddModalOpen(false);
  };

  const selectExistingTeam = (teamId: string) => {
    setSelectedExistingTeamId(teamId);
    const existingTeam = playerCreatedTeams.find((team) => team.id === teamId);
    if (!existingTeam) return;
    setNewTeam({
      name: existingTeam.name,
      tag: existingTeam.tag,
      members: existingTeam.members,
      status: "Pending",
      logoUrl: existingTeam.logoUrl,
      paymentStatus: entryType === "Paid" ? "Pending" : "Not Required",
    });
  };

  const handleUpdateTeamSave = () => {
    if (!selectedTeam) return;
    setTeams(teams.map(t => t.id === selectedTeam.id ? selectedTeam : t));
    setIsManageDrawerOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedTeam) return;
    setTeams(teams.filter(t => t.id !== selectedTeam.id));
    setIsDeleteAlertOpen(false);
    setSelectedTeam(null);
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchQuery.toLowerCase()) || player.gamerTag.toLowerCase().includes(searchQuery.toLowerCase()) || player.gameId.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div><p className="sca-eyebrow mb-2">Registration</p><h2 className="text-2xl font-semibold tracking-tight text-foreground">Tournament {mode === "Team" ? "teams" : "players"}</h2><p className="mt-1 text-sm text-muted-foreground">Review registrations, validate {mode === "Team" ? "rosters" : "player profiles"}, and manage approved participants.</p></div>

      {mode === "Player" && (
        <div className="grid overflow-hidden border border-border bg-card lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary"><UserPlus className="h-5 w-5" /></span>
            <div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Published tournament</p><span className="border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">Visible on frontend</span></div><h3 className="mt-1 font-semibold text-foreground">{playerPhase === "Registration" ? "Player registration is open" : playerPhase === "Drafting" ? "Player drafting is in progress" : "Tournament roster finalized"}</h3><p className="mt-1 text-sm text-muted-foreground">{playerPhase === "Registration" ? "Players register from their dashboard. Review and approve profiles before closing registration." : playerPhase === "Drafting" ? "Registration is closed. Select approved players to build the final tournament field." : "The selected player field is locked and ready for match generation."}</p></div>
          </div>
          <div className="flex items-center gap-3 border-t border-border p-5 lg:border-l lg:border-t-0">
            <div className="mr-2 text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workflow</p><p className="text-sm font-semibold text-foreground">{playerPhase} phase</p></div>
            {playerPhase === "Registration" && <button onClick={() => setPlayerPhase("Drafting")} className="h-11 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground">Close registration & start draft</button>}
            {playerPhase === "Drafting" && <button onClick={() => setPlayerPhase("Finalized")} className="h-11 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground">Finalize selected players</button>}
            {playerPhase === "Finalized" && <button onClick={() => setPlayerPhase("Drafting")} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-foreground">Reopen draft</button>}
          </div>
        </div>
      )}
      
      {/* ─── ACTION HEADER CONTROLS BAR ─── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-sm border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search registered ${mode === "Team" ? "teams" : "players"}...`}
            className="w-full bg-background text-sm text-foreground pl-9 pr-4 py-2 rounded-sm border border-input focus:border-primary outline-none transition-colors"
          />
        </div>
        {(mode === "Team" || playerPhase === "Registration") && <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add {mode === "Team" ? "Team" : "Player"}
        </button>}
      </div>

      {/* ─── TEAM PARTICIPANTS GRID GRID ─── */}
      {mode === "Team" ? (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredTeams.map((team) => (
          <div key={team.id} className="group relative flex min-h-[19rem] flex-col justify-between overflow-hidden border border-border bg-card p-5 transition-colors hover:border-primary/50">
            <div className={`absolute inset-x-0 top-0 h-0.5 ${team.status === "Approved" ? "bg-primary" : team.status === "Pending" ? "bg-amber-500" : "bg-destructive"}`} />
            <div>
              <div className="mb-6 flex items-start justify-between">
                {/* Image Avatar Container Frame */}
                {team.logoUrl ? (
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden border border-border bg-background transition-colors group-hover:border-primary/50">
                    <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center border border-border bg-background text-sm font-black text-primary transition-colors group-hover:border-primary/50">
                    {team.tag}
                  </div>
                )}
                
                <span className={`flex items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  team.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  team.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {team.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
                  {team.status === "Pending" && <Clock className="w-3 h-3" />}
                  {team.status === "Rejected" && <XCircle className="w-3 h-3" />}
                  {team.status}
                </span>
              </div>

              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{team.tag} · Tournament entry</p>
              <h4 className="truncate text-lg font-semibold text-foreground">{team.name}</h4>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="border border-border bg-secondary/60 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{team.source}</span>
                <span className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${team.paymentStatus === "Paid" ? "border-primary/20 bg-primary/10 text-primary" : team.paymentStatus === "Failed" ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-border bg-secondary/60 text-muted-foreground"}`}>{entryType === "Paid" ? `${team.paymentStatus} · ${entryFee}` : "Free entry"}</span>
              </div>
              
              <div className="mt-5 grid grid-cols-2 border-y border-border py-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-2 border-r border-border"><Users className="h-4 w-4 text-primary" /> {team.members} players</span>
                <span className="pl-4"><span className="block text-[9px] font-bold uppercase tracking-wider">Registered</span>{new Date(team.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* ACTION TRIGGERS AREA */}
            <div className="mt-5 flex gap-2">
              <button 
                onClick={() => { setSelectedTeam(team); setIsManageDrawerOpen(true); }}
                className="flex h-11 flex-1 items-center justify-center gap-2 border border-border bg-background text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Sliders className="h-4 w-4" /> Manage team
              </button>
              <button 
                onClick={() => { setSelectedTeam(team); setIsDeleteAlertOpen(true); }}
                className="flex h-11 w-11 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/5 hover:text-destructive"
                title="Remove Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredPlayers.map(player => (
            <div key={player.id} className="relative flex min-h-[19rem] flex-col justify-between overflow-hidden border border-border bg-card p-5">
              <div className={`absolute inset-x-0 top-0 h-0.5 ${player.status === "Approved" ? "bg-primary" : player.status === "Pending" ? "bg-amber-500" : "bg-destructive"}`} />
              <div>
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center border border-border bg-background text-sm font-black text-primary">{player.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</div>
                  <span className={`border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${player.status === "Approved" ? "border-primary/25 bg-primary/10 text-primary" : player.status === "Pending" ? "border-amber-500/25 bg-amber-500/10 text-amber-500" : "border-destructive/25 bg-destructive/10 text-destructive"}`}>{player.status}</span>
                </div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">@{player.gamerTag} · Player entry</p>
                <h4 className="text-lg font-semibold text-foreground">{player.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">Game ID: {player.gameId}</p>
                <div className="mt-3 flex flex-wrap gap-1.5"><span className="border border-border bg-secondary/60 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{player.source}</span><span className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${player.paymentStatus === "Paid" ? "border-primary/20 bg-primary/10 text-primary" : player.paymentStatus === "Failed" ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-border bg-secondary/60 text-muted-foreground"}`}>{entryType === "Paid" ? `${player.paymentStatus} · ${entryFee}` : "Free entry"}</span></div>
                <div className="mt-5 grid grid-cols-2 border-y border-border py-3 text-xs text-muted-foreground"><div className="border-r border-border"><span className="block text-[9px] font-bold uppercase tracking-wider">Registered</span>{new Date(player.registeredAt).toLocaleDateString()}</div><div className="pl-4"><span className="block text-[9px] font-bold uppercase tracking-wider">Draft status</span><span className={player.drafted ? "text-primary" : "text-muted-foreground"}>{player.drafted ? "Selected" : "Not selected"}</span></div></div>
              </div>
              <div className="mt-5 flex gap-2">
                {playerPhase === "Registration" ? <button onClick={() => setPlayers(current => current.map(item => item.id === player.id ? { ...item, status: item.status === "Approved" ? "Pending" : "Approved" } : item))} className="h-11 flex-1 border border-border bg-background text-xs font-bold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary">{player.status === "Approved" ? "Move to pending" : "Approve player"}</button> : <button disabled={player.status !== "Approved" || playerPhase === "Finalized"} onClick={() => setPlayers(current => current.map(item => item.id === player.id ? { ...item, drafted: !item.drafted } : item))} className={`h-11 flex-1 border text-xs font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40 ${player.drafted ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-primary"}`}>{player.drafted ? "Remove from draft" : "Select player"}</button>}
                <button onClick={() => setPlayers(current => current.filter(item => item.id !== player.id))} className="flex h-11 w-11 items-center justify-center border border-border bg-background text-muted-foreground hover:border-destructive hover:text-destructive" title="Remove player"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL DIALOG: ADD NEW TEAM REGISTER ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-sm bg-primary/10 text-primary"><UserPlus className="w-5 h-5" /></div>
                <div><p className="sca-eyebrow mb-1">Registration</p><h3 className="text-2xl font-semibold tracking-tight text-foreground">Add New Tournament {mode === "Team" ? "Team" : "Player"}</h3><p className="mt-1 text-sm text-muted-foreground">Create and validate a new {mode.toLowerCase()} participant record.</p></div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="rounded-sm p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddTeamSubmit} className="space-y-6 p-6">
              {mode === "Team" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 rounded-sm border border-border bg-secondary p-1">
                    <button type="button" onClick={() => setRegistrationSource("existing")} className={`rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors ${registrationSource === "existing" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Choose existing team</button>
                    <button type="button" onClick={() => { setRegistrationSource("manual"); setSelectedExistingTeamId(""); }} className={`rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors ${registrationSource === "manual" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Create manually</button>
                  </div>

                  {registrationSource === "existing" && (
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Player-created team</label>
                      <select value={selectedExistingTeamId} onChange={(event) => selectExistingTeam(event.target.value)} className="h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" required>
                        <option value="">Select an existing team</option>
                        {playerCreatedTeams.map((team) => <option key={team.id} value={team.id}>{team.name} ({team.tag}) · {team.members} players · Owner: {team.owner}</option>)}
                      </select>
                      {selectedExistingTeamId && (
                        <p className="mt-2 text-xs text-muted-foreground">Team details are linked from the player-created team profile and prefilled below for review.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Image Upload Row */}
              <div className={`flex items-center gap-4 rounded-sm border border-border bg-secondary p-4 ${mode === "Team" && registrationSource === "existing" ? "opacity-75" : ""}`}>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-background">
                  {newTeam.logoUrl ? (
                    <img src={newTeam.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground uppercase">{newTeam.tag || (mode === "Team" ? "LOGO" : "PHOTO")}</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{mode === "Team" ? "Team insignia / brand" : "Player photo / avatar"}</label>
                  <button
                    type="button"
                    onClick={() => document.getElementById("create-logo-upload")?.click()}
                    disabled={mode === "Team" && registrationSource === "existing"}
                    className="flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                  <input 
                    id="create-logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "CREATE");
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{mode === "Team" ? "Team name" : "Player display name"}</label>
                <input 
                  required
                  placeholder={mode === "Team" ? "e.g. Sentinels Alpha" : "e.g. Adebola Goodness"}
                  value={newTeam.name}
                  onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                  className="h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={mode === "Team" && registrationSource === "existing"}
                />
              </div>
              
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{mode === "Team" ? "Abbreviation tag" : "Gamer tag"}</label>
                  <input 
                    required
                    maxLength={mode === "Team" ? 4 : 24}
                    placeholder={mode === "Team" ? "SEN" : "ArcVance"}
                    value={newTeam.tag}
                    onChange={e => setNewTeam({...newTeam, tag: mode === "Team" ? e.target.value.toUpperCase() : e.target.value})}
                    className={`h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70 ${mode === "Team" ? "uppercase" : ""}`}
                    disabled={mode === "Team" && registrationSource === "existing"}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{mode === "Team" ? "Active players" : "Game ID"}</label>
                  {mode === "Team" ? <input type="number" min={1} value={newTeam.members} onChange={e => setNewTeam({...newTeam, members: parseInt(e.target.value) || 5})} className="h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={registrationSource === "existing"} /> : <input required value={newPlayerGameId} onChange={event => setNewPlayerGameId(event.target.value)} placeholder="e.g. WZ-10482" className="h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />}
                </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Registration status</label>
                <select 
                  value={newTeam.status}
                  onChange={e => setNewTeam({...newTeam, status: e.target.value as Team["status"]})}
                  className="h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="Pending">Pending Audit</option>
                  <option value="Approved">Approved / Qualified</option>
                </select>
              </div>
              {entryType === "Paid" && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment status · {entryFee}</label>
                  <select value={newTeam.paymentStatus} onChange={(event) => setNewTeam({ ...newTeam, paymentStatus: event.target.value as Team["paymentStatus"] })} className="h-11 w-full rounded-sm border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="Pending">Payment pending</option><option value="Paid">Paid and verified</option><option value="Failed">Payment failed</option>
                  </select>
                </div>
              )}
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-border pt-5 sm:flex-row">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="h-11 rounded-sm border border-border px-6 text-sm font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="h-11 rounded-sm bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">Register {mode === "Team" ? "Team" : "Player"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SLIDE DRAWER: ROSTER CONFIGURATION MANAGEMENT ─── */}
      {isManageDrawerOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-card border-l border-border w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex items-start justify-between border-b border-border bg-secondary/35 px-7 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Team administration</p>
                    <h3 className="mt-1 text-2xl font-semibold text-foreground">Manage Team</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Review the roster and update this tournament entry.</p>
                  </div>
                </div>
                <button onClick={() => setIsManageDrawerOpen(false)} className="p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Close team drawer"><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-7 p-7">
                {/* Updatable Roster Image Layout Segment */}
                <div className="flex items-center gap-5 border border-border bg-secondary/40 p-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-border bg-background">
                    {selectedTeam.logoUrl ? (
                      <img src={selectedTeam.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-black uppercase text-muted-foreground">{selectedTeam.tag}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Team insignia / brand</label>
                    <button
                      type="button"
                      onClick={() => document.getElementById("update-logo-upload")?.click()}
                      className="flex items-center gap-2 border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Upload className="w-3.5 h-3.5" /> Modify Brand File
                    </button>
                    <input 
                      id="update-logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "UPDATE");
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Team roster</label>
                      <p className="mt-1 text-xs text-muted-foreground">Players registered with this team.</p>
                    </div>
                    <span className="rounded-sm border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                      {selectedTeam.players.length} players
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-sm border border-border bg-secondary/40">
                    {selectedTeam.players.length > 0 ? selectedTeam.players.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                          {player.name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">{player.name}</p>
                          <p className="truncate text-xs text-muted-foreground">@{player.gamerTag}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-bold text-foreground">{player.role}</span>
                          <span className={`mt-1 inline-flex rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            player.status === "Active"
                              ? "bg-primary/10 text-primary"
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {player.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No players have been added to this team yet.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Tournament team name</label>
                  <input 
                    value={selectedTeam.name}
                    onChange={e => setSelectedTeam({...selectedTeam, name: e.target.value})}
                    className="h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Tag signature</label>
                    <input 
                      maxLength={4}
                      value={selectedTeam.tag}
                      onChange={e => setSelectedTeam({...selectedTeam, tag: e.target.value.toUpperCase()})}
                      className="h-12 w-full border border-border bg-background px-4 text-sm uppercase text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Member seed</label>
                    <input 
                      type="number"
                      value={selectedTeam.members}
                      onChange={e => setSelectedTeam({...selectedTeam, members: parseInt(e.target.value) || 0})}
                      className="h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Registration status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Approved", "Pending", "Rejected"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedTeam({...selectedTeam, status: st})}
                        className={`h-11 border text-xs font-bold uppercase tracking-wide transition-all ${
                          selectedTeam.status === st 
                            ? st === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" :
                              st === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/40" :
                              "bg-rose-500/10 text-rose-400 border-rose-500/40"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-border bg-card p-6">
              <button onClick={() => setIsManageDrawerOpen(false)} className="h-12 flex-1 border border-border bg-background text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">Discard</button>
              <button onClick={handleUpdateTeamSave} className="flex h-12 flex-[1.4] items-center justify-center gap-2 bg-primary text-sm font-bold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-105">
                <Save className="w-4 h-4" /> Commit Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SAFETY DIALOG: DELETION CONFIRMATION DIALOG ─── */}
      {isDeleteAlertOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f141c] border border-rose-950/50 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-100">
            <div className="p-6 space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Remove Tournament Team?</h4>
                <p className="text-sm text-slate-400">Are you sure you want to remove <span className="text-rose-400 font-bold">{selectedTeam.name}</span>? Match score pipelines will lose this identifier reference record.</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#141923] border-t border-[#2a2e42] flex gap-3">
              <button onClick={() => setIsDeleteAlertOpen(false)} className="flex-1 py-2 bg-[#222532] border border-[#2a2e42] text-xs font-bold text-slate-300 rounded-lg hover:text-white">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500 transition-colors">Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
