import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle2, Mail, Palette, Save, Send, Upload, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, uploadFile, type EmailSettings } from "@/lib/api";
import { applyBrandColor, DEFAULT_BRAND_COLOR, getSavedBrandColor, normalizeHexColor, saveBrandColor } from "@/lib/brand-theme";
import { StaffAccess } from "@/components/StaffAccess";

// Platform is the console's "platform" settings document. The site reads
// everything but the notification switches, which stay staff-only.
type Platform = {
  heroText: string;
  description: string;
  about: string;
  logoUrl: string;
  heroBannerUrl: string;
  brandColor: string;
  notifications: Record<string, boolean>;
};

const defaults: Platform = {
  heroText: "", description: "", about: "", logoUrl: "", heroBannerUrl: "", brandColor: DEFAULT_BRAND_COLOR,
  notifications: { tournamentUpdates: true, matchReminders: true, payments: true, news: false },
};

const notificationRows: [string, string, string][] = [
  ["tournamentUpdates", "Tournament updates", "Registration confirmations and competition updates for entrants."],
  ["matchReminders", "Match reminders", "Reminders before scheduled matches begin."],
  ["payments", "Payment notifications", "Entry-fee receipts, refunds, and prize payouts."],
  ["news", "News & updates", "Product news and community announcements."],
];

const fieldClass = "h-12 rounded-sm border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary";
const cardClass = "rounded-sm border border-border bg-card";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground";

function SectionHeader({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: typeof Building2 }) {
  return <div className="flex items-start gap-4 border-b border-border p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div><p className="sca-eyebrow mb-1">{eyebrow}</p><h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>;
}

function SaveBar({ message, onSave, saving }: { message: string; onSave: () => void; saving: boolean }) {
  return <div className="flex flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground" role="status">{message}</p><Button onClick={onSave} disabled={saving} className="h-11 rounded-sm bg-primary px-6 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"><Save className="mr-2 h-4 w-4" />{saving ? "Saving…" : "Save changes"}</Button></div>;
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return <div><p className={labelClass}>{label}</p><p className="min-h-6 font-mono text-sm text-foreground">{value || "—"}</p></div>;
}

