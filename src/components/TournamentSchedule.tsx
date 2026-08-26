import { FormEvent, useState } from "react";
import { CalendarDays, Clock, MapPin, Pencil, Plus, Radio, Trash2, X } from "lucide-react";

type ScheduleItem = {
  id: string;
  stage: string;
  date: string;
  time: string;
  timezone: string;
  venue: string;
  status: "Draft" | "Published";
};

const initialSchedule: ScheduleItem[] = [
  { id: "registration", stage: "Registration closes", date: "2025-06-28", time: "23:59", timezone: "WAT", venue: "Online", status: "Published" },
  { id: "groups", stage: "Group stage", date: "2025-07-01", time: "14:00", timezone: "WAT", venue: "Online qualifiers", status: "Published" },
  { id: "final", stage: "Grand final", date: "2025-07-05", time: "18:00", timezone: "WAT", venue: "SCA Main Stage", status: "Published" },
];

const emptyItem = (): ScheduleItem => ({ id: "", stage: "", date: "", time: "", timezone: "WAT", venue: "", status: "Draft" });

const formatDate = (date: string) => date
  ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
  : "Date not set";

export default function ScheduleTab({ activeTab }: { activeTab: string }) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem>(emptyItem());

  if (activeTab !== "SCHEDULE") return null;

  const openCreate = () => {
    setEditingItem(emptyItem());
    setEditorOpen(true);
  };

  const openEdit = (item: ScheduleItem) => {
    setEditingItem({ ...item });
    setEditorOpen(true);
  };

  const saveSchedule = (event: FormEvent) => {
    event.preventDefault();
    if (!editingItem.stage.trim() || !editingItem.date || !editingItem.time || !editingItem.venue.trim()) return;
    if (editingItem.id) {
      setSchedule(current => current.map(item => item.id === editingItem.id ? editingItem : item));
    } else {
      setSchedule(current => [...current, { ...editingItem, id: `schedule-${Date.now()}` }]);
    }
    setEditorOpen(false);
  };

  const removeSchedule = (id: string) => setSchedule(current => current.filter(item => item.id !== id));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sca-eyebrow mb-2">Competition timeline</p>
          <h2 className="text-2xl font-semibold tracking-tight">Tournament schedule</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and maintain the dates published to players and spectators.</p>
        </div>
        <button onClick={openCreate} className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground transition-all hover:brightness-105">
          <Plus className="h-4 w-4" /> Add schedule item
        </button>
      </div>

      <div className="overflow-hidden rounded-sm border border-border bg-card">
        {schedule.length ? schedule.map((item, index) => (
          <div key={item.id} className="grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-[3rem_1.15fr_1fr_1fr_auto] md:items-center">
            <span className="text-sm font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-semibold text-foreground">{item.stage}</h3>
              <span className={`mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${item.status === "Published" ? "text-primary" : "text-muted-foreground"}`}>
                <Radio className="h-3 w-3" /> {item.status}
              </span>
            </div>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" />{formatDate(item.date)}<span aria-hidden="true">·</span><Clock className="h-4 w-4 text-primary" />{item.time} {item.timezone}</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{item.venue}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(item)} className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label={`Edit ${item.stage}`}><Pencil className="h-4 w-4" /></button>
              <button onClick={() => removeSchedule(item.id)} className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive" aria-label={`Delete ${item.stage}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        )) : (
          <div className="px-6 py-14 text-center"><CalendarDays className="mx-auto h-8 w-8 text-primary" /><h3 className="mt-4 font-semibold">No schedule items yet</h3><p className="mt-1 text-sm text-muted-foreground">Add the first milestone for this tournament.</p></div>
        )}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form onSubmit={saveSchedule} className="w-full max-w-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border bg-secondary/35 px-7 py-6">
              <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Competition timeline</p><h3 className="mt-1 text-2xl font-semibold text-foreground">{editingItem.id ? "Edit schedule item" : "Add schedule item"}</h3><p className="mt-1 text-sm text-muted-foreground">Set when and where this tournament milestone happens.</p></div>
              <button type="button" onClick={() => setEditorOpen(false)} className="p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Close schedule editor"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid gap-5 p-7 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Stage or milestone</span><input required value={editingItem.stage} onChange={event => setEditingItem({ ...editingItem, stage: event.target.value })} placeholder="e.g. Quarter finals" className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" /></label>
              <label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Date</span><input required type="date" value={editingItem.date} onChange={event => setEditingItem({ ...editingItem, date: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" /></label>
              <div className="grid grid-cols-[1fr_6rem] gap-3"><label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Time</span><input required type="time" value={editingItem.time} onChange={event => setEditingItem({ ...editingItem, time: event.target.value })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" /></label><label><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Zone</span><input value={editingItem.timezone} onChange={event => setEditingItem({ ...editingItem, timezone: event.target.value.toUpperCase() })} className="h-12 w-full border border-border bg-background px-3 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" /></label></div>
              <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Venue or channel</span><input required value={editingItem.venue} onChange={event => setEditingItem({ ...editingItem, venue: event.target.value })} placeholder="Online, Discord, or physical venue" className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" /></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Visibility</span><select value={editingItem.status} onChange={event => setEditingItem({ ...editingItem, status: event.target.value as ScheduleItem["status"] })} className="h-12 w-full border border-border bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"><option>Draft</option><option>Published</option></select></label>
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-7 py-5">
              <button type="button" onClick={() => setEditorOpen(false)} className="h-11 border border-border bg-background px-5 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:border-foreground hover:text-foreground">Cancel</button>
              <button type="submit" className="h-11 bg-primary px-6 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:brightness-105">{editingItem.id ? "Save changes" : "Add to schedule"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
