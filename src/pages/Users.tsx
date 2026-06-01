import { useState } from "react";
import { 
  Plus, 
  MoreVertical, 
  Shield, 
  Ban, 
  UserCheck, 
  Users as UsersIcon, 
  Edit, 
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Swords,
  Ticket
} from "lucide-react";
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
import UserActionModals from "@/components/UserActionModals";

type ModalType = "add-player" | "edit-player" | "add-admin" | "edit-team" | "delete" | null;

const Users = () => {
  const [activeTab, setActiveTab] = useState("players");

  // Modal Orchestration State Hooks
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItemContext, setSelectedItemContext] = useState<any>(null);

  const triggerModal = (type: ModalType, context: any = null) => {
    setSelectedItemContext(context);
    setModalType(type);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#07090d] text-[#94a3b8] min-h-screen font-sans antialiased max-w-[1600px] mx-auto">
      
      {/* --- MODAL INJECTION PORTAL --- */}
      <UserActionModals 
        type={modalType}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        targetData={selectedItemContext}
        onConfirm={(data) => console.log("Database updated callback stream hook:", data)}
      />


      {/* --- TOP PROFILE HEADER --- */}
      <header className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">Users Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage players, teams, and administrators across the platform's tournaments and leagues.
          </p>
        </div>
        
        {/* Profile Info matching Screenshot 2026-06-01 at 4.12.15 pm.png */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">Admin Profile</span>
            <span className="text-[10px] text-slate-500 font-medium">System Master</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4ade80] to-cyan-400 p-px">
            <div className="w-full h-full bg-[#07090d] rounded-xl flex items-center justify-center text-xs font-black text-white">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* --- TABS NAVIGATION INTERFACE --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="bg-[#0f141c]/40 p-1.5 rounded-xl border border-[#1e293b]/20 h-auto gap-1">
            <TabsTrigger value="players" className="px-4 py-1.5 text-xs font-bold capitalize transition-all data-[state=active]:bg-[#1e293b] data-[state=active]:text-[#00FFC6] data-[state=active]:font-black text-slate-500">Players</TabsTrigger>
            <TabsTrigger value="teams" className="px-4 py-1.5 text-xs font-bold capitalize transition-all data-[state=active]:bg-[#1e293b] data-[state=active]:text-[#00FFC6] data-[state=active]:font-black text-slate-500">Teams</TabsTrigger>
            <TabsTrigger value="admins" className="px-4 py-1.5 text-xs font-bold capitalize transition-all data-[state=active]:bg-[#1e293b] data-[state=active]:text-[#00FFC6] data-[state=active]:font-black text-slate-500">Admins</TabsTrigger>
            <TabsTrigger value="reports" className="px-4 py-1.5 text-xs font-bold capitalize transition-all data-[state=active]:bg-[#1e293b] data-[state=active]:text-[#00FFC6] data-[state=active]:font-black text-slate-500">Reports</TabsTrigger>
          </TabsList>
        </div>

       
        <TabsContent value="players" className="space-y-6 outline-none focus:outline-none">
          <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">Players</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage all registered players and their competitive stats.</p>
              </div>
              <Button onClick={() => triggerModal("add-player")} className="bg-[#00FFC6] hover:bg-[#00FFB4] text-[#07090d] rounded-xl text-xs font-black uppercase tracking-wider transition-colors gap-2 w-full sm:w-auto px-4 py-2 h-auto shadow-lg shadow-emerald-500/10">
                <Plus className="w-4 h-4 stroke-[3]" />
                Add Player
              </Button>
            </div>

            {/* Filter Tool Strip */}
            <div className="flex gap-3 bg-[#07090d]/60 p-2 rounded-xl border border-[#1e293b]/20">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search players..." className="w-full bg-[#0c1017] border border-[#1e293b]/40 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus-visible:ring-0 focus-visible:border-[#4ade80]/40 h-8" />
              </div>
              <Select>
                <SelectTrigger className="bg-[#0c1017] border border-[#1e293b]/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-bold w-full sm:w-[180px] h-8">
                  <SelectValue placeholder="Filter by rank" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
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
                  <TableRow className="border-b border-[#1e293b]/30 hover:bg-transparent">
                    <TableHead className="pb-3 pl-2 uppercase tracking-wider text-[9px] font-bold text-slate-500">Player</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-slate-500">Team</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-slate-500">Rank</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-slate-500">Stats</TableHead>
                    <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-slate-500">Status</TableHead>
                    <TableHead className="pb-3 text-right pr-2 uppercase tracking-wider text-[9px] font-bold text-slate-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#1e293b]/10 font-medium">
                  {[
                    { id: '1', name: 'Player1', team: 'Team Alpha', rank: 'Diamond', wins: 150, losses: 120, status: 'Active' },
                    { id: '2', name: 'ShadowHunter', team: 'Viper Esports', rank: 'Grandmaster', wins: 210, losses: 45, status: 'Active' },
                    { id: '3', name: 'GlitchOps', team: 'Neon Legion', rank: 'Platinum', wins: 98, losses: 82, status: 'Offline' },
                  ].map((player) => (
                    <TableRow key={player.id} className="border-b-0 hover:bg-[#141b26]/30 transition-colors group">
                      <TableCell className="py-4 pl-2 font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 bg-slate-800 rounded-lg border border-[#1e293b]/30 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-400">👤</div>
                          <span className="text-white font-bold tracking-wide">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-slate-400 font-semibold">{player.team}</TableCell>
                      <TableCell className="py-4">
                        <Badge className={`px-2 py-0.5 text-[9px] font-black tracking-wide rounded border bg-transparent pointer-events-none ${
                          player.rank === 'Grandmaster' ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' :
                          player.rank === 'Diamond' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' :
                          'text-teal-400 border-teal-500/20 bg-teal-500/5'
                        }`}>
                          {player.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-bold font-mono text-[11px]">
                        <span className="text-[#00FFC6]">{player.wins} W</span>
                        <span className="text-slate-600 mx-1.5">/</span>
                        <span className="text-rose-400">{player.losses} L</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full ${
                          player.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${player.status === 'Active' ? 'bg-[#00FFC6]' : 'bg-slate-500'}`} />
                          <span>{player.status}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-600 hover:text-white hover:bg-transparent">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
                            <DropdownMenuItem onClick={() => triggerModal("edit-player", player)} className="focus:bg-[#1e293b] focus:text-white cursor-pointer"><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerModal("delete", player)} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Custom Pagination Footer Structure */}
            <div className="flex justify-between items-center pt-3 border-t border-[#1e293b]/20 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Showing 1-10 of 2,450 players</span>
              <div className="flex items-center space-x-1">
                <Button size="icon" className="w-7 h-7 bg-[#07090d] border border-[#1e293b]/40 rounded-md hover:text-white hover:bg-[#0f141c] transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></Button>
                <Button size="icon" className="w-7 h-7 bg-[#07090d] border border-[#1e293b]/40 rounded-md text-white hover:text-[#4ade80] hover:bg-[#0f141c] transition-colors"><ChevronRight className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>

          {/* Metric Infocards Layer */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20"><TrendingUp className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Growth</p>
                <p className="text-base font-black text-white mt-0.5">+12.4%</p>
              </div>
            </div>
            <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20"><Swords className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Scrims</p>
                <p className="text-base font-black text-white mt-0.5">42</p>
              </div>
            </div>
            <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Ticket className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Open Tickets</p>
                <p className="text-base font-black text-white mt-0.5">7</p>
              </div>
            </div>
          </section>
        </TabsContent>

     
        <TabsContent value="teams" className="space-y-4 outline-none focus:outline-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">Team Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage professional organizations, track regional rankings, and verify tournament eligibility.</p>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search team names..." className="w-full bg-[#0f141c] border border-[#1e293b]/40 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-600 h-9 focus-visible:ring-0" />
              </div>
              <Button variant="outline" className="flex items-center space-x-1.5 px-4 h-9 bg-[#1e293b]/60 border border-[#1e293b] rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#1e293b]">
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
              <div key={index} className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex flex-col justify-between h-24">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                  <p className="text-2xl font-black text-white mt-1 tracking-tight">{item.count}</p>
                </div>
                {item.sub && <span className="text-[8px] font-black text-[#00FFC6] tracking-wider">{item.sub}</span>}
              </div>
            ))}
          </section>

          {/* Main Table Grid Card */}
          <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 overflow-x-auto">
            <Table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <TableHeader>
                <TableRow className="border-b border-[#1e293b]/30 hover:bg-transparent">
                  <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Team Name</TableHead>
                  <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Region</TableHead>
                  <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Rank</TableHead>
                  <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Status</TableHead>
                  <TableHead className="pb-3 text-right text-slate-500 uppercase tracking-wider text-[9px] font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#1e293b]/10 font-medium">
                {[
                  { id: '1', name: 'Neon Vipers', founded: 'Jan 2023', region: 'North America', rank: 'DIAMOND IV', status: 'VERIFIED' },
                  { id: '2', name: 'Cyber Sentinels', founded: 'Nov 2022', region: 'Europe West', rank: 'GRANDMASTER', status: 'VERIFIED' },
                  { id: '3', name: 'Redux Phoenix', founded: 'Mar 2024', region: 'Asia Pacific', rank: 'PLATINUM II', status: 'PENDING' },
                  { id: '4', name: 'Zero Gravity', founded: 'Dec 2022', region: 'South America', rank: 'UNRANKED', status: 'SUSPENDED' },
                ].map((team) => (
                  <TableRow key={team.id} className="border-b-0 hover:bg-[#141b26]/20 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded bg-slate-950 flex items-center justify-center text-xs border border-[#1e293b]/40">🛡️</div>
                        <div>
                          <div className="text-white font-bold group-hover:text-[#4ade80] transition-colors">{team.name}</div>
                          <div className="text-[9px] text-slate-600 mt-0.5">Founded: {team.founded}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400 font-semibold">{team.region}</td>
                    <td className="py-4">
                      <span className="text-[10px] font-black font-mono tracking-tight text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
                        {team.rank}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center space-x-1 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full ${
                        team.status === 'VERIFIED' ? 'bg-emerald-500/10 text-[#00FFC6]' :
                        team.status === 'PENDING' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        <span>●</span> <span>{team.status}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-600 hover:text-white hover:bg-transparent">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
                          <DropdownMenuItem onClick={() => triggerModal("edit-team", team)} className="focus:bg-[#1e293b] focus:text-white cursor-pointer"><Edit className="w-4 h-4 mr-2" /> Edit Records</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Directory Pagination Layout Component */}
            <div className="flex justify-between items-center pt-4 border-t border-[#1e293b]/20 text-[10px] font-bold text-slate-500 mt-2">
              <span>Showing 5 of 1,248 teams</span>
              <div className="flex items-center space-x-1">
                <Button size="icon" className="w-6 h-6 p-0 bg-[#07090d] border border-[#1e293b]/40 rounded text-slate-400 hover:text-white hover:bg-transparent"><ChevronLeft className="w-3.5 h-3.5" /></Button>
                <span className="px-2 py-0.5 bg-[#00FFC6] text-[#07090d] rounded font-black cursor-default text-[11px]">1</span>
                <span className="px-2 py-0.5 bg-[#07090d] border border-[#1e293b]/40 rounded hover:text-white cursor-pointer text-[11px]">2</span>
                <Button size="icon" className="w-6 h-6 p-0 bg-[#07090d] border border-[#1e293b]/40 rounded text-slate-400 hover:text-white hover:bg-transparent"><ChevronRight className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        </TabsContent>

     {/* ========================================================
            ADMINS PANEL 
            ======================================================== */}
        <TabsContent value="admins" className="space-y-6 outline-none focus:outline-none">
          <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">Admins / Moderators</h3>
                <p className="text-xs text-slate-500 mt-0.5">Assign internal platform roles and system security clearances.</p>
              </div>
              {/* Trigger Add Admin Modal */}
              <Button onClick={() => triggerModal("add-admin")} className="bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] rounded-xl text-xs font-black uppercase tracking-wider gap-2 w-full sm:w-auto h-auto px-4 py-2 shadow-lg shadow-emerald-500/10">
                <Plus className="w-4 h-4 stroke-[3]" /> Add Admin
              </Button>
            </div>

            {/* Admin Directory Table Grid */}
            <div className="overflow-x-auto w-full">
              <Table className="w-full text-left text-xs min-w-[650px] border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-[#1e293b]/30 hover:bg-transparent">
                    <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Name</TableHead>
                    <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Email</TableHead>
                    <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Role</TableHead>
                    <TableHead className="pb-3 text-slate-500 uppercase tracking-wider text-[9px] font-bold">Status</TableHead>
                    <TableHead className="pb-3 text-right text-slate-500 uppercase tracking-wider text-[9px] font-bold pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#1e293b]/10 font-medium">
                  {[
                    { id: 'admin-1', name: 'Admin User', email: 'admin@example.com', role: 'Super Admin', type: 'super', status: 'Active' },
                    { id: 'admin-2', name: 'Moderator User', email: 'mod@example.com', role: 'Moderator', type: 'mod', status: 'Active' },
                  ].map((admin) => (
                    <TableRow key={admin.id} className="border-none hover:bg-[#141b26]/30 transition-colors">
                      <TableCell className="py-4 text-white font-bold">{admin.name}</TableCell>
                      <TableCell className="py-4 text-slate-400">{admin.email}</TableCell>
                      <TableCell className="py-4">
                        <Badge className={`gap-1 pointer-events-none font-bold border ${
                          admin.type === 'super' 
                            ? 'bg-purple-950/40 border-purple-500/20 text-purple-400' 
                            : 'bg-slate-800/40 border-slate-700/40 text-slate-300'
                        }`}>
                          <Shield className="w-3 h-3" /> 
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/10 text-emerald-400">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          <span>{admin.status}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 text-slate-600 hover:text-white hover:bg-transparent p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
                            {/* Re-using edit-player context structure or handling dynamically */}
                            <DropdownMenuItem onClick={() => triggerModal("edit-player", admin)} className="focus:bg-[#1e293b] cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" /> Modify Clearance
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerModal("delete", admin)} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" /> Revoke Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================
            REPORTS PANEL
            ======================================================== */}
        <TabsContent value="reports" className="space-y-6 outline-none focus:outline-none">
          <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Reports & Ban Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">Handle toxic telemetry loops, anti-cheat signals, and ticket disputes.</p>
            </div>

            <div className="overflow-x-auto w-full">
              <Table className="w-full text-left text-xs min-w-[650px]">
                <TableHeader>
                  <TableRow className="border-b border-[#1e293b]/30 hover:bg-transparent">
                    <TableHead className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Reported User</TableHead>
                    <TableHead className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Violation</TableHead>
                    <TableHead className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Reported By</TableHead>
                    <TableHead className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Status</TableHead>
                    <TableHead className="text-right text-slate-500 uppercase tracking-wider text-[9px] font-bold pr-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#1e293b]/10">
                  <TableRow className="border-b-0 hover:bg-[#141b26]/30">
                    <TableCell className="py-4 text-white font-bold">Player2</TableCell>
                    <TableCell className="py-4 text-rose-400 font-semibold">Toxic Behavior</TableCell>
                    <TableCell className="py-4 text-slate-400">Player1</TableCell>
                    <TableCell className="py-4"><span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px]">● Pending</span></TableCell>
                    <TableCell className="py-4 text-right pr-2">
                      <div className="flex justify-end gap-2">
                        <Button variant="destructive" size="sm" className="bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-500/20 text-[10px] h-7 font-bold uppercase tracking-wider gap-1">
                          <Ban className="w-3 h-3" /> Ban
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;