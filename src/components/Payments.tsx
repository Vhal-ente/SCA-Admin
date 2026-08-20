import { useState } from "react";
import { Activity, ArrowUpRight, Building2, Copy, Eye, EyeOff, LockKeyhole, Save, Terminal } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const inputClass = "h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";

export default function PaymentsTab() {
  const [showSecret, setShowSecret] = useState(false);
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <section className="border border-border bg-card">
        <div className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary"><Building2 className="h-6 w-6" /></div><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Payment gateway</p><h2 className="mt-1 text-2xl font-semibold text-foreground">Paystack integration</h2><p className="text-sm text-muted-foreground">Collections, entry fees, and payouts.</p></div></div>
          <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground"><span>{enabled ? "Enabled" : "Disabled"}</span><Switch checked={enabled} onCheckedChange={setEnabled} /></label>
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="space-y-6 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Public key</span><input className={inputClass} placeholder="pk_live_xxxxxxxxxxxxxxxxx" /></label>
            <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Secret key</span><div className="relative"><input type={showSecret ? "text" : "password"} className={`${inputClass} pr-12`} placeholder="sk_live_xxxxxxxxxxxxxxxxx" /><button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
          </div>
          <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Webhook URL</span><div className="relative"><input className={`${inputClass} pr-12 font-mono`} placeholder="https://api.sca.gg/webhooks/paystack" /><Copy className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /></div></label>
          <div className="grid gap-5 md:grid-cols-3">
            <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Default currency</span><select className={`theme-native-select ${inputClass}`}><option>NGN — Nigerian Naira</option><option>USD — US Dollar</option></select></label>
            <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Payout schedule</span><select className={`theme-native-select ${inputClass}`}><option>Manual approval</option><option>Weekly</option><option>Monthly</option></select></label>
            <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Minimum payout</span><input className={inputClass} placeholder="₦10,000" /></label>
          </div>
          <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4 text-primary" /> Credentials are encrypted at rest.</p><div className="flex gap-3"><button className="h-11 border border-border px-5 text-sm font-bold uppercase tracking-wide text-foreground">Test connection</button><button className="flex h-11 items-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-wide text-primary-foreground"><Save className="h-4 w-4" /> Save settings</button></div></div>
        </form>
      </section>

      <div className="space-y-6">
        <section className="border border-border bg-card p-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Integration health</p><div className="mt-5 divide-y divide-border"><div className="flex items-center justify-between py-4"><span className="text-sm text-muted-foreground">API status</span><span className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400"><Activity className="h-4 w-4" /> Operational</span></div><div className="flex justify-between py-4 text-sm"><span className="text-muted-foreground">Last payout</span><span className="font-semibold text-foreground">2 hours ago</span></div><div className="flex justify-between py-4 text-sm"><span className="text-muted-foreground">Settlement account</span><span className="font-semibold text-foreground">•••• 8821</span></div></div></section>
        <section className="border border-border bg-card p-6"><div className="flex h-28 items-center justify-center border border-dashed border-border bg-background/40 text-center font-mono text-xs text-muted-foreground"><Terminal className="mr-3 h-6 w-6 text-primary" /> WEBHOOK_RECEIVED<br />charge.success · 200 OK</div><h3 className="mt-5 text-lg font-semibold text-foreground">Developer logs</h3><p className="mt-1 text-sm text-muted-foreground">Inspect gateway callbacks and failed events.</p><button className="mt-5 flex h-11 w-full items-center justify-center gap-2 border border-border text-sm font-bold uppercase tracking-wide text-foreground">View logs <ArrowUpRight className="h-4 w-4" /></button></section>
      </div>
    </div>
  );
}
