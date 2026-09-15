import { useState } from "react";
import { ExternalLink, Plus, Radio, Save, Trash2, Youtube } from "lucide-react";
import type { WatchLinks } from "@/lib/api";

interface WatchTabProps {
  activeTab: string;
  entityLabel: string;
  links: WatchLinks;
  onChange: (links: WatchLinks) => void;
  // Absent until the competition has been saved once.
  onSave?: (links: WatchLinks) => Promise<void>;
}

export default function WatchTab({ activeTab, entityLabel, links, onChange, onSave }: WatchTabProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (activeTab !== "WATCH") return null;

  const update = (next: WatchLinks) => {
    setMessage(null);
    onChange(next);
  };

  const updateReplay = (index: number, field: "title" | "url", value: string) =>
    update({ ...links, replays: links.replays.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) });

  const addReplay = () => update({ ...links, replays: [...links.replays, { title: "", url: "" }] });

  const removeReplay = (index: number) =>
    update({ ...links, replays: links.replays.filter((_, itemIndex) => itemIndex !== index) });

  const saveWatchLinks = async () => {
    if (!onSave) return;
    // Rows left completely blank are dropped rather than rejected.
    const cleaned: WatchLinks = {
      youtube: links.youtube.trim(),
      twitch: links.twitch.trim(),
      replays: links.replays
        .map((item) => ({ title: item.title.trim(), url: item.url.trim() }))
        .filter((item) => item.title || item.url),
    };
    setSaving(true);
    try {
      await onSave(cleaned);
      onChange(cleaned);
      setMessage({ text: `Saved. These links now show on the ${entityLabel.toLowerCase()}'s Watch page.` });
    } catch (error) {
      setMessage({ text: (error as Error).message, error: true });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sca-eyebrow mb-2">Live & replay</p>
          <h2 className="text-2xl font-semibold tracking-tight">Watch links</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage the broadcast and match-video links displayed on the {entityLabel.toLowerCase()} frontend.</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <button onClick={saveWatchLinks} disabled={!onSave || saving} className="flex h-10 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save links"}
          </button>
          {!onSave && <p className="text-xs text-muted-foreground">Save the {entityLabel.toLowerCase()} first, then add its watch links.</p>}
          {message && <p role="status" className={`max-w-sm text-right text-xs ${message.error ? "text-destructive" : "text-muted-foreground"}`}>{message.text}</p>}
        </div>
      </div>

      <section className="rounded-sm border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <Radio className="h-5 w-5 text-primary" />
          <div><h3 className="font-semibold">Participant streams</h3><p className="text-xs text-muted-foreground">Approved live broadcasts shown in the Watch section.</p></div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">YouTube live URL</span><div className="relative"><Youtube className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input value={links.youtube} onChange={(event) => update({ ...links, youtube: event.target.value })} placeholder="https://youtube.com/live/..." className={`${inputClass} pl-11`} /></div></label>
          <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Twitch / Streamlabs URL</span><div className="relative"><Radio className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input value={links.twitch} onChange={(event) => update({ ...links, twitch: event.target.value })} placeholder="https://twitch.tv/..." className={`${inputClass} pl-11`} /></div></label>
        </div>
      </section>

      <section className="rounded-sm border border-border bg-card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><p className="sca-eyebrow mb-1">{entityLabel} clips</p><h3 className="text-xl font-semibold">Match YouTube videos</h3></div>
          <button onClick={addReplay} className="flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary"><Plus className="h-4 w-4" /> Add video</button>
        </div>
        <div className="space-y-3">
          {links.replays.map((replay, index) => (
            <div key={index} className="grid gap-3 rounded-sm border border-border bg-secondary p-4 md:grid-cols-[1fr_1.4fr_auto]">
              <input value={replay.title} onChange={(event) => updateReplay(index, "title", event.target.value)} placeholder="Match or clip title" className={inputClass} />
              <div className="relative"><ExternalLink className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input value={replay.url} onChange={(event) => updateReplay(index, "url", event.target.value)} placeholder="https://youtube.com/watch?v=..." className={`${inputClass} pl-11`} /></div>
              <button aria-label="Remove video" onClick={() => removeReplay(index)} className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {!links.replays.length && <p className="py-4 text-center text-sm text-muted-foreground">No videos yet.</p>}
        </div>
      </section>
    </div>
  );
}
