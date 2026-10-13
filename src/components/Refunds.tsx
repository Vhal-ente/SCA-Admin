import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Search, XCircle } from "lucide-react";
import { api, type ApiLeague, type ApiTournament } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export type RefundStatus = "Requested" | "Under Review" | "Approved" | "Rejected" | "Processing" | "Refunded" | "Failed" | "Cancelled";

export type RefundRequest = {
  id: string;
  reference: string;
  user: string;
  email: string;
  competition: string;
  type: "Tournament" | "League" | "Service";
  provider: string;
  currency: string;
  originalAmount: number;
  refundedAmount: number;
  requestedAmount: number;
  paymentRef: string;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  providerRef?: string;
  audit: string[];
};

const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
const statuses: RefundStatus[] = ["Requested", "Under Review", "Approved", "Rejected", "Processing", "Refunded", "Failed", "Cancelled"];
const badge: Record<RefundStatus, string> = {
  Requested: "border-amber-500/40 text-amber-400 bg-amber-500/10", "Under Review": "border-sky-500/40 text-sky-400 bg-sky-500/10",
  Approved: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10", Rejected: "border-rose-500/40 text-rose-400 bg-rose-500/10",
  Processing: "border-violet-500/40 text-violet-400 bg-violet-500/10", Refunded: "border-teal-500/40 text-teal-400 bg-teal-500/10",
  Failed: "border-red-500/40 text-red-400 bg-red-500/10", Cancelled: "border-slate-500/40 text-slate-400 bg-slate-500/10",
};

type Competition = { key: string; label: string };

