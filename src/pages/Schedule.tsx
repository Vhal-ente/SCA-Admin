import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Pencil, Plus, Radio, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api, type MasterEvent, type MasterSchedule } from "@/lib/api";

type Tab = "live" | "upcoming" | "past";
type MilestoneForm = { competition: string; stage: string; date: string; time: string; timezone: string; venue: string; status: "draft" | "published" };

const blankMilestone: MilestoneForm = { competition: "", stage: "", date: "", time: "", timezone: "WAT", venue: "", status: "published" };
const fieldClass = "h-10 rounded-sm border-border bg-background";
const chip = "border px-2 py-1 text-[9px] font-bold uppercase tracking-wider";
const label = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const day = (date: string) => (date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(`${date}T00:00:00`)) : "Date to be confirmed");
const base = (event: Pick<MasterEvent, "competitionKind" | "competitionId">) => `/admin/${event.competitionKind}s/${event.competitionId}`;

function EventCard({ event, onEdit, onDelete, onStream }: {
  event: MasterEvent; onEdit: () => void; onDelete: () => void; onStream: () => void;
}) {
  const scored = event.homeScore !== null && event.awayScore !== null;
  return (
    <article className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden border border-border bg-secondary">
          {event.bannerUrl && <img src={event.bannerUrl} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${chip} border-primary/40 text-primary`}>{event.game || label(event.competitionKind)}</span>
            <span className={`${chip} border-border text-muted-foreground`}>{event.competition}</span>
            <span className={`${chip} ${event.status === "live" ? "border-rose-500/40 text-rose-400" : event.status === "draft" ? "border-amber-500/30 text-amber-500" : "border-border text-muted-foreground"}`}>{event.kind === "milestone" ? (event.status === "draft" ? "Draft" : "Milestone") : label(event.status)}</span>
          </div>
          <h4 className="font-semibold text-foreground">{event.title}{scored && <span className="ml-2 font-mono text-primary">{event.homeScore} – {event.awayScore}</span>}</h4>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{day(event.date)}</span>
            {event.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time} {event.timezone}</span>}
            {event.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.venue}</span>}
            {event.detail && <span>{event.detail}</span>}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        {event.kind === "milestone" ? <>
          <Button variant="outline" size="icon" aria-label="Edit milestone" onClick={onEdit} className="h-9 w-9 rounded-sm"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="outline" size="icon" aria-label="Delete milestone" onClick={onDelete} className="h-9 w-9 rounded-sm text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
        </> : <Button variant="outline" onClick={onStream} className="h-9 gap-2 rounded-sm text-[11px] font-bold uppercase tracking-wider"><Radio className="h-3.5 w-3.5" />{event.streamUrl ? "Edit stream" : "Add stream"}</Button>}
      </div>
    </article>
  );
}

const Schedule = () => {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<MasterSchedule | null>(null);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [milestone, setMilestone] = useState<{ form: MilestoneForm; editing?: MasterEvent } | null>(null);
  const [stream, setStream] = useState<{ event: MasterEvent; url: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setSchedule(await api.get<MasterSchedule>("/admin/schedule")); }
    catch (error) { toast({ title: "Could not load the schedule", description: (error as Error).message, variant: "destructive" }); }
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  const run = async (request: () => Promise<unknown>, title: string) => {
    setBusy(true);
    try { await request(); toast({ title }); await load(); return true; }
    catch (error) { toast({ title: "Could not save", description: (error as Error).message, variant: "destructive" }); return false; }
    finally { setBusy(false); }
  };

  const openAdd = () => setMilestone({ form: { ...blankMilestone, competition: schedule?.competitions[0] ? `${schedule.competitions[0].kind}:${schedule.competitions[0].id}` : "" } });
  const openEdit = (event: MasterEvent) => setMilestone({
    editing: event,
    form: { competition: `${event.competitionKind}:${event.competitionId}`, stage: event.title, date: event.date, time: event.time, timezone: event.timezone || "WAT", venue: event.venue, status: event.status === "draft" ? "draft" : "published" },
  });
  const saveMilestone = async (submit: React.FormEvent) => {
    submit.preventDefault();
    if (!milestone) return;
    const { form, editing } = milestone;
    const [competitionKind, competitionId] = form.competition.split(":") as [MasterEvent["competitionKind"], string];
    const body = { stage: form.stage, date: form.date, time: form.time, timezone: form.timezone, venue: form.venue, status: form.status };
    const saved = editing
      ? await run(() => api.put(`${base(editing)}/schedule/${editing.id}`, body), "Milestone updated")
      : await run(() => api.post(`${base({ competitionKind, competitionId })}/schedule`, body), "Milestone added");
    if (saved) setMilestone(null);
  };
  const remove = (event: MasterEvent) => window.confirm(`Delete “${event.title}” from ${event.competition}?`)
    && run(() => api.delete(`${base(event)}/schedule/${event.id}`), "Milestone deleted");
  const saveStream = async (submit: React.FormEvent) => {
    submit.preventDefault();
    if (!stream) return;
    if (await run(() => api.patch(`${base(stream.event)}/fixtures/${stream.event.id}`, { streamUrl: stream.url.trim() }), "Stream link saved")) setStream(null);
  };

  const events = schedule ? schedule[tab] : [];
  const counts = { live: schedule?.live.length ?? 0, upcoming: schedule?.upcoming.length ?? 0, past: schedule?.past.length ?? 0 };
  const setField = (key: keyof MilestoneForm) => (change: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setMilestone((current) => current && { ...current, form: { ...current.form, [key]: change.target.value } });

  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8 xl:p-10">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-primary">Platform operations</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Master Schedule</h1>
          <p className="mt-3 text-muted-foreground">Every tournament and league milestone and fixture in one place.</p>
        </div>
        <Button onClick={openAdd} disabled={!schedule?.competitions.length} className="gap-2"><Plus className="h-4 w-4" />Add milestone</Button>
      </div>

      <div className="mx-auto mt-7 max-w-[1500px] space-y-6">
        <div className="grid grid-cols-3 gap-1 rounded-sm border border-border bg-card p-1">
          {(["live", "upcoming", "past"] as const).map((name) => (
            <button key={name} onClick={() => setTab(name)} className={`h-11 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${tab === name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {name} <span className="ml-1 font-mono">{counts[name]}</span>
            </button>
          ))}
        </div>
        {!schedule ? <p className="text-sm text-muted-foreground">Loading schedule…</p>
          : events.length ? <div className="grid gap-3">{events.map((event) => (
            <EventCard key={`${event.kind}-${event.id}`} event={event} onEdit={() => openEdit(event)} onDelete={() => remove(event)} onStream={() => setStream({ event, url: event.streamUrl })} />
          ))}</div>
            : <div className="rounded-sm border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              {tab === "live" ? "No matches are live right now. Matches show here when their status is set to live." : tab === "upcoming" ? "Nothing scheduled yet. Add a milestone, or schedule fixtures from a competition's workspace." : "No past events yet."}
            </div>}
      </div>

      <Dialog open={Boolean(milestone)} onOpenChange={(open) => !open && setMilestone(null)}>
        <DialogContent className="rounded-sm border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>{milestone?.editing ? "Edit milestone" : "Add milestone"}</DialogTitle>
            <DialogDescription>Milestones appear on the competition's public schedule once published.</DialogDescription>
          </DialogHeader>
          {milestone && <form onSubmit={saveMilestone} className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2"><Label>Competition</Label>
              <select value={milestone.form.competition} onChange={setField("competition")} disabled={Boolean(milestone.editing)} required className={`${fieldClass} w-full border px-3 text-sm`}>
                {schedule?.competitions.map((item) => <option key={item.id} value={`${item.kind}:${item.id}`}>{item.name} · {label(item.kind)}</option>)}
                {milestone.editing && !schedule?.competitions.some((item) => `${item.kind}:${item.id}` === milestone.form.competition) && <option value={milestone.form.competition}>{milestone.editing.competition}</option>}
              </select>
            </label>
            <label className="sm:col-span-2"><Label>Stage or milestone</Label><Input required maxLength={120} value={milestone.form.stage} onChange={setField("stage")} placeholder="Group stage begins" className={fieldClass} /></label>
            <label><Label>Date</Label><Input required type="date" value={milestone.form.date} onChange={setField("date")} className={fieldClass} /></label>
            <label><Label>Time</Label><Input type="time" value={milestone.form.time} onChange={setField("time")} className={fieldClass} /></label>
            <label><Label>Time zone</Label><Input maxLength={20} value={milestone.form.timezone} onChange={setField("timezone")} className={fieldClass} /></label>
            <label><Label>Status</Label><select value={milestone.form.status} onChange={setField("status")} className={`${fieldClass} w-full border px-3 text-sm`}><option value="published">Published</option><option value="draft">Draft</option></select></label>
            <label className="sm:col-span-2"><Label>Venue</Label><Input maxLength={120} value={milestone.form.venue} onChange={setField("venue")} placeholder="Online" className={fieldClass} /></label>
            <div className="sm:col-span-2"><Button type="submit" disabled={busy} className="h-10 rounded-sm">{milestone.editing ? "Save changes" : "Add milestone"}</Button></div>
          </form>}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(stream)} onOpenChange={(open) => !open && setStream(null)}>
        <DialogContent className="rounded-sm border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Stream link</DialogTitle>
            <DialogDescription>{stream?.event.title} · {stream?.event.competition}. Players see this on the fixture and their dashboard.</DialogDescription>
          </DialogHeader>
          {stream && <form onSubmit={saveStream} className="space-y-3">
            <Input type="url" value={stream.url} onChange={(change) => setStream({ ...stream, url: change.target.value })} placeholder="https://twitch.tv/sca" className={fieldClass} />
            <div className="flex gap-2">
              <Button type="submit" disabled={busy} className="h-10 rounded-sm">Save link</Button>
              {stream.event.streamUrl && <Button type="button" variant="outline" disabled={busy} onClick={() => setStream({ ...stream, url: "" })} className="h-10 rounded-sm">Clear</Button>}
            </div>
          </form>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
