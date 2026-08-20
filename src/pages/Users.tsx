import { useState } from "react";
import { 
  Plus, 
  MoreVertical, 
  Shield, 
  Ban, 
  Edit, 
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Swords,
  Ticket
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import UserActionModals from "@/components/modals/UserActionModals";
import { PLATFORM_PLAYERS } from "@/data/platformPlayers";

type ModalType = "add-player" | "edit-player" | "add-admin" | "edit-team" | "delete" | null;

// Mock Datasets with matching interface structures
const INITIAL_TEAMS = [
  { id: '1', name: 'Neon Vipers', founded: 'Jan 2023', region: 'North America', rank: 'DIAMOND IV', status: 'VERIFIED' },
  { id: '2', name: 'Cyber Sentinels', founded: 'Nov 2022', region: 'Europe West', rank: 'GRANDMASTER', status: 'VERIFIED' },
  { id: '3', name: 'Redux Phoenix', founded: 'Mar 2024', region: 'Asia Pacific', rank: 'PLATINUM II', status: 'PENDING' },
  { id: '4', name: 'Zero Gravity', founded: 'Dec 2022', region: 'South America', rank: 'UNRANKED', status: 'SUSPENDED' },
];

const INITIAL_ADMINS = [
  { id: "admin-1", name: "Amina Bello", email: "amina@sca.gg", role: "Super Admin", type: "super", status: "Active" },
  { id: "admin-2", name: "Daniel Cole", email: "daniel@sca.gg", role: "Moderator", type: "mod", status: "Active" },
  { id: "admin-3", name: "Maya Stone", email: "maya@sca.gg", role: "Tournament Manager", type: "manager", status: "Active" },
  { id: "admin-4", name: "Tari Okafor", email: "tari@sca.gg", role: "Shogun Manager", type: "manager", status: "Active" },
  { id: "admin-5", name: "Lena Adeyemi", email: "lena@sca.gg", role: "Finance Manager", type: "manager", status: "Active" },
  { id: "admin-6", name: "Femi James", email: "femi@sca.gg", role: "League Manager", type: "manager", status: "Active" },
  { id: "admin-7", name: "Nora James", email: "nora@sca.gg", role: "Content Admin", type: "manager", status: "Active" },
];

const INITIAL_REPORTS = [
  { id: "RPT-1042", subject: "Toxic behaviour in match chat", reportedUser: "Player2", reporter: "Player1", category: "Conduct", status: "Open" },
  { id: "RPT-1038", subject: "Tournament payment not reflected", reportedUser: "ShadowHunter", reporter: "ShadowHunter", category: "Payment", status: "In review" },
  { id: "RPT-1029", subject: "Suspected result manipulation", reportedUser: "GlitchOps", reporter: "Tournament Manager", category: "Competitive integrity", status: "Open" },
];

const ITEMS_PER_PAGE = 2; // Slice threshold setup to trigger pagination elements

const Users = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("players");
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [reportReplies, setReportReplies] = useState<Record<string, string>>({});

  // Filter and Pagination Tracking hooks
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerRank, setPlayerRank] = useState("all");
  const [playerPage, setPlayerPage] = useState(1);

  const [teamSearch, setTeamSearch] = useState("");
  const [teamPage, setTeamPage] = useState(1);

  // Modal Orchestration State Hooks
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItemContext, setSelectedItemContext] = useState<any>(null);

  const triggerModal = (type: ModalType, context: any = null) => {
    setSelectedItemContext(context);
    setModalType(type);
  };

  // --- Players Filtering & Pagination Engine ---
  const filteredPlayers = PLATFORM_PLAYERS.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(playerSearch.toLowerCase()) || 
                          player.team.toLowerCase().includes(playerSearch.toLowerCase());
    const matchesRank = playerRank === "all" || player.rank.toLowerCase() === playerRank.toLowerCase();
    return matchesSearch && matchesRank;
  });

  const totalPlayerPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE) || 1;
  const playerStartIdx = filteredPlayers.length > 0 ? (playerPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const playerEndIdx = Math.min(playerPage * ITEMS_PER_PAGE, filteredPlayers.length);
  const visiblePlayers = filteredPlayers.slice((playerPage - 1) * ITEMS_PER_PAGE, playerPage * ITEMS_PER_PAGE);

  // --- Teams Filtering & Pagination Engine ---
  const filteredTeams = INITIAL_TEAMS.filter((team) => 
    team.name.toLowerCase().includes(teamSearch.toLowerCase()) || team.region.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const totalTeamPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE) || 1;
  const teamStartIdx = filteredTeams.length > 0 ? (teamPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const teamEndIdx = Math.min(teamPage * ITEMS_PER_PAGE, filteredTeams.length);
  const visibleTeams = filteredTeams.slice((teamPage - 1) * ITEMS_PER_PAGE, teamPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      
      {/* --- MODAL INJECTION PORTAL --- */}
      <UserActionModals 
        type={modalType}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        targetData={selectedItemContext}
        onConfirm={(data) => console.log("Database updated callback stream hook:", data)}
      />

      {/* --- TOP PROFILE HEADER --- */}
      <header className="mx-auto flex w-full max-w-[1600px] justify-between border-b border-border pb-7">
        <div>
          <p className="sca-eyebrow mb-2">Platform directory</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">User management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage players, teams, and administrators across the platform's tournaments and leagues.
          </p>
        </div>
      </header>

      {/* --- TABS NAVIGATION INTERFACE --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto mt-7 max-w-[1600px] space-y-7">
        <div className="overflow-x-auto border-b border-border">
          <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
            <TabsTrigger value="players" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Players</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Teams</TabsTrigger>
            <TabsTrigger value="admins" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Admins</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Reports</TabsTrigger>
          </TabsList>
        </div>

        {/* --- PLAYERS MANAGEMENT TAB PANEL --- */}
        <TabsContent value="players" className="space-y-6 outline-none focus:outline-none">
          <div className="flex flex-col space-y-5 rounded-sm border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="sca-eyebrow mb-2">Player directory</p>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">Players</h3>
                <p className="mt-1 text-sm text-muted-foreground">Manage all registered players and their competitive stats.</p>
              </div>
              <Button onClick={() => triggerModal("add-player")} className="h-11 w-full gap-2 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <Plus className="w-4 h-4 stroke-[3]" />
                Add Player
              </Button>
            </div>

            {/* Filter Tool Strip */}
            <div className="flex flex-col gap-3 border border-border bg-background p-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={playerSearch}
                  onChange={(e) => { setPlayerSearch(e.target.value); setPlayerPage(1); }}
                  placeholder="Search players..." 
                  className="h-11 w-full rounded-sm border-border bg-card pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Select value={playerRank} onValueChange={(val) => { setPlayerRank(val); setPlayerPage(1); }}>
                <SelectTrigger className="h-11 w-full rounded-sm border-border bg-card px-4 text-sm font-semibold text-foreground sm:w-[210px]">
                  <SelectValue placeholder="Filter by rank" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Filter by rank</SelectItem>
                  <SelectItem value="grandmaster">Grandmaster</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Responsive Table Grid */}
            <div className="overflow-x-auto w-full">
              <Table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <TableHeader>
                  <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="pb-3 pl-2 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Player</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Team</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Rank</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Stats</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Status</TableHead>
                    <TableHead className="pb-3 text-right pr-2 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border font-medium">
                  {visiblePlayers.length > 0 ? (
                    visiblePlayers.map((player) => (
                      <TableRow key={player.id} className="border-b border-border transition-colors hover:bg-secondary/50">
                        <TableCell className="py-4 pl-2 font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-9 w-9 items-center justify-center border border-border bg-primary/10 text-xs font-black text-primary">{player.name.slice(0, 2).toUpperCase()}</div>
                            <span className="font-bold tracking-wide text-foreground">{player.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-muted-foreground">{player.team}</TableCell>
                        <TableCell className="py-4">
                          <Badge className={`px-2 py-0.5 text-[9px] font-black tracking-wide rounded border bg-transparent pointer-events-none ${
                            player.rank === 'Grandmaster' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                            player.rank === 'Diamond' ? 'text-primary border-primary/30 bg-primary/10' :
                            'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                          }`}>
                            {player.rank}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 font-bold font-mono text-[11px]">
                          <span className="text-primary">{player.wins} W</span>
                          <span className="mx-1.5 text-muted-foreground">/</span>
                          <span className="text-rose-400">{player.losses} L</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            player.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${player.status === 'Active' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                            <span>{player.status}</span>
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 rounded-sm p-0 text-muted-foreground hover:bg-secondary hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-sm border-border bg-popover text-popover-foreground">
                              <DropdownMenuItem onClick={() => triggerModal("edit-player", player)} className="cursor-pointer focus:bg-secondary focus:text-foreground"><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => triggerModal("delete", player)} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No matching players found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* --- SHADCN INTEGRATED PLAYERS FOOTER PAGINATION --- */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:flex-row">
              <span>Showing {playerStartIdx}-{playerEndIdx} of {filteredPlayers.length} players</span>
              
              <Pagination className="mx-0 w-auto">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (playerPage > 1) setPlayerPage(playerPage - 1); }}
                      className={playerPage === 1 ? "opacity-40 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPlayerPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink 
                        href="#" 
                        isActive={p === playerPage} 
                        onClick={(e) => { e.preventDefault(); setPlayerPage(p); }}
                        className={`h-8 w-8 rounded-sm text-[11px] font-mono ${p === playerPage ? "bg-primary text-primary-foreground font-black" : "border border-border bg-background text-muted-foreground hover:text-foreground"}`}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (playerPage < totalPlayerPages) setPlayerPage(playerPage + 1); }}
                      className={playerPage === totalPlayerPages ? "opacity-40 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {/* Metric Infocards Layer */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-4 rounded-sm border border-border bg-card p-5">
              <div className="border border-primary/25 bg-primary/10 p-3 text-primary"><TrendingUp className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Growth</p>
                <p className="mt-0.5 text-xl font-semibold text-foreground">+12.4%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-sm border border-border bg-card p-5">
              <div className="border border-primary/25 bg-primary/10 p-3 text-primary"><Swords className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Scrims</p>
                <p className="mt-0.5 text-xl font-semibold text-foreground">42</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-sm border border-border bg-card p-5">
              <div className="border border-primary/25 bg-primary/10 p-3 text-primary"><Ticket className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Open Tickets</p>
                <p className="mt-0.5 text-xl font-semibold text-foreground">7</p>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* --- TEAMS PANEL TAB INTERFACE --- */}
        <TabsContent value="teams" className="space-y-6 outline-none focus:outline-none">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
            <div>
              <p className="sca-eyebrow mb-2">Organizations</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Team directory</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage organizations, regional rankings, and tournament eligibility.</p>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={teamSearch}
                  onChange={(e) => { setTeamSearch(e.target.value); setTeamPage(1); }}
                  placeholder="Search team names..." 
                  className="h-11 w-full rounded-sm border-border bg-card pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary"
                />
              </div>
              <Button variant="outline" className="flex h-11 items-center space-x-1.5 rounded-sm border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px] tracking-widest font-black">Filters</span>
              </Button>
            </div>
          </div>

          {/* Directory Overview Matrix Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Teams', count: '1,248' },
              { label: 'Global Regions', count: '06' },
              { label: 'New Registrations', count: '42', sub: 'THIS WEEK' },
              { label: 'Disqualified', count: '03' }
            ].map((item, index) => (
              <div key={index} className="flex h-28 flex-col justify-between rounded-sm border border-border bg-card p-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{item.count}</p>
                </div>
                {item.sub && <span className="text-[8px] font-black tracking-wider text-primary">{item.sub}</span>}
              </div>
            ))}
          </section>

          {/* Main Table Grid Card */}
          <div className="flex flex-col space-y-4 overflow-x-auto rounded-sm border border-border bg-card p-5">
            <Table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="pb-3 text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Team Name</TableHead>
                  <TableHead className="pb-3 text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Region</TableHead>
                  <TableHead className="pb-3 text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Rank</TableHead>
                  <TableHead className="pb-3 text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Status</TableHead>
                  <TableHead className="pb-3 text-right text-muted-foreground uppercase tracking-wider text-[9px] font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border font-medium">
                {visibleTeams.length > 0 ? (
                  visibleTeams.map((team) => (
                    <TableRow key={team.id} className="border-b border-border transition-colors hover:bg-secondary/50 group">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 items-center justify-center border border-border bg-primary/10 text-xs font-black text-primary">{team.name.slice(0, 2).toUpperCase()}</div>
                          <div>
                            <div className="font-bold text-foreground transition-colors group-hover:text-primary">{team.name}</div>
                            <div className="mt-0.5 text-[9px] text-muted-foreground">Founded: {team.founded}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-muted-foreground">{team.region}</td>
                      <td className="py-4">
                        <span className="text-[10px] font-black font-mono tracking-tight text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
                          {team.rank}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center space-x-1 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full ${
                          team.status === 'VERIFIED' ? 'bg-emerald-500/10 text-primary' :
                          team.status === 'PENDING' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          <span>●</span> <span>{team.status}</span>
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 rounded-sm p-0 text-muted-foreground hover:bg-secondary hover:text-foreground">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-sm border-border bg-popover text-popover-foreground">
                            <DropdownMenuItem onClick={() => triggerModal("edit-team", team)} className="cursor-pointer focus:bg-secondary focus:text-foreground"><Edit className="w-4 h-4 mr-2" /> Edit records</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No teams match these filters.</td>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* --- SHADCN INTEGRATED TEAMS FOOTER PAGINATION --- */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-[10px] font-bold text-muted-foreground sm:flex-row">
              <span>Showing {teamStartIdx}-{teamEndIdx} of {filteredTeams.length} teams</span>
              
              <Pagination className="mx-0 w-auto">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (teamPage > 1) setTeamPage(teamPage - 1); }}
                      className={teamPage === 1 ? "opacity-40 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalTeamPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink 
                        href="#" 
                        isActive={p === teamPage} 
                        onClick={(e) => { e.preventDefault(); setTeamPage(p); }}
                          className={`rounded-sm px-2 py-0.5 text-[11px] font-mono font-bold ${p === teamPage ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:text-foreground"}`}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (teamPage < totalTeamPages) setTeamPage(teamPage + 1); }}
                      className={teamPage === totalTeamPages ? "opacity-40 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </TabsContent>

        {/* --- ADMINS PANEL TAB PANEL --- */}
        <TabsContent value="admins" className="space-y-6 outline-none focus:outline-none">
          <div className="flex flex-col space-y-6 rounded-sm border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="sca-eyebrow mb-2">Access control</p>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">Admins &amp; moderators</h3>
                <p className="mt-1 text-sm text-muted-foreground">Assign internal platform roles and system permissions.</p>
              </div>
              <Button onClick={() => triggerModal("add-admin")} className="h-11 w-full gap-2 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <Plus className="w-4 h-4 stroke-[3]" /> Add Admin
              </Button>
            </div>

            <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {[['6', 'Active staff'], ['6', 'Operational roles'], ['100%', 'Accounts active']].map(([value, label]) => <div key={label} className="bg-background/60 p-4"><p className="text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p></div>)}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {INITIAL_ADMINS.map((admin) => {
                const scope: Record<string, string> = { 'Super Admin': 'All platform operations', 'Moderator': 'Users, reports & moderation', 'Tournament Manager': 'Tournament operations', 'Shogun Manager': 'Shogun community operations', 'Finance Manager': 'Transactions & payment settings', 'League Manager': 'League operations', 'Content Admin': 'Website content operations' };
                return <article key={admin.id} className="border border-border bg-background p-5">
                  <div className="flex items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center bg-primary/10 text-sm font-black text-primary">{admin.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><Badge className={`pointer-events-none rounded-none border font-bold ${admin.type === 'super' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'}`}><Shield className="mr-1 h-3 w-3" />{admin.role}</Badge></div>
                  <h4 className="mt-5 text-lg font-semibold text-foreground">{admin.name}</h4><p className="mt-1 text-sm text-muted-foreground">{admin.email}</p>
                  <div className="my-5 border-y border-border py-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Access scope</p><p className="mt-2 text-sm font-medium text-foreground">{scope[admin.role]}</p></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{admin.status}</span><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-9 w-9 rounded-none border border-border p-0 text-muted-foreground hover:bg-card hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="rounded-sm border-border bg-popover text-popover-foreground"><DropdownMenuItem onClick={() => triggerModal("edit-player", admin)}><Edit className="mr-2 h-4 w-4" />Modify clearance</DropdownMenuItem><DropdownMenuItem onClick={() => triggerModal("delete", admin)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Revoke access</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
                </article>;
              })}
            </div>
          </div>
        </TabsContent>

        {/* --- REPORTS PANEL TAB PANEL --- */}
        <TabsContent value="reports" className="space-y-6 outline-none focus:outline-none">
          <div className="flex flex-col space-y-5 rounded-sm border border-border bg-card p-6">
            <div>
              <p className="sca-eyebrow mb-2">Trust &amp; safety</p>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">Reports &amp; support tickets</h3>
              <p className="mt-1 text-sm text-muted-foreground">Investigate reports, reply to the reporter, share feedback, and close resolved tickets.</p>
            </div>
            <div className="grid gap-4">{reports.map(report => <article key={report.id} className="border border-border bg-background p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{report.id}</span><span className="border border-border px-2 py-1 text-[9px] font-bold uppercase text-muted-foreground">{report.category}</span><span className={`border px-2 py-1 text-[9px] font-bold uppercase ${report.status === 'Closed' ? 'border-emerald-500/30 text-emerald-500' : 'border-amber-500/30 text-amber-500'}`}>{report.status}</span></div><h4 className="mt-3 text-lg font-semibold text-foreground">{report.subject}</h4><p className="mt-2 text-xs text-muted-foreground">Reported user: <strong className="text-foreground">{report.reportedUser}</strong> · Submitted by {report.reporter}</p></div>{report.status !== 'Closed' && <Button variant="outline" onClick={() => { setReports(current => current.map(item => item.id === report.id ? {...item, status: 'Closed'} : item)); toast({title: 'Ticket closed', description: `${report.id} has been marked as resolved.`}); }} className="h-10 rounded-sm border-emerald-500/30 text-xs font-bold uppercase tracking-wider text-emerald-500 hover:bg-emerald-500/10">Close ticket</Button>}</div><div className="mt-5 border-t border-border pt-5"><label className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Response &amp; feedback</label><Textarea disabled={report.status === 'Closed'} value={reportReplies[report.id] || ''} onChange={event => setReportReplies(current => ({...current, [report.id]: event.target.value}))} placeholder="Write a response, request more information, or explain the resolution..." className="mt-2 min-h-24 rounded-sm border-border bg-card text-sm" /><div className="mt-3 flex flex-wrap gap-2"><Button disabled={report.status === 'Closed' || !reportReplies[report.id]?.trim()} onClick={() => toast({title: 'Response sent', description: `Your reply was sent for ${report.id}.`})} className="h-10 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground">Send response</Button><Button disabled={report.status === 'Closed' || !reportReplies[report.id]?.trim()} variant="outline" onClick={() => toast({title: 'Feedback recorded', description: `Feedback was shared and added to ${report.id}.`})} className="h-10 rounded-sm border-border px-5 text-xs font-bold uppercase tracking-wider">Send feedback</Button></div></div></article>)}</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
