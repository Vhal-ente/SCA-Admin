import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Download, RotateCcw, Search, X } from "lucide-react";
import { api, type ApiPayment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SEARCH_DELAY_MS = 300;

const statusLabel: Record<ApiPayment["status"], string> = {
  paid: "SUCCESSFUL", pending: "PENDING", failed: "FAILED", abandoned: "ABANDONED",
  partially_refunded: "PART REFUNDED", refunded: "REFUNDED",
};

const statusClass = (status: ApiPayment["status"]) =>
  status === "paid" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : status === "pending" ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
      : status.includes("refunded") ? "border-sky-500/30 bg-sky-500/10 text-sky-400"
        : "border-rose-500/30 bg-rose-500/10 text-rose-400";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: currency || "NGN", maximumFractionDigits: 2 }).format(amount);

const when = (iso: string) => (iso ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)) : "—");

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export default function TransactionsTab({ onRefundRequested }: { onRefundRequested?: () => void }) {
  const { toast } = useToast();
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [selected, setSelected] = useState<ApiPayment | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (status) params.set("status", status);
        const { payments: list } = await api.get<{ payments: ApiPayment[] }>(`/admin/payments?${params}`);
        setPayments(list);
        setSelected(current => list.find(item => item.id === current?.id) || list[0] || null);
      } catch (error) {
        toast({ title: "Could not load payments", description: (error as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }, SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [query, status, reload, toast]);

  const exportCsv = () => {
    const header = ["Reference", "Date", "Payer", "Email", "Competition", "Amount", "Refunded", "Currency", "Provider", "Status"];
    const rows = payments.map(item => [item.reference, item.paidAt || item.createdAt, item.payer?.ign || "", item.payer?.email || "",
      item.serviceName, item.amount, item.refundedAmount, item.currency, item.provider, item.status]);
    const blob = new Blob([[header, ...rows].map(row => row.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sca-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const requestRefund = async (payment: ApiPayment) => {
    const reason = window.prompt(`Why is ${payment.reference} being refunded?`)?.trim();
    if (!reason) return;
    try {
      await api.post(`/admin/payments/${payment.id}/refunds`, { reason });
      toast({ title: "Refund requested", description: `Review it in Refunds before money is sent back.` });
      setReload(value => value + 1);
      onRefundRequested?.();
    } catch (error) {
      toast({ title: "Could not request refund", description: (error as Error).message, variant: "destructive" });
    }
  };

  const copy = (value: string) => navigator.clipboard?.writeText(value).then(() => toast({ title: "Reference copied" }));
  const refundable = selected && ["paid", "partially_refunded"].includes(selected.status) && selected.amount > selected.refundedAmount;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <section className="border border-border bg-card">
        <div className="flex flex-col gap-5 border-b border-border p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Payment ledger</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Entry fees collected online or recorded by staff, with what has been refunded.</p>
          </div>
          <button onClick={exportCsv} disabled={!payments.length} className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <div className="grid gap-3 border-b border-border bg-background/35 p-5 sm:grid-cols-[1fr_210px]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reference, player, email, competition..." className="h-12 w-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="theme-native-select h-12 border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none focus:border-primary">
            <option value="">All statuses</option><option value="paid">Successful</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="partially_refunded">Partly refunded</option><option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-border bg-background/25 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr><th className="p-5">Reference</th><th className="p-5">Participant</th><th className="p-5">Competition</th><th className="p-5">Amount</th><th className="p-5">Gateway</th><th className="p-5 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((txn) => <tr key={txn.id} onClick={() => setSelected(txn)} className={`cursor-pointer transition-colors hover:bg-primary/5 ${selected?.id === txn.id ? "bg-primary/5" : ""}`}>
                <td className="p-5"><p className="font-mono text-sm text-foreground">{txn.reference}</p><p className="mt-1 text-xs text-muted-foreground">{when(txn.paidAt || txn.createdAt)}</p></td>
                <td className="p-5 font-semibold text-foreground">{txn.payer?.ign || "Removed account"}</td><td className="p-5 text-sm text-muted-foreground">{txn.serviceName}</td><td className="p-5 font-semibold text-foreground">{money(txn.amount, txn.currency)}</td><td className="p-5 text-sm capitalize text-muted-foreground">{txn.provider}</td>
                <td className="p-5 text-right"><span className={`inline-flex border px-3 py-1 text-[11px] font-bold tracking-wider ${statusClass(txn.status)}`}>{statusLabel[txn.status]}</span></td>
              </tr>)}
            </tbody>
          </table>
          {!payments.length && <p className="p-10 text-center text-sm text-muted-foreground">{loading ? "Loading payments…" : "No payments match these filters."}</p>}
        </div>
      </section>

      <aside className="border border-border bg-card">
        {selected ? <>
          <div className="flex items-center justify-between border-b border-border p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction details</p><button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button></div>
          <div className="border-b border-border bg-background/30 p-7 text-center"><CheckCircle2 className={`mx-auto h-8 w-8 ${selected.status === "paid" ? "text-primary" : "text-muted-foreground"}`} /><p className="mt-3 text-4xl font-semibold text-foreground">{money(selected.amount, selected.currency)}</p><span className={`mt-3 inline-flex border px-3 py-1 text-[11px] font-bold tracking-wider ${statusClass(selected.status)}`}>{statusLabel[selected.status]}</span><p className="mt-3 text-xs text-muted-foreground">{selected.paidAt ? `Paid ${when(selected.paidAt)}` : `Started ${when(selected.createdAt)}`}</p></div>
          <div className="space-y-5 p-6 text-sm">
            <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference</p><button onClick={() => copy(selected.reference)} className="mt-2 flex w-full items-center justify-between border border-border bg-background p-3 font-mono text-foreground"><span className="truncate">{selected.reference}</span><Copy className="h-4 w-4 shrink-0 text-muted-foreground" /></button></div>
            <div className="grid grid-cols-2 gap-4"><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Participant</p><p className="mt-1 font-semibold text-foreground">{selected.payer?.ign || "Removed account"}</p><p className="text-xs text-muted-foreground">{selected.payer?.email}</p></div><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Gateway</p><p className="mt-1 font-semibold capitalize text-foreground">{selected.provider}</p><p className="text-xs text-muted-foreground">{selected.method}</p></div></div>
            <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Competition</p><p className="mt-1 font-semibold text-foreground">{selected.serviceName || "—"}</p></div>
            {selected.refundedAmount > 0 && <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Refunded</p><p className="mt-1 font-semibold text-foreground">{money(selected.refundedAmount, selected.currency)}</p></div>}
            <div className="border border-dashed border-border bg-background/30 p-3 text-muted-foreground">Reconcile against the participant's entry before issuing a refund.</div>
            <button disabled={!refundable} onClick={() => requestRefund(selected)} className="flex h-11 w-full items-center justify-center gap-2 border border-border font-bold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-4 w-4" /> Request refund</button>
          </div>
        </> : <div className="p-10 text-center text-sm text-muted-foreground">Select a transaction to inspect.</div>}
      </aside>
    </div>
  );
}
