import { useState } from "react";
import { 
  Users, CheckCircle2, Clock, XCircle, Trash2, 
  Search, Plus, X, Save, Shield, UserPlus, Sliders, Upload 
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  tag: string;
  members: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  logoUrl?: string; // Appended to store image preview base64 or URL pointers
}

export const TeamsTab = ({ activeTab }: { activeTab: string }) => {
  
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Sentinels Alpha", tag: "SEN", members: 5, status: "Approved", date: "2026-06-01" },
    { id: "2", name: "Natus Vincere", tag: "NAVI", members: 5, status: "Pending", date: "2026-06-05" },
    { id: "3", name: "Fnatic Rising", tag: "FNC", members: 6, status: "Approved", date: "2026-05-28" },
    { id: "4", name: "T1 Academy", tag: "T1", members: 5, status: "Rejected", date: "2026-05-20" },
  ]);

  // Interactivity Visibility State Engine Hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Form Configuration Targeting Hooks
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({ 
    name: "", 
    tag: "", 
    members: 5, 
    status: "Pending" as Team["status"],
    logoUrl: "" 
  });
  
  if (activeTab !== "TEAMS") return null;

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
    
    const teamRecord: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      tag: newTeam.tag.toUpperCase(),
      members: Number(newTeam.members),
      status: newTeam.status,
      date: new Date().toISOString().split("T")[0],
      logoUrl: newTeam.logoUrl || undefined
    };

    setTeams([...teams, teamRecord]);
    setNewTeam({ name: "", tag: "", members: 5, status: "Pending", logoUrl: "" });
    setIsAddModalOpen(false);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ─── ACTION HEADER CONTROLS BAR ─── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0f141c] p-4 rounded-xl border border-[#2a2e42]">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registered teams..." 
            className="w-full bg-[#1b1e2b] text-sm text-white pl-9 pr-4 py-2 rounded-lg border border-[#2a2e42] focus:border-[#00FFC6] outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00FFC6] text-[#003b2f] text-sm font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,198,0.15)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Team
        </button>
      </div>

      {/* ─── TEAM PARTICIPANTS GRID GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-[#0f141c] border border-[#2a2e42] p-5 rounded-xl hover:border-[#00FFC6]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                {/* Image Avatar Container Frame */}
                {team.logoUrl ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#2a2e42] bg-[#141923] flex items-center justify-center group-hover:border-[#00FFC6]/40 transition-all">
                    <img src={team.logoUrl} alt={`${team.name} Logo`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#222532] flex items-center justify-center font-black text-sm text-[#00FFC6] border border-[#2a2e42] group-hover:border-[#00FFC6]/30 transition-all">
                    {team.tag}
                  </div>
                )}
                
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
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

              <h4 className="text-base font-bold text-white mb-1 truncate">{team.name}</h4>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-[#2a2e42]/60">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#00FFC6]" /> {team.members} Players</span>
                <span>Reg: {new Date(team.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* ACTION TRIGGERS AREA */}
            <div className="mt-5 pt-3 border-t border-[#2a2e42]/40 flex gap-2">
              <button 
                onClick={() => { setSelectedTeam(team); setIsManageDrawerOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1b1e2b] text-xs font-bold text-slate-200 border border-[#2a2e42] rounded-lg hover:text-[#00FFC6] hover:border-[#00FFC6]/40 hover:bg-[#222637] transition-all"
              >
                <Sliders className="w-3.5 h-3.5" /> Manage Team
              </button>
              <button 
                onClick={() => { setSelectedTeam(team); setIsDeleteAlertOpen(true); }}
                className="p-2 bg-rose-950/10 text-rose-400 border border-rose-900/30 rounded-lg hover:bg-rose-900/30 hover:text-rose-300 transition-colors"
                title="Remove Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MODAL DIALOG: ADD NEW TEAM REGISTER ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f141c] border border-[#2a2e42] w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#2a2e42] flex justify-between items-center bg-[#141923]">
              <div className="flex items-center gap-2 text-white">
                <UserPlus className="w-5 h-5 text-[#00FFC6]" />
                <h3 className="font-bold text-lg">Add New Tournament Team</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddTeamSubmit} className="p-6 space-y-4">
              {/* Image Upload Row */}
              <div className="flex items-center gap-4 bg-[#141923] p-3 rounded-lg border border-[#2a2e42]">
                <div className="w-16 h-16 rounded-lg bg-[#222532] border border-[#2a2e42] flex items-center justify-center overflow-hidden">
                  {newTeam.logoUrl ? (
                    <img src={newTeam.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-slate-500 uppercase">{newTeam.tag || "LOGO"}</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Team Insignia / Brand</label>
                  <button
                    type="button"
                    onClick={() => document.getElementById("create-logo-upload")?.click()}
                    className="flex items-center gap-2 text-xs font-bold px-3 py-2 bg-[#1b1e2b] border border-[#2a2e42] text-slate-200 rounded hover:text-[#00FFC6] hover:border-[#00FFC6]/40 transition-all"
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

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Team Name</label>
                <input 
                  required
                  placeholder="e.g. Sentinels Alpha"
                  value={newTeam.name}
                  onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Abbreviation Tag</label>
                  <input 
                    required
                    maxLength={4}
                    placeholder="SEN"
                    value={newTeam.tag}
                    onChange={e => setNewTeam({...newTeam, tag: e.target.value.toUpperCase()})}
                    className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none transition-all uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Active Players</label>
                  <input 
                    type="number"
                    min={1}
                    value={newTeam.members}
                    onChange={e => setNewTeam({...newTeam, members: parseInt(e.target.value) || 5})}
                    className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registration Status</label>
                <select 
                  value={newTeam.status}
                  onChange={e => setNewTeam({...newTeam, status: e.target.value as any})}
                  className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none transition-all"
                >
                  <option value="Pending">Pending Audit</option>
                  <option value="Approved">Approved / Qualified</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#2a2e42]/60 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#00FFC6] text-[#003b2f] text-sm font-bold rounded-lg hover:brightness-110 transition-all">Register Team</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SLIDE DRAWER: ROSTER CONFIGURATION MANAGEMENT ─── */}
      {isManageDrawerOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-[#0f141c] border-l border-[#2a2e42] w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="px-6 py-5 border-b border-[#2a2e42] flex justify-between items-center bg-[#141923]">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#00FFC6]" />
                  <h3 className="font-bold text-lg text-white">Manage Team</h3>
                </div>
                <button onClick={() => setIsManageDrawerOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* Updatable Roster Image Layout Segment */}
                <div className="flex items-center gap-4 bg-[#141923] p-4 rounded-xl border border-[#2a2e42]">
                  <div className="w-20 h-20 rounded-xl bg-[#222532] border border-[#2a2e42] flex items-center justify-center overflow-hidden">
                    {selectedTeam.logoUrl ? (
                      <img src={selectedTeam.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-black text-slate-500 uppercase">{selectedTeam.tag}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Change Team Emblem</label>
                    <button
                      type="button"
                      onClick={() => document.getElementById("update-logo-upload")?.click()}
                      className="flex items-center gap-2 text-xs font-bold px-3 py-2 bg-[#1b1e2b] border border-[#2a2e42] text-slate-200 rounded hover:text-[#00FFC6] hover:border-[#00FFC6]/40 transition-all"
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tournament Team Name</label>
                  <input 
                    value={selectedTeam.name}
                    onChange={e => setSelectedTeam({...selectedTeam, name: e.target.value})}
                    className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tag Signature</label>
                    <input 
                      maxLength={4}
                      value={selectedTeam.tag}
                      onChange={e => setSelectedTeam({...selectedTeam, tag: e.target.value.toUpperCase()})}
                      className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Member Seed</label>
                    <input 
                      type="number"
                      value={selectedTeam.members}
                      onChange={e => setSelectedTeam({...selectedTeam, members: parseInt(e.target.value) || 0})}
                      className="w-full bg-[#1b1e2b] border border-[#2a2e42] text-sm text-white px-4 py-2.5 rounded-lg focus:border-[#00FFC6] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Validation Matrix Placement</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Approved", "Pending", "Rejected"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedTeam({...selectedTeam, status: st})}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          selectedTeam.status === st 
                            ? st === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40" :
                              st === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/40" :
                              "bg-rose-500/10 text-rose-400 border-rose-500/40"
                            : "bg-[#1b1e2b] border-[#2a2e42] text-slate-400"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#2a2e42] bg-[#141923] flex gap-3">
              <button onClick={() => setIsManageDrawerOpen(false)} className="flex-1 py-2.5 bg-[#222532] text-slate-300 rounded-lg text-sm font-semibold hover:text-white transition-colors">Discard</button>
              <button onClick={handleUpdateTeamSave} className="flex-1 py-2.5 bg-[#00FFC6] text-[#003b2f] rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all">
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