import { useState } from "react";
import { ShieldAlert, EyeOff, Save, Search, ShieldCheck, UserPlus, X } from "lucide-react";

type StaffRole = "Administrator" | "Moderator";
type TournamentStaff = { id: number; name: string; email: string; role: StaffRole };

const staffDirectory: Omit<TournamentStaff, "role">[] = [
  { id: 1, name: "Goodness Adebola", email: "goodness@sca.gg" },
  { id: 2, name: "Mighty Ness", email: "mightyness@sca.gg" },
  { id: 3, name: "Maja Okafor", email: "maja@sca.gg" },
  { id: 4, name: "Misha Bello", email: "misha@sca.gg" },
  { id: 5, name: "Von Adebayo", email: "von@sca.gg" },
];

export default function SettingsTab({ activeTab }: { activeTab: string }) {
  const [publicView, setPublicView] = useState(true);
  const [staff, setStaff] = useState<TournamentStaff[]>([
    { ...staffDirectory[0], role: "Administrator" },
    { ...staffDirectory[2], role: "Moderator" },
  ]);
  const [staffSearch, setStaffSearch] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>("Moderator");

  if (activeTab !== "SETTINGS") return null;

  const availableStaff = staffDirectory.filter(person =>
    !staff.some(member => member.id === person.id) &&
    `${person.name} ${person.email}`.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const addStaff = (person: Omit<TournamentStaff, "role">) => {
    setStaff(current => [...current, { ...person, role: newStaffRole }]);
    setStaffSearch("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div><p className="sca-eyebrow mb-2">Configuration</p><h2 className="text-2xl font-semibold tracking-tight">Tournament settings</h2><p className="mt-1 text-sm text-muted-foreground">Control visibility and tournament lifecycle actions.</p></div>
      {/* Visibility Block */}
      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-semibold text-xl mb-1 text-foreground">General Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">Configure who can view the public tournament experience.</p>

        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <label className="text-sm font-bold text-foreground block mb-1">Public Bracket Visibility</label>
              <span className="text-xs text-slate-400">Allow anonymous guest users to inspect brackets, schedules, and matches.</span>
            </div>
            <input 
              type="checkbox" 
              checked={publicView} 
              onChange={() => setPublicView(!publicView)}
              className="w-4 h-4 mt-1 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Tournament staff */}
      <div className="rounded-sm border border-border bg-card">
        <div className="flex flex-col gap-5 border-b border-border p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="sca-eyebrow mb-2">Tournament team</p>
            <h3 className="text-xl font-semibold text-foreground">Admins &amp; moderators</h3>
            <p className="mt-1 text-sm text-muted-foreground">Assign staff who can operate this tournament and review participant activity.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={staffSearch} onChange={event => setStaffSearch(event.target.value)} placeholder="Search staff by name or email" className="h-11 w-full rounded-sm border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" />
              {staffSearch && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 max-h-56 overflow-y-auto border border-border bg-popover shadow-xl">
                  {availableStaff.length ? availableStaff.map(person => (
                    <button key={person.id} type="button" onClick={() => addStaff(person)} className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left last:border-0 hover:bg-secondary">
                      <span><span className="block text-sm font-semibold text-foreground">{person.name}</span><span className="block text-xs text-muted-foreground">{person.email}</span></span>
                      <UserPlus className="h-4 w-4 text-primary" />
                    </button>
                  )) : <p className="px-4 py-4 text-sm text-muted-foreground">No available staff found.</p>}
                </div>
              )}
            </div>
            <select value={newStaffRole} onChange={event => setNewStaffRole(event.target.value as StaffRole)} className="theme-native-select h-11 rounded-sm border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none focus:border-primary">
              <option>Moderator</option>
              <option>Administrator</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          {staff.map(member => (
            <article key={member.id} className="border border-border bg-background p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-sm font-black text-primary">
                  {member.name.split(" ").map(part => part[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><h4 className="truncate text-sm font-bold text-foreground">{member.name}</h4><p className="truncate text-xs text-muted-foreground">{member.email}</p></div>
                    <button type="button" aria-label={`Remove ${member.name}`} onClick={() => setStaff(current => current.filter(item => item.id !== member.id))} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <select value={member.role} onChange={event => setStaff(current => current.map(item => item.id === member.id ? { ...item, role: event.target.value as StaffRole } : item))} className="theme-native-select min-w-0 flex-1 bg-background text-xs font-bold uppercase tracking-wide text-foreground outline-none">
                      <option>Administrator</option><option>Moderator</option>
                    </select>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {!staff.length && <div className="col-span-full border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No tournament staff assigned yet.</div>}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/30 rounded-sm p-6">
        <div className="flex items-center gap-2 text-rose-400 mb-2">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-bold text-lg">Danger Zone</h3>
        </div>
        <p className="text-xs text-rose-300/70 mb-4">Actions here are permanent and cannot be reversed under any circumstance.</p>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-rose-950/20 rounded-lg border border-rose-900/30 gap-4">
          <div>
            <p className="text-sm font-bold text-rose-200">Archive this Tournament</p>
            <p className="text-xs text-rose-400/80">Freeze all mutations, match schedules, and roster adjustments.</p>
          </div>
          <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-900/40 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded border border-rose-700/40 transition-colors">
            <EyeOff className="w-3.5 h-3.5" /> Archive
          </button>
        </div>
      </div>

      {/* Footer Update Row */}
      <div className="flex justify-end gap-3 pt-2">
        <button className="px-5 py-2.5 border border-border bg-card text-muted-foreground hover:text-foreground text-sm font-bold rounded-sm transition-colors">
          Reset to Default
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
