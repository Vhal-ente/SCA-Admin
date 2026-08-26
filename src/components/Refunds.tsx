import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, Search, XCircle } from "lucide-react";

export type RefundStatus = "Requested" | "Under Review" | "Approved" | "Rejected" | "Processing" | "Refunded" | "Failed" | "Cancelled";

export type RefundRequest = {
  id: string;
  user: string;
  email: string;
  competition: string;
  type: "Tournament" | "League" | "Service";
  provider: "Paystack" | "Flutterwave" | "Manual";
  originalAmount: number;
  refundedAmount: number;
  requestedAmount: number;
  paymentRef: string;
  transactionRef: string;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  account?: string;
  providerRef?: string;
  audit: string[];
};

export const initialRefunds: RefundRequest[] = [
  { id: "RF-26081", user: "Adebola Goodness", email: "adebola@example.com", competition: "SCA Warzone Clash", type: "Tournament", provider: "Paystack", originalAmount: 10000, refundedAmount: 0, requestedAmount: 10000, paymentRef: "PAY-8Q2K1", transactionRef: "TX-10482", reason: "Registration cancelled before the published deadline.", status: "Requested", requestedAt: "2026-08-22", audit: ["Request submitted from player dashboard"] },
  { id: "RF-26080", user: "Tomi Adeyemi", email: "tomi@example.com", competition: "Academius Games", type: "League", provider: "Flutterwave", originalAmount: 15000, refundedAmount: 0, requestedAmount: 7500, paymentRef: "FLW-99142", transactionRef: "TX-10463", reason: "Duplicate team entry payment.", status: "Under Review", requestedAt: "2026-08-21", audit: ["Request submitted", "Review opened by Finance Manager"] },
  { id: "RF-26074", user: "Musa Ibrahim", email: "musa@example.com", competition: "SCA Mobile Masters", type: "Tournament", provider: "Manual", originalAmount: 8000, refundedAmount: 0, requestedAmount: 8000, paymentRef: "BANK-33910", transactionRef: "TX-10391", reason: "Tournament cancelled by organizer.", status: "Approved", requestedAt: "2026-08-18", account: "GTBank • 0123456789", audit: ["Bulk cancellation request created", "Approved by Super Admin"] },
  { id: "RF-26063", user: "Ife Okoro", email: "ife@example.com", competition: "CODM Pro League", type: "League", provider: "Paystack", originalAmount: 12000, refundedAmount: 0, requestedAmount: 12000, paymentRef: "PAY-19A7F", transactionRef: "TX-10277", reason: "Provider reversal failed.", status: "Failed", requestedAt: "2026-08-14", audit: ["Approved", "Provider error: recipient account unavailable"] },
  { id: "RF-26041", user: "Sade Bello", email: "sade@example.com", competition: "Partner Pass", type: "Service", provider: "Paystack", originalAmount: 5000, refundedAmount: 5000, requestedAmount: 5000, paymentRef: "PAY-77B12", transactionRef: "TX-10118", reason: "Service not delivered.", status: "Refunded", requestedAt: "2026-08-08", providerRef: "PS-RFN-8821", audit: ["Approved", "Refund confirmed by Paystack"] },
];

const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
const statuses: RefundStatus[] = ["Requested", "Under Review", "Approved", "Rejected", "Processing", "Refunded", "Failed", "Cancelled"];
const badge: Record<RefundStatus, string> = {
  Requested: "border-amber-500/40 text-amber-400 bg-amber-500/10", "Under Review": "border-sky-500/40 text-sky-400 bg-sky-500/10",
  Approved: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10", Rejected: "border-rose-500/40 text-rose-400 bg-rose-500/10",
  Processing: "border-violet-500/40 text-violet-400 bg-violet-500/10", Refunded: "border-teal-500/40 text-teal-400 bg-teal-500/10",
  Failed: "border-red-500/40 text-red-400 bg-red-500/10", Cancelled: "border-slate-500/40 text-slate-400 bg-slate-500/10",
};

