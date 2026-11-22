import { useCallback, useEffect, useState } from "react";
import { ExternalLink, EyeOff, Flag, RotateCcw, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api, type ApiLoadout, type ApiModeratedPost, type ApiModerationReport } from "@/lib/api";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
const when = (iso: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(iso));
const label = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const chip = "border px-2 py-1 text-[9px] font-bold uppercase";
const action = "h-9 rounded-sm text-[11px] font-bold uppercase tracking-wider";

function SiteLink({ path, children }: { path: string; children: React.ReactNode }) {
  if (!SITE_URL) return <>{children}</>;
  return <a href={`${SITE_URL}${path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">{children}<ExternalLink className="h-3 w-3" /></a>;
}

function ReportList({ reports, busyId, onStatus, subjectPath }: {
  reports: ApiModerationReport[]; busyId: string;
  onStatus: (report: ApiModerationReport, status: ApiModerationReport["status"]) => void;
  subjectPath: (report: ApiModerationReport) => string;
}) {
  if (!reports.length) return <p className="text-sm text-muted-foreground">No reports.</p>;
  return <div className="grid gap-3">{reports.map((report) => {
    const open = report.status === "open" || report.status === "reviewing";
    return <article key={report.id} className={`border border-border bg-background p-4 ${open ? "" : "opacity-70"}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${chip} border-border text-muted-foreground`}>{report.reason}</span>
            <span className={`${chip} ${open ? "border-amber-500/30 text-amber-500" : "border-emerald-500/30 text-emerald-500"}`}>{label(report.status)}</span>
          </div>
          <h4 className="mt-2 font-semibold text-foreground"><SiteLink path={subjectPath(report)}>{report.subject || "Removed listing"}</SiteLink></h4>
          {report.details && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{report.details}</p>}
          <p className="mt-2 text-xs text-muted-foreground">{report.subjectBy && <>By {report.subjectBy} · </>}Reported by {report.reporter?.ign || "a player"} · {when(report.createdAt)}</p>
        </div>
        {open ? <div className="flex flex-wrap gap-2">
          {report.status === "open" && <Button variant="outline" disabled={busyId === report.id} onClick={() => onStatus(report, "reviewing")} className={action}>Start review</Button>}
          <Button variant="outline" disabled={busyId === report.id} onClick={() => onStatus(report, "dismissed")} className={action}>Dismiss</Button>
          <Button disabled={busyId === report.id} onClick={() => onStatus(report, "resolved")} className={`${action} bg-primary text-primary-foreground`}>Resolved</Button>
        </div> : <Button variant="outline" disabled={busyId === report.id} onClick={() => onStatus(report, "open")} className={action}>Reopen</Button>}
      </div>
    </article>;
  })}</div>;
}

// CommunityDesk moderates player-made content: recruitment posts and loadouts,
// and the reports players file about them.
export default function CommunityDesk() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<ApiModeratedPost[]>([]);
  const [postReports, setPostReports] = useState<ApiModerationReport[]>([]);
  const [loadouts, setLoadouts] = useState<ApiLoadout[]>([]);
  const [loadoutReports, setLoadoutReports] = useState<ApiModerationReport[]>([]);
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [a, b, c, d] = await Promise.all([
        api.get<{ posts: ApiModeratedPost[] }>("/admin/recruitment"),
        api.get<{ reports: ApiModerationReport[] }>("/admin/recruitment-reports"),
        api.get<{ loadouts: ApiLoadout[] }>("/admin/loadouts"),
        api.get<{ reports: ApiModerationReport[] }>("/admin/loadout-reports"),
      ]);
      setPosts(a.posts); setPostReports(b.reports); setLoadouts(c.loadouts); setLoadoutReports(d.reports);
    } catch (error) {
      toast({ title: "Could not load community content", description: (error as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  const run = async (id: string, request: () => Promise<unknown>, title: string) => {
    setBusyId(id);
    try { await request(); toast({ title }); await load(); }
    catch (error) { toast({ title: "Could not update", description: (error as Error).message, variant: "destructive" }); }
    finally { setBusyId(""); }
  };

  const setPostStatus = (post: ApiModeratedPost, status: "open" | "closed") =>
    run(post.id, () => api.patch(`/admin/recruitment/${post.id}`, { status }), status === "closed" ? "Listing closed" : "Listing reopened");
  const removePost = (post: ApiModeratedPost) => window.confirm(`Remove “${post.title}”? Applicants keep their history.`)
    && run(post.id, () => api.delete(`/admin/recruitment/${post.id}`), "Listing removed");
  const moderateLoadout = (loadout: ApiLoadout, status: "published" | "hidden" | "removed") => {
    const reason = status === "removed" ? window.prompt("Why is this loadout being removed? The author sees this.")?.trim() : "";
    if (status === "removed" && !reason) return;
    run(loadout.id, () => api.patch(`/admin/loadouts/${loadout.id}`, { status, reason }), `Loadout ${status === "published" ? "restored" : status}`);
  };
  const feature = (loadout: ApiLoadout) =>
    run(loadout.id, () => api.patch(`/admin/loadouts/${loadout.id}`, { featured: !loadout.featured }), loadout.featured ? "No longer featured" : "Featured");
  const resolve = (path: string) => (report: ApiModerationReport, status: ApiModerationReport["status"]) =>
    run(report.id, () => api.patch(`/admin/${path}/${report.id}`, { status }), `Report ${label(status).toLowerCase()}`);

  const card = "flex flex-col space-y-5 rounded-sm border border-border bg-card p-6";
  return <div className="space-y-6">
    <section className={card}>
      <div><p className="sca-eyebrow mb-2">Community</p><h3 className="text-2xl font-semibold tracking-tight text-foreground">Recruitment listings</h3><p className="mt-1 text-sm text-muted-foreground">Close or remove listings that break the rules without interfering with legitimate team decisions.</p></div>
      {!posts.length && <p className="text-sm text-muted-foreground">{loading ? "Loading listings…" : "No recruitment listings yet."}</p>}
      <div className="grid gap-3">{posts.map((post) => <article key={post.id} className="flex flex-col gap-3 border border-border bg-background p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2"><span className={`${chip} border-border text-muted-foreground`}>{post.game || "Any game"} · {post.recruitmentFor}</span><span className={`${chip} ${post.status === "open" ? "border-emerald-500/30 text-emerald-500" : "border-border text-muted-foreground"}`}>{label(post.status)}</span>{post.openReports > 0 && <span className={`${chip} border-amber-500/30 text-amber-500`}><Flag className="mr-1 inline h-3 w-3" />{post.openReports} report{post.openReports === 1 ? "" : "s"}</span>}</div>
          <h4 className="mt-2 font-semibold text-foreground"><SiteLink path={`/recruitment/${post.id}`}>{post.title}</SiteLink></h4>
          <p className="text-xs text-muted-foreground">{post.teamName} · {post.applicationCount} application{post.applicationCount === 1 ? "" : "s"} · {post.openSlots} open · {when(post.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.status === "open" ? <Button variant="outline" disabled={busyId === post.id} onClick={() => setPostStatus(post, "closed")} className={action}>Close</Button>
            : post.status === "closed" && <Button variant="outline" disabled={busyId === post.id} onClick={() => setPostStatus(post, "open")} className={action}><RotateCcw className="mr-1 h-3 w-3" />Reopen</Button>}
          <Button variant="outline" disabled={busyId === post.id} onClick={() => removePost(post)} className={`${action} border-destructive/30 text-destructive`}><Trash2 className="mr-1 h-3 w-3" />Remove</Button>
        </div>
      </article>)}</div>
      <div><h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Listing reports</h4><ReportList reports={postReports} busyId={busyId} onStatus={resolve("recruitment-reports")} subjectPath={(report) => `/recruitment/${report.subjectSlug}`} /></div>
    </section>

    <section className={card}>
      <div><p className="sca-eyebrow mb-2">Community</p><h3 className="text-2xl font-semibold tracking-tight text-foreground">Loadouts &amp; strategies</h3><p className="mt-1 text-sm text-muted-foreground">Hide or remove loadouts that break the rules. Removed loadouts cannot be republished by their author.</p></div>
      {!loadouts.length && <p className="text-sm text-muted-foreground">{loading ? "Loading loadouts…" : "No loadouts yet."}</p>}
      <div className="grid gap-3">{loadouts.map((loadout) => <article key={loadout.id} className="flex flex-col gap-3 border border-border bg-background p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2"><span className={`${chip} border-border text-muted-foreground`}>{loadout.game} · {loadout.loadoutType}</span><span className={`${chip} ${loadout.status === "published" ? "border-emerald-500/30 text-emerald-500" : "border-border text-muted-foreground"}`}>{label(loadout.status)}</span>{loadout.featured && <span className={`${chip} border-primary/40 text-primary`}>Featured</span>}{loadout.reports > 0 && <span className={`${chip} border-amber-500/30 text-amber-500`}><Flag className="mr-1 inline h-3 w-3" />{loadout.reports}</span>}</div>
          <h4 className="mt-2 font-semibold text-foreground"><SiteLink path={`/loadouts/${loadout.slug}`}>{loadout.title}</SiteLink></h4>
          <p className="text-xs text-muted-foreground">By {loadout.author?.ign || "unknown"} · ▲ {loadout.up} / ▼ {loadout.down} · {when(loadout.createdAt)}{loadout.removedReason && ` · Removed: ${loadout.removedReason}`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {loadout.status === "published" && <Button variant="outline" disabled={busyId === loadout.id} onClick={() => feature(loadout)} className={action}><Star className="mr-1 h-3 w-3" />{loadout.featured ? "Unfeature" : "Feature"}</Button>}
          {loadout.status === "published" && <Button variant="outline" disabled={busyId === loadout.id} onClick={() => moderateLoadout(loadout, "hidden")} className={action}><EyeOff className="mr-1 h-3 w-3" />Hide</Button>}
          {(loadout.status === "hidden" || loadout.status === "removed") && <Button variant="outline" disabled={busyId === loadout.id} onClick={() => moderateLoadout(loadout, "published")} className={action}><RotateCcw className="mr-1 h-3 w-3" />Restore</Button>}
          {loadout.status !== "removed" && <Button variant="outline" disabled={busyId === loadout.id} onClick={() => moderateLoadout(loadout, "removed")} className={`${action} border-destructive/30 text-destructive`}><Trash2 className="mr-1 h-3 w-3" />Remove</Button>}
        </div>
      </article>)}</div>
      <div><h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Loadout reports</h4><ReportList reports={loadoutReports} busyId={busyId} onStatus={resolve("loadout-reports")} subjectPath={(report) => `/loadouts/${report.subjectSlug}`} /></div>
    </section>
  </div>;
}
