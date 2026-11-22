import { useCallback, useEffect, useState } from "react";
import { Award, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type AdminUser, type ApiAchievement } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const RARITIES = ["Common", "Rare", "Epic", "Legendary"] as const;
const CATEGORIES = ["Tournament", "League", "Performance", "Milestone", "Community", "Fair Play", "Team", "Coaching", "Special"];
const blank = { title: "", description: "", category: "Tournament", rarity: "Common", competition: "", team: "", role: "", awardSource: "", earnedOn: "" };
const fieldClass = "h-10 rounded-sm border-border bg-background";

// AchievementAwards lets staff issue and revoke a player's achievements.
// Players choose which of their awards their profile shows.
export default function AchievementAwards({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  const { toast } = useToast();
  const [awards, setAwards] = useState<ApiAchievement[]>([]);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const { achievements } = await api.get<{ achievements: ApiAchievement[] }>(`/admin/users/${user.id}/achievements`);
      setAwards(achievements);
    } catch (error) {
      toast({ title: "Could not load achievements", description: (error as Error).message, variant: "destructive" });
    }
  }, [user, toast]);
  useEffect(() => { setForm(blank); setAwards([]); load(); }, [load]);

  const award = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await api.post(`/admin/users/${user.id}/achievements`, form);
      toast({ title: `Awarded “${form.title}” to ${user.ign}` });
      setForm(blank);
      await load();
    } catch (error) {
      toast({ title: "Could not award", description: (error as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };
  const revoke = async (item: ApiAchievement) => {
    if (!window.confirm(`Revoke “${item.title}”? It disappears from the player's profile.`)) return;
    try { await api.delete(`/admin/achievements/${item.id}`); toast({ title: "Achievement revoked" }); await load(); }
    catch (error) { toast({ title: "Could not revoke", description: (error as Error).message, variant: "destructive" }); }
  };
  const set = (key: keyof typeof blank) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-sm border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>Achievements · {user?.ign}</DialogTitle>
          <DialogDescription>Awards are permanent records on the player's profile. The player chooses which ones to show and feature.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {awards.length ? awards.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 border border-border bg-background p-3">
              <div>
                <p className="text-sm font-semibold"><Award className="mr-1 inline h-4 w-4 text-primary" />{item.title} <span className="text-xs font-normal text-muted-foreground">· {item.rarity} · {item.category}</span></p>
                <p className="text-xs text-muted-foreground">{[item.competition, item.earnedOn, item.awardedBy].filter(Boolean).join(" · ")}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => revoke(item)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          )) : <p className="text-sm text-muted-foreground">No achievements yet.</p>}
        </div>
        <form onSubmit={award} className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><Label>Title</Label><Input required maxLength={120} value={form.title} onChange={set("title")} className={fieldClass} placeholder="Event Champion" /></label>
          <label className="sm:col-span-2"><Label>Description</Label><Textarea maxLength={500} value={form.description} onChange={set("description")} className="rounded-sm border-border bg-background" /></label>
          <label><Label>Category</Label><select value={form.category} onChange={set("category")} className={`${fieldClass} w-full border px-3 text-sm`}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><Label>Rarity</Label><select value={form.rarity} onChange={set("rarity")} className={`${fieldClass} w-full border px-3 text-sm`}>{RARITIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><Label>Competition</Label><Input maxLength={160} value={form.competition} onChange={set("competition")} className={fieldClass} /></label>
          <label><Label>Earned on</Label><Input type="date" value={form.earnedOn} onChange={set("earnedOn")} className={fieldClass} /></label>
          <label><Label>Team</Label><Input maxLength={120} value={form.team} onChange={set("team")} className={fieldClass} /></label>
          <label><Label>Award source</Label><Input maxLength={160} value={form.awardSource} onChange={set("awardSource")} className={fieldClass} placeholder="Verified final result" /></label>
          <div className="sm:col-span-2"><Button type="submit" disabled={busy || !form.title.trim()} className="h-10 rounded-sm bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground">Award achievement</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
