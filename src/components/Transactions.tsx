import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, FileText, HelpCircle, Search, X } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  entity: string;
  tournament: string;
  amount: string;
  gateway: string;
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
}

const transactions: Transaction[] = [
  { id: "TXN-7821", date: "12 Oct, 2026", entity: "Team Liquid", tournament: "CODM Pro League", amount: "$500.00", gateway: "Paystack", status: "SUCCESSFUL" },
  { id: "TXN-7820", date: "12 Oct, 2026", entity: "Viper7", tournament: "Spring 2026", amount: "$250.00", gateway: "Paystack", status: "PENDING" },
  { id: "TXN-7819", date: "11 Oct, 2026", entity: "Ghost Gaming", tournament: "Elite Invitational", amount: "$500.00", gateway: "Paystack", status: "FAILED" },
];

const statusClass: Record<Transaction["status"], string> = {
  SUCCESSFUL: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  FAILED: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export default function TransactionsTab() {
  const [selected, setSelected] = useState<Transaction | null>(transactions[0]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const filtered = useMemo(() => transactions.filter((item) => {
    const matchesQuery = `${item.id} ${item.entity} ${item.tournament}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "ALL" || item.status === status);
  }), [query, status]);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <section className="border border-border bg-card">
        <div className="flex flex-col gap-5 border-b border-border p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Payment ledger</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Review tournament entries, payouts, and gateway activity.</p>
          </div>
          <button className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-wide text-primary-foreground">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <div className="grid gap-3 border-b border-border bg-background/35 p-5 sm:grid-cols-[1fr_210px]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions..." className="h-12 w-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="theme-native-select h-12 border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none focus:border-primary">
            <option value="ALL">All statuses</option><option value="SUCCESSFUL">Successful</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-border bg-background/25 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr><th className="p-5">Reference</th><th className="p-5">Participant</th><th className="p-5">Competition</th><th className="p-5">Amount</th><th className="p-5">Gateway</th><th className="p-5 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((txn) => <tr key={txn.id} onClick={() => setSelected(txn)} className={`cursor-pointer transition-colors hover:bg-primary/5 ${selected?.id === txn.id ? "bg-primary/5" : ""}`}>
                <td className="p-5"><p className="font-mono text-sm text-foreground">{txn.id}</p><p className="mt-1 text-xs text-muted-foreground">{txn.date}</p></td>
                <td className="p-5 font-semibold text-foreground">{txn.entity}</td><td className="p-5 text-sm text-muted-foreground">{txn.tournament}</td><td className="p-5 font-semibold text-foreground">{txn.amount}</td><td className="p-5 text-sm text-muted-foreground">{txn.gateway}</td>
                <td className="p-5 text-right"><span className={`inline-flex border px-3 py-1 text-[11px] font-bold tracking-wider ${statusClass[txn.status]}`}>{txn.status}</span></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="border border-border bg-card">
        {selected ? <>
          <div className="flex items-center justify-between border-b border-border p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction details</p><button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button></div>
          <div className="border-b border-border bg-background/30 p-7 text-center"><CheckCircle2 className={`mx-auto h-8 w-8 ${selected.status === "SUCCESSFUL" ? "text-primary" : "text-muted-foreground"}`} /><p className="mt-3 text-4xl font-semibold text-foreground">{selected.amount}</p><span className={`mt-3 inline-flex border px-3 py-1 text-[11px] font-bold tracking-wider ${statusClass[selected.status]}`}>{selected.status}</span><p className="mt-3 text-xs text-muted-foreground">Processed 12 Oct, 2026 · 14:32 WAT</p></div>
          <div className="space-y-5 p-6 text-sm">
            <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference</p><div className="mt-2 flex items-center justify-between border border-border bg-background p-3 font-mono text-foreground"><span>{selected.id}-2026</span><Copy className="h-4 w-4 text-muted-foreground" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Participant</p><p className="mt-1 font-semibold text-foreground">{selected.entity}</p></div><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Gateway</p><p className="mt-1 font-semibold text-foreground">{selected.gateway}</p></div></div>
            <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Competition</p><p className="mt-1 font-semibold text-foreground">{selected.tournament}</p></div>
            <div className="border border-dashed border-border bg-background/30 p-3 text-muted-foreground">Tournament registration payment. Reconcile against the participant entry before issuing a refund.</div>
            <button className="flex h-11 w-full items-center justify-center gap-2 bg-primary font-bold uppercase tracking-wide text-primary-foreground"><FileText className="h-4 w-4" /> Download receipt</button>
            <button className="flex h-11 w-full items-center justify-center gap-2 border border-border font-bold uppercase tracking-wide text-foreground"><HelpCircle className="h-4 w-4" /> Payment support</button>
          </div>
        </> : <div className="p-10 text-center text-sm text-muted-foreground">Select a transaction to inspect.</div>}
      </aside>
    </div>
  );
}
