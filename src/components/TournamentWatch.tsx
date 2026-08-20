import { useState } from "react";
import { ExternalLink, Plus, Radio, Save, Trash2, Youtube } from "lucide-react";

interface ReplayLink {
  id: number;
  title: string;
  url: string;
}

export default function WatchTab({ activeTab }: { activeTab: string }) {
  const [youtubeLive, setYoutubeLive] = useState("");
  const [twitchLive, setTwitchLive] = useState("");
  const [replays, setReplays] = useState<ReplayLink[]>([
    { id: 1, title: "Warzone Open — Best Plays", url: "https://youtube.com/watch?v=" },
  ]);
  const [saved, setSaved] = useState(false);

  if (activeTab !== "WATCH") return null;

  const updateReplay = (id: number, field: "title" | "url", value: string) => {
    setSaved(false);
    setReplays((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addReplay = () => {
    setSaved(false);
    setReplays((items) => [...items, { id: Date.now(), title: "", url: "" }]);
  };

  const saveWatchLinks = () => {
    localStorage.setItem("sca-tournament-watch-links", JSON.stringify({ youtubeLive, twitchLive, replays }));
    setSaved(true);
  };

  const inputClass = "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sca-eyebrow mb-2">Live & replay</p>
          <h2 className="text-2xl font-semibold tracking-tight">Watch links</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage the broadcast and match-video links displayed on the tournament frontend.</p>
        </div>
        <button onClick={saveWatchLinks} className="flex h-10 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" /> {saved ? "Saved" : "Save links"}
        </button>
      </div>

      <section className="rounded-sm border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <Radio className="h-5 w-5 text-primary" />
          <div><h3 className="font-semibold">Participant streams</h3><p className="text-xs text-muted-foreground">Approved live broadcasts shown in the Watch section.</p></div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">YouTube live URL</span><div className="relative"><Youtube className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input value={youtubeLive} onChange={(event) => { setYoutubeLive(event.target.value); setSaved(false); }} placeholder="https://youtube.com/live/..." className={`${inputClass} pl-11`} /></div></label>
          <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Twitch / Streamlabs URL</span><div className="relative"><Radio className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input value={twitchLive} onChange={(event) => { setTwitchLive(event.target.value); setSaved(false); }} placeholder="https://twitch.tv/..." className={`${inputClass} pl-11`} /></div></label>
        </div>
      </section>

      <section className="rounded-sm border border-border bg-card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><p className="sca-eyebrow mb-1">Tournament clips</p><h3 className="text-xl font-semibold">Match YouTube videos</h3></div>
          <button onClick={addReplay} className="flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary"><Plus className="h-4 w-4" /> Add video</button>
        </div>
        <div className="space-y-3">
          {replays.map((replay) => (
            <div key={replay.id} className="grid gap-3 rounded-sm border border-border bg-secondary p-4 md:grid-cols-[1fr_1.4fr_auto]">
              <input value={replay.title} onChange={(event) => updateReplay(replay.id, "title", event.target.value)} placeholder="Match or clip title" className={inputClass} />
              <div className="relative"><ExternalLink className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><input value={replay.url} onChange={(event) => updateReplay(replay.id, "url", event.target.value)} placeholder="https://youtube.com/watch?v=..." className={`${inputClass} pl-11`} /></div>
              <button aria-label="Remove video" onClick={() => setReplays((items) => items.filter((item) => item.id !== replay.id))} className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
