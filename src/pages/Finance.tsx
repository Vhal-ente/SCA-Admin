import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft, ArrowLeft, ArrowUpRight, BellRing, CheckCircle2, Clock3,
  Download, RotateCcw, ShieldAlert, UserRoundCheck, WalletCards,
} from "lucide-react";
import TransactionsTab from "@/components/Transactions";
import RefundsTab, { type RefundRequest, type RefundStatus } from "@/components/Refunds";
import { api, type ApiPayment, type ApiPayout, type ApiPayoutStatus, type ApiRefund, type ApiSettlement } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type SubTab = "overview" | "prizes" | "refunds" | "transactions";
type CompetitionType = "Tournament" | "League";

const STATUS_LABEL: Record<ApiRefund["status"], RefundStatus> = {
  requested: "Requested", under_review: "Under Review", approved: "Approved", rejected: "Rejected",
  processing: "Processing", refunded: "Refunded", failed: "Failed", cancelled: "Cancelled",
};

const toRefundRequest = (refund: ApiRefund): RefundRequest => ({
  id: refund.id, reference: refund.reference, user: refund.payer?.ign || "Removed account", email: refund.payer?.email || "",
  competition: refund.payment?.serviceName || "—",
  type: refund.payment?.serviceType === "tournament" ? "Tournament" : refund.payment?.serviceType === "league" ? "League" : "Service",
  provider: refund.payment?.provider || "", currency: refund.payment?.currency || "NGN",
  originalAmount: refund.payment?.amount ?? 0, refundedAmount: refund.payment?.refundedAmount ?? 0,
  requestedAmount: refund.approvedAmount ?? refund.amountRequested, paymentRef: refund.payment?.reference || "",
  reason: refund.reason, status: STATUS_LABEL[refund.status], requestedAt: refund.requestedAt.slice(0, 10),
  providerRef: refund.providerReference || undefined,
  audit: refund.events.map(event => `${event.note || event.status.replace(/_/g, " ")} • ${new Date(event.at).toLocaleString("en-NG")}`),
});

const PAYOUT_LABEL: Record<ApiPayoutStatus, string> = {
  account_required: "Account required", awaiting_approval: "Awaiting approval", approved: "Approved", paid: "Paid", disqualified: "Disqualified",
};

const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
const typeLabel = (settlement: ApiSettlement): CompetitionType => (settlement.type === "league" ? "League" : "Tournament");
const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

type AccountDraft = { bankName: string; accountNumber: string; accountName: string };