export default function Refunds({ items, onChanged }: { items: RefundRequest[]; onChanged: () => Promise<void> }) {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [provider, setProvider] = useState("All");
  const [competition, setCompetition] = useState("All");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchOptions, setBatchOptions] = useState<Competition[]>([]);
  const [batchTarget, setBatchTarget] = useState("");
  const [batchReason, setBatchReason] = useState("");
  const selected = items.find((item) => item.id === selectedId) || items[0];
  const competitions = [...new Set(items.map((item) => item.competition))];
  const providers = [...new Set(items.map((item) => item.provider).filter(Boolean))];
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.reference} ${item.user} ${item.email} ${item.paymentRef} ${item.competition}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "All" || item.status === status) && (provider === "All" || item.provider === provider) && (competition === "All" || item.competition === competition) && (!date || item.requestedAt === date);
  }), [items, search, status, provider, competition, date]);

  const act = async (body: { action: string; amount?: string; note?: string; reference?: string }, done: string) => {
    if (!selected) return;
    setBusy(true);
    try {
      await api.patch(`/admin/refunds/${selected.id}`, body);
      toast({ title: done, description: selected.reference });
      await onChanged();
    } catch (error) {
      toast({ title: "Could not update refund", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };
  const approve = () => {
    if (!selected) return;
    const remaining = selected.originalAmount - selected.refundedAmount;
    const raw = window.prompt(`Approve refund amount (maximum ${money(remaining)})`, String(selected.requestedAmount));
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0 || amount > remaining) return void window.alert("Enter a valid amount that does not exceed the remaining refundable balance.");
    if (window.confirm(`Approve ${money(amount)} for ${selected.user}?`)) act({ action: "approve", amount: String(amount) }, "Refund approved");
  };
  const reject = () => {
    const note = window.prompt("Rejection reason (required, kept on the record)")?.trim();
    if (note) act({ action: "reject", note }, "Refund rejected");
  };
  const fail = () => {
    const note = window.prompt("What did the provider or bank report?")?.trim();
    if (note) act({ action: "fail", note }, "Refund marked failed");
  };
  const complete = () => {
    const reference = window.prompt("Enter the bank/provider refund reference (required)")?.trim();
    if (reference) act({ action: "complete", reference }, "Refund recorded");
  };

  const openBatch = async () => {
    setBatchOpen(true);
    try {
      const [{ tournaments }, { leagues }] = await Promise.all([
        api.get<{ tournaments: ApiTournament[] }>("/admin/tournaments"),
        api.get<{ leagues: ApiLeague[] }>("/admin/leagues"),
      ]);
      setBatchOptions([
        ...tournaments.filter(item => item.entryFee > 0).map(item => ({ key: `tournaments/${item.id}`, label: `Tournament · ${item.name}` })),
        ...leagues.filter(item => item.entryFee > 0).map(item => ({ key: `leagues/${item.id}`, label: `League · ${item.name}` })),
      ]);
    } catch (error) {
      toast({ title: "Could not load competitions", description: (error as Error).message, variant: "destructive" });
    }
  };
  const runBatch = async () => {
    if (!batchTarget || !batchReason.trim()) return;
    setBusy(true);
    try {
      const { opened } = await api.post<{ opened: number }>(`/admin/${batchTarget}/refunds`, { reason: batchReason.trim() });
      toast({ title: `${opened} refund ${opened === 1 ? "request" : "requests"} opened`, description: "Review the batch before processing." });
      setBatchOpen(false);
      setBatchReason("");
      await onChanged();
    } catch (error) {
      toast({ title: "Could not create the batch", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return <div className="space-y-6">
    <section className="border border-slate-700/60 bg-slate-900/30 p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-primary">Refund operations</p><h2 className="mt-2 text-3xl font-semibold">Refund requests</h2><p className="mt-2 text-slate-400">Review eligibility, approve amounts, and record confirmed provider settlements.</p></div><button className="border border-slate-700 px-4 py-3 text-sm font-semibold" onClick={openBatch}>Create cancellation batch</button></div>
      {batchOpen && <div className="mb-5 grid gap-3 border border-slate-700 bg-black/30 p-4 lg:grid-cols-[1fr_1.5fr_auto_auto]"><select className="border border-slate-700 bg-slate-950 px-3 py-3" value={batchTarget} onChange={(e) => setBatchTarget(e.target.value)}><option value="">Choose a paid competition</option>{batchOptions.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}</select><input className="border border-slate-700 bg-slate-950 px-3 py-3" placeholder="Reason, e.g. Tournament cancelled by organizer" value={batchReason} onChange={(e) => setBatchReason(e.target.value)} /><button disabled={busy || !batchTarget || !batchReason.trim()} className="bg-primary px-4 py-3 font-bold text-black disabled:opacity-50" onClick={runBatch}>Open refunds</button><button className="border border-slate-700 px-4 py-3" onClick={() => setBatchOpen(false)}>Cancel</button><p className="text-xs text-slate-500 lg:col-span-4">Opens a full refund request for every paid entry without one in progress. Nothing is sent until each is approved and processed.</p></div>}
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[2fr_repeat(4,1fr)]"><label className="flex items-center gap-3 border border-slate-700 bg-black/30 px-4"><Search size={18}/><input className="w-full bg-transparent py-3 outline-none" placeholder="Search player, email, refund, payment, tournament..." value={search} onChange={(e) => setSearch(e.target.value)}/></label>
        <select className="border border-slate-700 bg-slate-950 px-3 py-3" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="border border-slate-700 bg-slate-950 px-3 py-3" value={competition} onChange={(e) => setCompetition(e.target.value)}><option>All</option>{competitions.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="border border-slate-700 bg-slate-950 px-3 py-3 capitalize" value={provider} onChange={(e) => setProvider(e.target.value)}><option>All</option>{providers.map((p) => <option key={p}>{p}</option>)}</select>
        <input type="date" aria-label="Filter by request date" className="border border-slate-700 bg-slate-950 px-3 py-3" value={date} onChange={(e) => setDate(e.target.value)}/></div>
    </section>

    <section className="overflow-x-auto border border-slate-700/60"><table className="w-full min-w-[1250px] text-left text-sm"><thead className="bg-slate-900/70 text-xs uppercase tracking-wider text-slate-400"><tr>{["Refund ID","User","Tournament / service","Original","Refund","Payment ref","Reason","Status","Request date","Actions"].map((h) => <th className="px-4 py-4" key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-slate-800 hover:bg-slate-900/40"><td className="px-4 py-4 font-semibold text-primary">{row.reference}</td><td className="px-4 py-4"><b>{row.user}</b><div className="text-xs text-slate-400">{row.email}</div></td><td className="px-4 py-4">{row.competition}<div className="text-xs text-slate-500">{row.type}</div></td><td className="px-4 py-4">{money(row.originalAmount)}</td><td className="px-4 py-4 font-semibold">{money(row.requestedAmount)}</td><td className="px-4 py-4">{row.paymentRef}<div className="text-xs capitalize text-slate-500">{row.provider}</div></td><td className="max-w-56 truncate px-4 py-4 text-slate-400">{row.reason}</td><td className="px-4 py-4"><span className={`whitespace-nowrap border px-2 py-1 text-xs font-bold ${badge[row.status]}`}>{row.status}</span></td><td className="px-4 py-4">{row.requestedAt}</td><td className="px-4 py-4"><button className="border border-slate-700 px-3 py-2 font-semibold hover:border-primary" onClick={() => setSelectedId(row.id)}>Review</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-slate-400">No refund requests match these filters.</p>}</section>

    {selected && <section className="border border-slate-700/60 bg-slate-900/25"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-700/60 p-6"><div><p className="text-xs uppercase tracking-[.25em] text-primary">Refund detail</p><h3 className="mt-2 text-2xl font-semibold">{selected.reference} · {selected.user}</h3><p className="text-slate-400">Linked to payment {selected.paymentRef}</p></div><span className={`border px-3 py-2 text-xs font-bold ${badge[selected.status]}`}>{selected.status}</span></div>
      <div className="grid gap-px bg-slate-700/60 md:grid-cols-3">{[["Customer", `${selected.user}\n${selected.email}`],["Original transaction", `${money(selected.originalAmount)}\n${selected.provider} · ${selected.paymentRef}`],["Refund request", `${money(selected.requestedAmount)}\n${selected.reason}`]].map(([title,body]) => <div className="whitespace-pre-line bg-slate-950 p-6" key={title}><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p><p className="mt-3 leading-7">{body}</p></div>)}</div>
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto]"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit trail</p><ul className="mt-3 space-y-2 text-sm text-slate-300">{selected.audit.map((event, i) => <li key={`${event}-${i}`}>• {event}</li>)}</ul>{selected.providerRef && <p className="mt-4 text-sm text-slate-400">Refund reference: {selected.providerRef}</p>}</div>
      <div className="flex max-w-xl flex-wrap justify-end gap-2">{selected.status === "Requested" && <button disabled={busy} className="border border-slate-700 px-4 py-3" onClick={() => act({ action: "review" }, "Review opened")}>Review</button>}{["Requested","Under Review"].includes(selected.status) && <><button disabled={busy} className="border border-red-500/40 px-4 py-3 text-red-400" onClick={reject}><XCircle className="mr-2 inline" size={17}/>Reject</button><button disabled={busy} className="bg-primary px-4 py-3 font-bold text-black" onClick={approve}><CheckCircle2 className="mr-2 inline" size={17}/>Approve</button></>}{selected.status === "Approved" && <button disabled={busy} className="bg-primary px-4 py-3 font-bold text-black" onClick={() => window.confirm("Mark this refund as sent to the provider or bank?") && act({ action: "process" }, "Refund processing")}>Process refund</button>}{selected.status === "Processing" && <><button disabled={busy} className="border border-red-500/40 px-4 py-3 text-red-400" onClick={fail}>Mark failed</button><button disabled={busy} className="bg-primary px-4 py-3 font-bold text-black" onClick={complete}>Record confirmed refund</button></>}{selected.status === "Failed" && <button disabled={busy} className="border border-amber-500/50 px-4 py-3 text-amber-400" onClick={() => window.confirm("Retry this failed refund?") && act({ action: "retry" }, "Refund queued for retry")}><RotateCcw className="mr-2 inline" size={17}/>Retry</button>}{["Requested","Under Review","Approved","Failed"].includes(selected.status) && <button disabled={busy} className="border border-slate-700 px-4 py-3" onClick={() => window.confirm("Cancel this refund request?") && act({ action: "cancel" }, "Refund cancelled")}>Cancel request</button>}</div></div></section>}
    <p className="text-xs text-slate-500">Refunds are sent by staff through the provider or bank; a refund only counts as done once its reference is recorded here. Nothing marks an attempted refund as successful automatically.</p>
  </div>;
}