export default function Refunds({ items, setItems }: { items: RefundRequest[]; setItems: Dispatch<SetStateAction<RefundRequest[]>> }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [provider, setProvider] = useState("All");
  const [competition, setCompetition] = useState("All");
  const [date, setDate] = useState("");
  const selected = items.find((item) => item.id === selectedId);
  const competitions = [...new Set(items.map((item) => item.competition))];
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.id} ${item.user} ${item.email} ${item.paymentRef} ${item.transactionRef} ${item.competition}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "All" || item.status === status) && (provider === "All" || item.provider === provider) && (competition === "All" || item.competition === competition) && (!date || item.requestedAt === date);
  }), [items, search, status, provider, competition, date]);

  const update = (nextStatus: RefundStatus, note: string, extras: Partial<RefundRequest> = {}) => {
    if (!selected) return;
    setItems((rows) => rows.map((row) => row.id === selected.id ? { ...row, ...extras, status: nextStatus, audit: [...row.audit, `${note} • ${new Date().toLocaleString("en-NG")}`] } : row));
  };
  const approve = () => {
    if (!selected) return;
    const remaining = selected.originalAmount - selected.refundedAmount;
    const raw = window.prompt(`Approve refund amount (maximum ${money(remaining)})`, String(selected.requestedAmount));
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount <= 0 || amount > remaining) return void window.alert("Enter a valid amount that does not exceed the remaining refundable balance.");
    if (window.confirm(`Approve ${money(amount)} for ${selected.user}?`)) update("Approved", `Approved ${money(amount)}`, { requestedAmount: amount });
  };
  const reject = () => {
    const internal = window.prompt("Internal rejection reason (required)");
    if (!internal?.trim()) return;
    const customer = window.prompt("Optional feedback to the user")?.trim();
    update("Rejected", `Rejected: ${internal}${customer ? `; user feedback: ${customer}` : ""}`);
  };
  const completeManual = () => {
    const ref = window.prompt("Enter the bank/provider refund reference (required)");
    if (!ref?.trim()) return;
    update("Refunded", `Manual refund confirmed with reference ${ref}`, { providerRef: ref, refundedAmount: (selected?.refundedAmount ?? 0) + (selected?.requestedAmount ?? 0) });
  };

  return <div className="space-y-6">
    <section className="border border-slate-700/60 bg-slate-900/30 p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-primary">Refund operations</p><h2 className="mt-2 text-3xl font-semibold">Refund requests</h2><p className="mt-2 text-slate-400">Review eligibility, approve amounts, and record confirmed provider settlements.</p></div><button className="border border-slate-700 px-4 py-3 text-sm font-semibold" onClick={() => window.alert("Cancellation flows create refund requests for every eligible paid registration. Review the generated batch before processing.")}>Create cancellation batch</button></div>
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[2fr_repeat(4,1fr)]"><label className="flex items-center gap-3 border border-slate-700 bg-black/30 px-4"><Search size={18}/><input className="w-full bg-transparent py-3 outline-none" placeholder="Search player, email, refund, payment, tournament..." value={search} onChange={(e) => setSearch(e.target.value)}/></label>
        <select className="border border-slate-700 bg-slate-950 px-3 py-3" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="border border-slate-700 bg-slate-950 px-3 py-3" value={competition} onChange={(e) => setCompetition(e.target.value)}><option>All</option>{competitions.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="border border-slate-700 bg-slate-950 px-3 py-3" value={provider} onChange={(e) => setProvider(e.target.value)}><option>All</option><option>Paystack</option><option>Flutterwave</option><option>Manual</option></select>
        <input type="date" aria-label="Filter by request date" className="border border-slate-700 bg-slate-950 px-3 py-3" value={date} onChange={(e) => setDate(e.target.value)}/></div>
    </section>

    <section className="overflow-x-auto border border-slate-700/60"><table className="w-full min-w-[1250px] text-left text-sm"><thead className="bg-slate-900/70 text-xs uppercase tracking-wider text-slate-400"><tr>{["Refund ID","User","Tournament / service","Original","Refund","Payment ref","Reason","Status","Request date","Actions"].map((h) => <th className="px-4 py-4" key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-slate-800 hover:bg-slate-900/40"><td className="px-4 py-4 font-semibold text-primary">{row.id}</td><td className="px-4 py-4"><b>{row.user}</b><div className="text-xs text-slate-400">{row.email}</div></td><td className="px-4 py-4">{row.competition}<div className="text-xs text-slate-500">{row.type}</div></td><td className="px-4 py-4">{money(row.originalAmount)}</td><td className="px-4 py-4 font-semibold">{money(row.requestedAmount)}</td><td className="px-4 py-4">{row.paymentRef}<div className="text-xs text-slate-500">{row.provider}</div></td><td className="max-w-56 truncate px-4 py-4 text-slate-400">{row.reason}</td><td className="px-4 py-4"><span className={`whitespace-nowrap border px-2 py-1 text-xs font-bold ${badge[row.status]}`}>{row.status}</span></td><td className="px-4 py-4">{row.requestedAt}</td><td className="px-4 py-4"><button className="border border-slate-700 px-3 py-2 font-semibold hover:border-primary" onClick={() => setSelectedId(row.id)}>Review</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-slate-400">No refund requests match these filters.</p>}</section>

    {selected && <section className="border border-slate-700/60 bg-slate-900/25"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-700/60 p-6"><div><p className="text-xs uppercase tracking-[.25em] text-primary">Refund detail</p><h3 className="mt-2 text-2xl font-semibold">{selected.id} · {selected.user}</h3><p className="text-slate-400">Linked to {selected.transactionRef} / {selected.paymentRef}</p></div><span className={`border px-3 py-2 text-xs font-bold ${badge[selected.status]}`}>{selected.status}</span></div>
      <div className="grid gap-px bg-slate-700/60 md:grid-cols-3">{[["Customer", `${selected.user}\n${selected.email}`],["Original transaction", `${money(selected.originalAmount)}\n${selected.provider} · ${selected.paymentRef}`],["Refund request", `${money(selected.requestedAmount)}\n${selected.reason}`]].map(([title,body]) => <div className="whitespace-pre-line bg-slate-950 p-6" key={title}><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p><p className="mt-3 leading-7">{body}</p></div>)}</div>
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto]"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit trail</p><ul className="mt-3 space-y-2 text-sm text-slate-300">{selected.audit.map((event, i) => <li key={`${event}-${i}`}>• {event}</li>)}</ul>{selected.account && <p className="mt-4 text-sm text-slate-400">Settlement account: {selected.account}</p>}{selected.providerRef && <p className="mt-1 text-sm text-slate-400">Refund reference: {selected.providerRef}</p>}</div>
      <div className="flex max-w-xl flex-wrap justify-end gap-2">{["Requested","Under Review"].includes(selected.status) && <><button className="border border-slate-700 px-4 py-3" onClick={() => update("Under Review", "Review opened")}>Review</button><button className="border border-red-500/40 px-4 py-3 text-red-400" onClick={reject}><XCircle className="mr-2 inline" size={17}/>Reject</button><button className="bg-primary px-4 py-3 font-bold text-black" onClick={approve}><CheckCircle2 className="mr-2 inline" size={17}/>Approve</button></>}{selected.status === "Approved" && <button className="bg-primary px-4 py-3 font-bold text-black" onClick={() => window.confirm("Start this refund with the configured provider?") && update("Processing", "Refund sent for processing")}>Process refund</button>}{selected.status === "Processing" && <button className="bg-primary px-4 py-3 font-bold text-black" onClick={completeManual}>Record confirmed refund</button>}{selected.status === "Failed" && <button className="border border-amber-500/50 px-4 py-3 text-amber-400" onClick={() => window.confirm("Retry this failed refund?") && update("Processing", "Failed refund queued for retry")}><RotateCcw className="mr-2 inline" size={17}/>Retry</button>}<button className="border border-slate-700 px-4 py-3" onClick={() => window.alert("Notification queued asking the user to review payment/account details.")}><AlertTriangle className="mr-2 inline" size={17}/>Ping user</button></div></div></section>}
    <p className="text-xs text-slate-500">Provider actions remain pending until a real gateway or bank reference is returned; the interface never marks an attempted refund as successful automatically. Refund policy rules and exceptions should be configured in Payment settings.</p>
  </div>;
}