const Settings = () => {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<Platform>({ ...defaults, brandColor: getSavedBrandColor() });
  const [brandColorError, setBrandColorError] = useState("");
  const [email, setEmail] = useState<EmailSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    api.get<{ value: Partial<Platform> }>("/admin/content/platform").then(({ value }) => {
      setPlatform((current) => ({ ...current, ...value, notifications: { ...defaults.notifications, ...value.notifications } }));
      if (value.brandColor) saveBrandColor(value.brandColor);
    }).catch((error) => toast({ title: "Could not load settings", description: (error as Error).message, variant: "destructive" }));
    api.get<EmailSettings>("/admin/settings/email").then(setEmail).catch(() => setEmail(null));
  }, [toast]);

  const set = (key: keyof Platform) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setPlatform((current) => ({ ...current, [key]: event.target.value }));
  const previewBrandColor = (value: string) => {
    setPlatform((current) => ({ ...current, brandColor: value.toUpperCase() }));
    const normalized = normalizeHexColor(value);
    setBrandColorError(normalized ? "" : "Enter a valid 3 or 6 digit hex color.");
    if (normalized) applyBrandColor(normalized);
  };
  const upload = async (key: "logoUrl" | "heroBannerUrl", file?: File) => {
    if (!file) return;
    setUploading(key);
    try { const { url } = await uploadFile(file); setPlatform((current) => ({ ...current, [key]: url })); }
    catch (error) { toast({ title: "Upload failed", description: (error as Error).message, variant: "destructive" }); }
    finally { setUploading(""); }
  };
  const save = async (title: string) => {
    const brandColor = normalizeHexColor(platform.brandColor);
    if (!brandColor) { toast({ title: "Fix the brand color first", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await api.put("/admin/content/platform", { value: { ...platform, brandColor } });
      saveBrandColor(brandColor);
      toast({ title });
    } catch (error) {
      toast({ title: "Could not save", description: (error as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };
  const sendTest = async () => {
    setTesting(true);
    try { const { to } = await api.post<{ to: string }>("/admin/settings/email/test"); toast({ title: "Test email sent", description: `Check the inbox for ${to}.` }); }
    catch (error) { toast({ title: "Test email failed", description: (error as Error).message, variant: "destructive" }); }
    finally { setTesting(false); }
  };

  return <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10"><div className="mx-auto max-w-[1600px]">
    <header className="border-b border-border pb-7"><p className="sca-eyebrow mb-2">System configuration</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Manage the SCA platform identity, communications, and access controls.</p></header>

    <Tabs defaultValue="platform" className="mt-7 space-y-7">
      <div className="overflow-x-auto border-b border-border"><TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">{[["platform", "Platform settings"], ["notifications", "Email & notifications"], ["permissions", "Permissions & roles"]].map(([value, label]) => <TabsTrigger key={value} value={value} className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">{label}</TabsTrigger>)}</TabsList></div>

      <TabsContent value="platform" className="space-y-6">
        <section className={cardClass}><SectionHeader eyebrow="Public content" title="Platform information" description="The core copy on the website's landing page. Leave a field empty to keep the built-in text." icon={Building2} /><div className="grid gap-5 p-6 md:grid-cols-2">
          <label className="md:col-span-2"><Label htmlFor="hero-text" className={labelClass}>Hero text</Label><Input id="hero-text" value={platform.heroText} onChange={set("heroText")} placeholder="Compete. Conquer. Make history." maxLength={80} className={fieldClass} /></label>
          <label className="md:col-span-2"><Label htmlFor="description" className={labelClass}>Description</Label><Input id="description" value={platform.description} onChange={set("description")} placeholder="SCA hosts online tournaments and leagues…" maxLength={240} className={fieldClass} /></label>
          <label className="md:col-span-2"><Label htmlFor="about-us" className={labelClass}>About SCA</Label><Textarea id="about-us" value={platform.about} onChange={set("about")} placeholder="SCA brings players, teams, organizers, and brands together…" rows={5} maxLength={800} className="rounded-sm border-border bg-background text-foreground focus-visible:border-primary focus-visible:ring-primary" /></label>
        </div><SaveBar message="These changes appear on the public website." onSave={() => save("Platform information saved")} saving={saving} /></section>

        <section className={cardClass}><SectionHeader eyebrow="Visual identity" title="Branding" description="Manage the assets and primary color used across the platform." icon={Palette} /><div className="grid gap-5 p-6 lg:grid-cols-2">
          {([{ key: "logoUrl", label: "Platform logo", ratio: "aspect-square", help: "SVG or transparent PNG" }, { key: "heroBannerUrl", label: "Default hero banner", ratio: "aspect-[16/7]", help: "Recommended 1920 × 840px" }] as const).map((item) => <div key={item.key} className="border border-border bg-background p-4">
            <Label className={labelClass}>{item.label}</Label>
            <label className={`group flex ${item.ratio} max-h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-border bg-secondary/30 text-center hover:border-primary hover:bg-primary/5`}>
              {platform[item.key] ? <img src={platform[item.key]} alt="" className="h-full w-full object-contain" /> : <><Upload className="mb-3 h-6 w-6 text-primary" /><span className="text-sm font-bold text-foreground">{uploading === item.key ? "Uploading…" : `Upload ${item.label.toLowerCase()}`}</span><span className="mt-1 text-xs text-muted-foreground">{item.help}</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => upload(item.key, event.target.files?.[0])} />
            </label>
            {platform[item.key] && <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setPlatform((current) => ({ ...current, [item.key]: "" }))}>Remove</Button>}
          </div>)}
          <label className="lg:col-span-2"><Label htmlFor="primary-color" className={labelClass}>Primary brand color</Label><div className="flex gap-3"><Input id="primary-color" aria-label="Choose primary brand color" type="color" className="h-12 w-16 cursor-pointer rounded-sm border-border bg-background p-1" value={normalizeHexColor(platform.brandColor) ?? DEFAULT_BRAND_COLOR} onChange={(event) => previewBrandColor(event.target.value)} /><Input aria-label="Primary brand color hex value" value={platform.brandColor} onChange={(event) => previewBrandColor(event.target.value)} className={`${fieldClass} flex-1 font-mono uppercase`} aria-invalid={Boolean(brandColorError)} /></div><span className={`mt-2 block text-xs ${brandColorError ? "text-destructive" : "text-muted-foreground"}`}>{brandColorError || "Previews here instantly. Save to apply it to the console and the public website."}</span></label>
        </div><SaveBar message="These changes affect the public website and admin experience." onSave={() => save("Branding saved")} saving={saving} /></section>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <section className={cardClass}><SectionHeader eyebrow="Email delivery" title="Sender configuration" description="Platform email is sent through the SMTP server set in the API's environment. Credentials never leave the server." icon={Mail} /><div className="space-y-6 p-6">
          {email === null ? <p className="text-sm text-muted-foreground">Loading email settings…</p> : <>
            <div className={`flex items-start gap-3 border p-4 ${email.configured ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
              {email.configured ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" /> : <XCircle className="h-5 w-5 shrink-0 text-amber-500" />}
              <div><p className="text-sm font-bold text-foreground">{email.configured ? "Email is configured" : "Email is not configured"}</p><p className="mt-1 text-xs text-muted-foreground">{email.configured ? "Password resets, receipts, and notifications are being sent." : "Set SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, and MAIL_FROM_EMAIL on the API server and restart it. Until then, emails are written to the server log."}</p></div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <ConfigRow label="SMTP host" value={email.host} />
              <ConfigRow label="Port / security" value={email.host ? `${email.port} · ${email.security}` : ""} />
              <ConfigRow label="Username" value={email.username} />
              <ConfigRow label="From email" value={email.fromEmail} />
              <ConfigRow label="From name" value={email.fromName} />
              <ConfigRow label="Reply-to" value={email.replyTo} />
            </div>
            <Button onClick={sendTest} disabled={!email.configured || testing} variant="outline" className="h-11 gap-2 rounded-sm text-xs font-bold uppercase tracking-wider"><Send className="h-4 w-4" />{testing ? "Sending…" : "Send test email to me"}</Button>
          </>}
        </div></section>
        <section className={cardClass}><SectionHeader eyebrow="Messaging rules" title="Notification preferences" description="Choose which platform events also send email. Players always get the in-app notification, and security emails such as password resets are always sent." icon={Mail} />
          <div className="divide-y divide-border px-6">{notificationRows.map(([key, title, description]) => <div key={key} className="flex items-center justify-between gap-5 py-5"><div><p className="text-sm font-bold text-foreground">{title}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><Switch checked={platform.notifications[key] ?? false} onCheckedChange={(checked) => setPlatform((current) => ({ ...current, notifications: { ...current.notifications, [key]: checked } }))} /></div>)}</div>
          <SaveBar message="Notification changes apply to future messages." onSave={() => save("Notification preferences saved")} saving={saving} />
        </section>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-6">
        <StaffAccess />
      </TabsContent>
    </Tabs>
  </div></div>;
};

export default Settings;
