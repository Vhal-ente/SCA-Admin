import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Gavel, Lock, MessageSquare, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api, type ApiDispute, type ApiReport } from "@/lib/api";

const CATEGORY: Record<ApiReport["category"], string> = {
  conduct: "Conduct", payment: "Payment", competitive_integrity: "Competitive integrity", account: "Account", other: "Other",
};
const REPORT_STATUS: Record<ApiReport["status"], string> = { open: "Open", in_review: "In review", closed: "Closed" };
const DISPUTE_STATUS: Record<ApiDispute["status"], string> = { open: "Open", under_review: "Under review", resolved: "Upheld", rejected: "Rejected" };
const when = (iso: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export default function ReportsDesk() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [disputes, setDisputes] = useState<ApiDispute[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [{ reports: reportList }, { disputes: disputeList }] = await Promise.all([
        api.get<{ reports: ApiReport[] }>("/admin/reports"),
        api.get<{ disputes: ApiDispute[] }>("/admin/disputes"),
      ]);
      setReports(reportList);
      setDisputes(disputeList);
    } catch (error) {
      toast({ title: "Could not load reports", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  const run = async (id: string, request: () => Promise<unknown>, title: string, clearDraft = false) => {
    setBusyId(id);
    try {
      await request();
      toast({ title });
      if (clearDraft) setDrafts(current => ({ ...current, [id]: "" }));
      await load();
    } catch (error) {
      toast({ title: "Could not update", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusyId("");
    }
  };
  const send = (report: ApiReport, kind: "reply" | "note") =>
    run(report.id, () => api.post(`/admin/reports/${report.id}/messages`, { kind, body: drafts[report.id] }),
      kind === "reply" ? `Reply sent for ${report.reference}` : `Note added to ${report.reference}`, true);
  const setStatus = (report: ApiReport, status: ApiReport["status"]) =>
    run(report.id, () => api.patch(`/admin/reports/${report.id}`, { status }),
      status === "closed" ? `${report.reference} closed` : `${report.reference} reopened`);
  const review = (dispute: ApiDispute, status: ApiDispute["status"]) => {
    const resolution = status === "under_review" ? "" : window.prompt(status === "resolved"
      ? "Explain the decision. Correct the score in Matches so the bracket and standings follow."
      : "Explain why the result stands. This is sent to the player.")?.trim();
    if (status !== "under_review" && !resolution) return;
    run(dispute.id, () => api.patch(`/admin/disputes/${dispute.id}`, { status, resolution }), `Dispute ${DISPUTE_STATUS[status].toLowerCase()}`);
  };

  const openDisputes = disputes.filter(item => item.status === "open" || item.status === "under_review");

  return <div className="space-y-6">
    <div className="flex flex-col space-y-5 rounded-sm border border-border bg-card p-6">
      <div>
        <p className="sca-eyebrow mb-2">Competitive integrity</p>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">Match disputes</h3>
        <p className="mt-1 text-sm text-muted-foreground">Players challenge recorded results here. Uphold a dispute after correcting the score in Matches.</p>
      </div>
      {!disputes.length && <p className="text-sm text-muted-foreground">{loading ? "Loading disputes…" : "No disputes raised."}</p>}
      <div className="grid gap-4">{disputes.map(dispute => <article key={dispute.id} className={`border border-border bg-background p-5 ${openDisputes.includes(dispute) ? "" : "opacity-70"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="border border-border px-2 py-1 text-[9px] font-bold uppercase text-muted-foreground">{dispute.competition} · {dispute.round}</span><span className={`border px-2 py-1 text-[9px] font-bold uppercase ${["resolved", "rejected"].includes(dispute.status) ? "border-emerald-500/30 text-emerald-500" : "border-amber-500/30 text-amber-500"}`}>{DISPUTE_STATUS[dispute.status]}</span></div>
            <h4 className="mt-3 text-lg font-semibold text-foreground">{dispute.home} {dispute.homeScore ?? "–"} : {dispute.awayScore ?? "–"} {dispute.away}</h4>
            <p className="mt-2 text-sm text-foreground">{dispute.reason}</p>
            {dispute.details && <p className="mt-1 text-sm text-muted-foreground">{dispute.details}</p>}
            <p className="mt-2 text-xs text-muted-foreground">Raised by <strong className="text-foreground">{dispute.raisedBy?.ign}</strong>{dispute.team && ` for ${dispute.team}`} · {when(dispute.createdAt)}</p>
            {dispute.evidenceUrl && <a href={dispute.evidenceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">Evidence <ExternalLink className="h-3 w-3" /></a>}
            {dispute.resolution && <p className="mt-3 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Decision: {dispute.resolution}</p>}
          </div>
          {openDisputes.includes(dispute) && <div className="flex flex-wrap gap-2">
            {dispute.status === "open" && <Button variant="outline" disabled={busyId === dispute.id} onClick={() => review(dispute, "under_review")} className="h-10 rounded-sm text-xs font-bold uppercase tracking-wider">Start review</Button>}
            <Button variant="outline" disabled={busyId === dispute.id} onClick={() => review(dispute, "rejected")} className="h-10 rounded-sm border-destructive/30 text-xs font-bold uppercase tracking-wider text-destructive">Reject</Button>
            <Button disabled={busyId === dispute.id} onClick={() => review(dispute, "resolved")} className="h-10 gap-2 rounded-sm bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground"><Gavel className="h-4 w-4" />Uphold</Button>
          </div>}
        </div>
      </article>)}</div>
    </div>

    <div className="flex flex-col space-y-5 rounded-sm border border-border bg-card p-6">
      <div>
        <p className="sca-eyebrow mb-2">Trust &amp; safety</p>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">Reports &amp; support tickets</h3>
        <p className="mt-1 text-sm text-muted-foreground">Investigate reports, reply to the reporter, keep internal notes, and close resolved tickets.</p>
      </div>
      {!reports.length && <p className="text-sm text-muted-foreground">{loading ? "Loading reports…" : "No reports filed."}</p>}
      <div className="grid gap-4">{reports.map(report => { const closed = report.status === "closed"; const draft = drafts[report.id] || ""; return <article key={report.id} className="border border-border bg-background p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{report.reference}</span><span className="border border-border px-2 py-1 text-[9px] font-bold uppercase text-muted-foreground">{CATEGORY[report.category]}</span><span className={`border px-2 py-1 text-[9px] font-bold uppercase ${closed ? "border-emerald-500/30 text-emerald-500" : "border-amber-500/30 text-amber-500"}`}>{REPORT_STATUS[report.status]}</span></div>
            <h4 className="mt-3 text-lg font-semibold text-foreground">{report.subject}</h4>
            {report.details && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{report.details}</p>}
            <p className="mt-2 text-xs text-muted-foreground">{report.reportedUser && <>Reported user: <strong className="text-foreground">{report.reportedUser.ign}</strong> · </>}Submitted by {report.reporter?.ign} ({report.reporter?.email}) · {when(report.createdAt)}</p>
          </div>
          {closed
            ? <Button variant="outline" disabled={busyId === report.id} onClick={() => setStatus(report, "open")} className="h-10 rounded-sm text-xs font-bold uppercase tracking-wider">Reopen</Button>
            : <Button variant="outline" disabled={busyId === report.id} onClick={() => setStatus(report, "closed")} className="h-10 gap-2 rounded-sm border-emerald-500/30 text-xs font-bold uppercase tracking-wider text-emerald-500 hover:bg-emerald-500/10"><Lock className="h-4 w-4" />Close ticket</Button>}
        </div>
        {report.messages.length > 0 && <ul className="mt-5 space-y-3 border-t border-border pt-5">{report.messages.map((message, index) => <li key={index} className={`border-l-2 pl-3 text-sm ${message.kind === "note" ? "border-amber-500/50" : "border-primary"}`}><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{message.kind === "note" ? "Internal note" : "Reply to reporter"} · {message.author} · {when(message.at)}</p><p className="mt-1 whitespace-pre-line text-foreground">{message.body}</p></li>)}</ul>}
        <div className="mt-5 border-t border-border pt-5">
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Response &amp; notes</label>
          <Textarea disabled={closed} value={draft} onChange={event => setDrafts(current => ({ ...current, [report.id]: event.target.value }))} placeholder="Write a response, request more information, or note what you found..." className="mt-2 min-h-24 rounded-sm border-border bg-card text-sm" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button disabled={closed || !draft.trim() || busyId === report.id} onClick={() => send(report, "reply")} className="h-10 gap-2 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground"><MessageSquare className="h-4 w-4" />Send response</Button>
            <Button disabled={closed || !draft.trim() || busyId === report.id} variant="outline" onClick={() => send(report, "note")} className="h-10 gap-2 rounded-sm border-border px-5 text-xs font-bold uppercase tracking-wider"><StickyNote className="h-4 w-4" />Add internal note</Button>
          </div>
        </div>
      </article>; })}</div>
    </div>
  </div>;
}