export default function Finance() {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");
  const { toast } = useToast();
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [settlements, setSettlements] = useState<ApiSettlement[]>([]);
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [filter, setFilter] = useState<"All" | CompetitionType>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Record<string, AccountDraft>>({});
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  const loadRefunds = useCallback(async () => {
    try {
      const { refunds: list } = await api.get<{ refunds: ApiRefund[] }>("/admin/refunds");
      setRefunds(list.map(toRefundRequest));
    } catch (error) {
      toast({ title: "Could not load refunds", description: (error as Error).message, variant: "destructive" });
    }
  }, [toast]);
  const loadSettlements = useCallback(async () => {
    try {
      const { settlements: list } = await api.get<{ settlements: ApiSettlement[] }>("/admin/payouts");
      setSettlements(list);
    } catch (error) {
      toast({ title: "Could not load prize settlements", description: (error as Error).message, variant: "destructive" });
    }
  }, [toast]);
  useEffect(() => { loadRefunds(); }, [loadRefunds]);
  useEffect(() => { loadSettlements(); }, [loadSettlements]);
  useEffect(() => {
    api.get<{ payments: ApiPayment[] }>("/admin/payments?limit=1000").then(({ payments: list }) => setPayments(list)).catch(() => setPayments([]));
  }, [refunds]);

  const selected = settlements.find(item => item.id === selectedId);
  const filtered = useMemo(() => settlements.filter(item => filter === "All" || typeLabel(item) === filter), [settlements, filter]);
  const allPayouts = settlements.flatMap(item => item.payouts);
  const received = payments.filter(item => ["paid", "partially_refunded", "refunded"].includes(item.status)).reduce((sum, item) => sum + item.amount, 0);
  const refundedTotal = payments.reduce((sum, item) => sum + item.refundedAmount, 0);
  const paidPrizes = allPayouts.filter(item => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);

  const run = async (payout: ApiPayout, request: () => Promise<unknown>, done: string) => {
    setBusyId(payout.id);
    try {
      await request();
      setNotice(done);
      await loadSettlements();
    } catch (error) {
      toast({ title: "Could not update the prize", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusyId("");
    }
  };
  const act = (payout: ApiPayout, body: Record<string, string>, done: string) =>
    run(payout, () => api.patch(`/admin/payouts/${payout.id}`, body), done);

  const accountFor = (payout: ApiPayout) => accounts[payout.id] || { bankName: payout.bankName, accountNumber: payout.accountNumber, accountName: payout.accountName };
  const saveAccount = (payout: ApiPayout) => act(payout, { action: "account", ...accountFor(payout) }, `Account details saved for ${payout.payeeName}.`);
  const settle = (payout: ApiPayout) => {
    const reference = window.prompt(`Bank transfer reference for ${money(payout.amount)} to ${payout.payeeName}`)?.trim();
    if (reference) act(payout, { action: "settle", reference }, `${payout.payeeName} marked paid.`);
  };
  const disqualify = (payout: ApiPayout) => {
    const note = window.prompt(`Why is ${payout.payeeName}'s prize withheld? (kept on the record)`)?.trim();
    if (note) act(payout, { action: "disqualify", note }, `${payout.payeeName}'s prize is withheld.`);
  };
  const remind = (payout: ApiPayout) =>
    run(payout, () => api.post(`/admin/payouts/${payout.id}/remind`), `Payout account reminder sent to ${payout.payeeEmail || payout.payeeName}.`);

  const generate = async (settlement: ApiSettlement) => {
    const raw = window.prompt(`Prize pool to pay out for ${settlement.name} (${settlement.currency})`, settlement.prizePool ? String(settlement.prizePool) : "");
    if (raw === null) return;
    const pool = raw.replace(/[^\d.]/g, "");
    if (!pool) return;
    setBusyId(settlement.id);
    try {
      await api.post(`/admin/${settlement.type === "league" ? "leagues" : "tournaments"}/${settlement.id}/payouts`, { prizePool: pool });
      setNotice(`Prizes drawn up from the final placings and a ${money(Number(pool))} pool.`);
      await loadSettlements();
    } catch (error) {
      toast({ title: "Could not draw up prizes", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusyId("");
    }
  };

  const exportReport = () => {
    const header = ["Competition", "Type", "Place", "Payee", "Email", "Amount", "Currency", "Status", "Bank", "Account number", "Reference", "Paid at"];
    const rows = settlements.flatMap(settlement => settlement.payouts.map(payout => [settlement.name, typeLabel(settlement), payout.place, payout.payeeName,
      payout.payeeEmail, payout.amount, payout.currency, PAYOUT_LABEL[payout.status], payout.bankName, payout.accountNumber, payout.reference, payout.paidAt]));
    const blob = new Blob([[header, ...rows].map(row => row.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sca-prize-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const metrics = [
    { label: "Pending prize payments", value: money(allPayouts.filter(w => w.status !== "paid" && w.status !== "disqualified").reduce((sum, w) => sum + w.amount, 0)), note: "Admin approval required", icon: Clock3, tone: "text-amber-500" },
    { label: "Paid prizes", value: money(paidPrizes), note: "Manually confirmed settlements", icon: CheckCircle2, tone: "text-emerald-500" },
    { label: "Pending refunds", value: refunds.filter(r => ["Requested", "Under Review", "Approved", "Processing"].includes(r.status)).length.toString(), note: "Require review or processing", icon: RotateCcw, tone: "text-amber-500" },
    { label: "Approved refunds", value: refunds.filter(r => r.status === "Approved").length.toString(), note: "Ready to process", icon: UserRoundCheck, tone: "text-primary" },
    { label: "Completed refunds", value: refunds.filter(r => r.status === "Refunded").length.toString(), note: "Provider or manual reference saved", icon: CheckCircle2, tone: "text-emerald-500" },
    { label: "Failed refunds", value: refunds.filter(r => r.status === "Failed").length.toString(), note: "Review before retry", icon: ShieldAlert, tone: "text-destructive" },
  ];

  const prizeStatus = (settlement: ApiSettlement) => {
    if (!settlement.payouts.length) return settlement.decided ? "Ready" : "Awaiting results";
    if (settlement.payouts.every(payout => payout.status === "paid" || payout.status === "disqualified")) return "Settled";
    return "Processing";
  };
  const locked = (settlement: ApiSettlement) => settlement.payouts.some(payout => payout.status === "approved" || payout.status === "paid");

  return <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10"><div className="mx-auto max-w-[1600px]">
    <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="sca-eyebrow mb-3">Financial operations</p><h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Finance</h1><p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">Review competition winners and manually authorize every prize settlement.</p></div><button onClick={exportReport} disabled={!allPayouts.length} className="inline-flex h-12 items-center justify-center gap-2 border border-border bg-card px-5 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary disabled:opacity-50"><Download className="h-4 w-4" /> Export report</button></header>
    <nav className="flex gap-1 overflow-x-auto border-b border-border py-5">{([['overview','Overview'],['prizes','Prize payments'],['refunds','Refunds'],['transactions','Transactions']] as const).map(([value,label]) => <button key={value} onClick={() => setActiveTab(value)} className={`min-w-fit border-b-2 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] ${activeTab === value ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{label}</button>)}</nav>
    <main className="py-8">{activeTab === "overview" && <div className="space-y-7"><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(({label,value,note,icon:Icon,tone}) => <article key={label} className="border border-border bg-card p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p></div><span className={`flex h-11 w-11 items-center justify-center border border-border bg-background ${tone}`}><Icon className="h-5 w-5" /></span></div><p className={`mt-6 border-t border-border pt-4 text-xs font-semibold ${tone}`}>{note}</p></article>)}</section><section className="grid gap-4 lg:grid-cols-2"><button onClick={() => setActiveTab('prizes')} className="border border-border bg-card p-6 text-left hover:border-primary"><p className="sca-eyebrow">Prize disbursement</p><h2 className="mt-3 text-2xl font-semibold">Review winner settlements</h2><p className="mt-2 text-sm text-muted-foreground">Draw up prizes from final placings, collect accounts, approve, and settle.</p></button><button onClick={() => setActiveTab('refunds')} className="border border-border bg-card p-6 text-left hover:border-primary"><p className="sca-eyebrow">Refund operations</p><h2 className="mt-3 text-2xl font-semibold">Review refund requests</h2><p className="mt-2 text-sm text-muted-foreground">Validate eligibility, approve partial or full amounts, process, retry, and audit.</p></button></section></div>}{activeTab === "prizes" && <div className="space-y-7">
      {!selected ? <section className="grid gap-5 xl:grid-cols-[1.5fr_.7fr]"><article className="border border-border bg-card"><div className="flex flex-col gap-4 border-b border-border p-6 md:flex-row md:items-center md:justify-between"><div><p className="sca-eyebrow mb-2">Prize disbursement</p><h2 className="text-2xl font-semibold">Settlements by competition</h2><p className="mt-1 text-sm text-muted-foreground">Select a tournament or league to inspect its winners and approve payouts.</p></div><div className="flex gap-2">{(["All", "Tournament", "League"] as const).map(value => <button key={value} onClick={() => setFilter(value)} className={`border px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${filter === value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{value}</button>)}</div></div><div className="divide-y divide-border">{filtered.map(row => <button key={row.id} onClick={() => { setSelectedId(row.id); setNotice(""); }} className="grid w-full gap-3 p-5 text-left transition-colors hover:bg-secondary/30 md:grid-cols-[1.5fr_.7fr_.7fr_.7fr_auto] md:items-center"><div><p className="font-bold">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{typeLabel(row)} · {row.entrants} entrants</p></div><p className="text-sm font-bold text-primary">{row.prizePool ? money(row.prizePool) : "Pool not set"}</p><p className="text-sm text-muted-foreground">{row.payouts.length} winners</p><p className="text-sm text-muted-foreground">{prizeStatus(row)}</p><span className="border border-primary/30 px-3 py-1 text-[9px] font-bold uppercase text-primary">Review</span></button>)}{!filtered.length && <p className="p-8 text-center text-sm text-muted-foreground">Competitions appear here once their fixtures are generated.</p>}</div></article>
      <aside className="border border-border bg-card p-6"><p className="sca-eyebrow mb-2">Approval policy</p><h2 className="text-2xl font-semibold">Manual control</h2><div className="mt-6 space-y-4 text-sm text-muted-foreground"><p className="flex gap-3"><UserRoundCheck className="h-5 w-5 shrink-0 text-primary" />Only an administrator can approve or settle prize payments.</p><p className="flex gap-3"><ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />Withheld prizes keep their reason on record for audit purposes.</p><p className="flex gap-3"><WalletCards className="h-5 w-5 shrink-0 text-primary" />Account details are reviewed before settlement.</p></div></aside></section> : <section className="border border-border bg-card"><div className="flex flex-col gap-5 border-b border-border p-6 md:flex-row md:items-center md:justify-between"><div><button onClick={() => { setSelectedId(null); setNotice(""); }} className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary"><ArrowLeft className="h-4 w-4" /> Back to settlements</button><p className="sca-eyebrow mb-2">{typeLabel(selected)} settlement</p><h2 className="text-2xl font-semibold">{selected.name}</h2><p className="mt-2 text-sm text-muted-foreground">{selected.prizePool ? `${money(selected.prizePool)} prize pool` : "Prize pool not set"} · split {selected.allocations.length ? selected.allocations.map(value => `${value}%`).join(" / ") : "not set"}</p></div><div className="flex flex-col items-end gap-2"><button disabled={!selected.decided || locked(selected) || !selected.allocations.length || busyId === selected.id} onClick={() => generate(selected)} className="h-11 bg-primary px-5 text-xs font-bold uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">{selected.payouts.length ? "Redraw prizes" : "Draw up prizes"}</button><p className="max-w-xs text-right text-[11px] text-muted-foreground">{!selected.decided ? "Waiting for verified results to decide the winners." : !selected.allocations.length ? "Set the prize split in the competition workspace first." : locked(selected) ? "Prizes are approved or paid, so the list is fixed." : "Prizes follow the final placings; joint places split their share."}</p></div></div>{notice && <p className="border-b border-primary/20 bg-primary/5 px-6 py-3 text-sm text-primary">{notice}</p>}<div className="divide-y divide-border">{selected.payouts.map(winner => { const account = accountFor(winner); const editable = winner.status === "account_required" || winner.status === "awaiting_approval"; return <article key={winner.id} className="grid gap-5 p-6 xl:grid-cols-[90px_1.3fr_1fr_.7fr] xl:items-start"><div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Position</p><p className="mt-2 text-3xl font-semibold text-primary">#{winner.place}</p></div><div><h3 className="text-lg font-bold">{winner.payeeName}</h3><p className="mt-1 text-sm text-muted-foreground">{winner.payeeEmail || "No account email"}</p><p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bank account</p><p className="mt-1 text-sm">{winner.accountNumber ? `${winner.bankName} · ${winner.accountNumber} · ${winner.accountName}` : "No payout account supplied"}</p>{winner.reference && <p className="mt-1 text-xs text-muted-foreground">Transfer reference {winner.reference}</p>}{winner.note && <p className="mt-1 text-xs text-destructive">Withheld: {winner.note}</p>}<button disabled={busyId === winner.id} onClick={() => remind(winner)} className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary disabled:opacity-50"><BellRing className="h-4 w-4" /> Ping user</button></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payout account</p>{editable ? <div className="mt-2 grid gap-2">{([["bankName", "Bank"], ["accountNumber", "Account number"], ["accountName", "Account name"]] as const).map(([field, placeholder]) => <input key={field} value={account[field]} onChange={event => setAccounts(values => ({ ...values, [winner.id]: { ...account, [field]: event.target.value } }))} placeholder={placeholder} className="h-10 min-w-0 border border-border bg-background px-3 text-sm outline-none focus:border-primary" />)}<button disabled={busyId === winner.id} onClick={() => saveAccount(winner)} className="h-10 border border-border px-3 text-xs font-bold uppercase hover:text-primary disabled:opacity-50">Save account</button></div> : <p className="mt-2 text-sm text-muted-foreground">{winner.status === "disqualified" ? "Reinstate the prize to edit its account." : "Fixed once approved."}</p>}{winner.status === "disqualified" ? <button disabled={busyId === winner.id} onClick={() => act(winner, { action: "reinstate" }, `${winner.payeeName}'s prize is reinstated.`)} className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">Reinstate prize</button> : winner.status !== "paid" && <button disabled={busyId === winner.id} onClick={() => disqualify(winner)} className="mt-3 text-xs font-bold uppercase tracking-wider text-destructive">Disqualify winner</button>}</div><div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payout</p><p className="mt-2 text-xl font-bold">{money(winner.amount)}</p><span className={`mt-3 inline-block border px-2 py-1 text-[9px] font-bold uppercase ${winner.status === "paid" ? "border-emerald-500/30 text-emerald-500" : winner.status === "disqualified" ? "border-destructive/30 text-destructive" : "border-amber-500/30 text-amber-500"}`}>{PAYOUT_LABEL[winner.status]}</span><div className="mt-4 grid gap-2"><button disabled={winner.status !== "awaiting_approval" || busyId === winner.id} onClick={() => act(winner, { action: "approve" }, `${winner.payeeName}'s prize is approved.`)} className="h-10 bg-primary px-3 text-xs font-bold uppercase text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Approve payment</button><button disabled={winner.status !== "approved" || busyId === winner.id} onClick={() => settle(winner)} className="h-10 border border-border px-3 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40">Mark settled</button></div></div></article>; })}{!selected.payouts.length && <p className="p-8 text-center text-sm text-muted-foreground">No prizes drawn up yet.</p>}</div></section>}
      <section className="grid gap-4 sm:grid-cols-3"><div className="flex items-center gap-4 border border-border bg-card p-5"><ArrowDownLeft className="h-5 w-5 text-emerald-500"/><div><p className="text-xs text-muted-foreground">Money received</p><p className="font-bold">{money(received)}</p></div></div><div className="flex items-center gap-4 border border-border bg-card p-5"><ArrowUpRight className="h-5 w-5 text-rose-500"/><div><p className="text-xs text-muted-foreground">Payouts and refunds sent</p><p className="font-bold">{money(paidPrizes + refundedTotal)}</p></div></div><div className="border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Net movement</p><p className="mt-1 text-xl font-bold text-primary">{received - paidPrizes - refundedTotal >= 0 ? "+" : ""}{money(received - paidPrizes - refundedTotal)}</p></div></section>
    </div>}{activeTab === "refunds" && <RefundsTab items={refunds} onChanged={loadRefunds} />}{activeTab === "transactions" && <TransactionsTab onRefundRequested={loadRefunds} />}</main>
  </div></div>;
}
