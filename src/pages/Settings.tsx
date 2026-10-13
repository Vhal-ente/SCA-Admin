import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Mail, Palette, Save, Upload } from "lucide-react";
import { applyBrandColor, DEFAULT_BRAND_COLOR, getSavedBrandColor, normalizeHexColor, saveBrandColor } from "@/lib/brand-theme";
import { StaffAccess } from "@/components/StaffAccess";

const fieldClass = "h-12 rounded-sm border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary";
const cardClass = "rounded-sm border border-border bg-card";

function SectionHeader({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: typeof Building2 }) {
  return <div className="flex items-start gap-4 border-b border-border p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div><p className="sca-eyebrow mb-1">{eyebrow}</p><h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>;
}

function SaveBar({ message, onSave }: { message: string; onSave?: () => void }) {
  const [saved, setSaved] = useState(false);
  return <div className="flex flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground" role="status">{saved ? "Changes saved successfully." : message}</p><Button onClick={() => { onSave?.(); setSaved(true); }} className="h-11 rounded-sm bg-primary px-6 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"><Save className="mr-2 h-4 w-4" />Save changes</Button></div>;
}

const Settings = () => {
  const [brandColor, setBrandColor] = useState(getSavedBrandColor);
  const [brandColorError, setBrandColorError] = useState("");
  const previewBrandColor = (value: string) => {
    setBrandColor(value.toUpperCase());
    const normalized = normalizeHexColor(value);
    setBrandColorError(normalized ? "" : "Enter a valid 3 or 6 digit hex color.");
    if (normalized) applyBrandColor(normalized);
  };

  const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground";
  const notificationRows: [string, string, boolean][] = [
    ["Tournament updates", "Notify registered participants when tournament details change.", true],
    ["Match reminders", "Send reminders before scheduled matches begin.", true],
    ["Payment notifications", "Notify users about entry fees, refunds, and prize payouts.", true],
    ["News & updates", "Send product news and community announcements.", false],
  ];

  return <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10"><div className="mx-auto max-w-[1600px]">
    <header className="border-b border-border pb-7"><p className="sca-eyebrow mb-2">System configuration</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Manage the SCA platform identity, communications, and access controls.</p></header>

    <Tabs defaultValue="platform" className="mt-7 space-y-7">
      <div className="overflow-x-auto border-b border-border"><TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">{[["platform", "Platform settings"], ["notifications", "Email & notifications"], ["permissions", "Permissions & roles"]].map(([value, label]) => <TabsTrigger key={value} value={value} className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">{label}</TabsTrigger>)}</TabsList></div>

      <TabsContent value="platform" className="space-y-6">
        <section className={cardClass}><SectionHeader eyebrow="Public content" title="Platform information" description="Update the core copy displayed across the SCA website." icon={Building2} /><div className="grid gap-5 p-6 md:grid-cols-2">
          <label className="md:col-span-2"><Label htmlFor="hero-text" className={labelClass}>Hero text</Label><Input id="hero-text" defaultValue="Compete. Conquer. Make history." className={fieldClass} /></label>
          <label className="md:col-span-2"><Label htmlFor="description" className={labelClass}>Description</Label><Input id="description" defaultValue="The home of competitive gaming, tournaments, leagues, and communities." className={fieldClass} /></label>
          <label className="md:col-span-2"><Label htmlFor="about-us" className={labelClass}>About SCA</Label><Textarea id="about-us" defaultValue="SCA brings players, teams, organizers, and brands together through well-run competitions built around fair play and strong communities." rows={5} className="rounded-sm border-border bg-background text-foreground focus-visible:border-primary focus-visible:ring-primary" /></label>
        </div></section>

        <section className={cardClass}><SectionHeader eyebrow="Visual identity" title="Branding" description="Manage the assets and primary color used across the platform." icon={Palette} /><div className="grid gap-5 p-6 lg:grid-cols-2">
          {[{ label: "Platform logo", ratio: "aspect-square", help: "SVG or transparent PNG" }, { label: "Default hero banner", ratio: "aspect-[16/7]", help: "Recommended 1920 × 840px" }].map(item => <div key={item.label} className="border border-border bg-background p-4"><Label className={labelClass}>{item.label}</Label><button type="button" className={`group flex ${item.ratio} max-h-44 w-full flex-col items-center justify-center border border-dashed border-border bg-secondary/30 text-center hover:border-primary hover:bg-primary/5`}><Upload className="mb-3 h-6 w-6 text-primary" /><span className="text-sm font-bold text-foreground">Upload {item.label.toLowerCase()}</span><span className="mt-1 text-xs text-muted-foreground">{item.help}</span></button></div>)}
          <label className="lg:col-span-2"><Label htmlFor="primary-color" className={labelClass}>Primary brand color</Label><div className="flex gap-3"><Input id="primary-color" aria-label="Choose primary brand color" type="color" className="h-12 w-16 cursor-pointer rounded-sm border-border bg-background p-1" value={normalizeHexColor(brandColor) ?? DEFAULT_BRAND_COLOR} onChange={event => previewBrandColor(event.target.value)} /><Input aria-label="Primary brand color hex value" value={brandColor} onChange={event => previewBrandColor(event.target.value)} className={`${fieldClass} flex-1 font-mono uppercase`} aria-invalid={Boolean(brandColorError)} /></div><span className={`mt-2 block text-xs ${brandColorError ? "text-destructive" : "text-muted-foreground"}`}>{brandColorError || "Preview updates instantly across the website. Save changes to keep this color."}</span></label>
        </div><SaveBar message="These changes affect the public website and admin experience." onSave={() => { const saved = saveBrandColor(brandColor); if (saved) setBrandColor(saved); }} /></section>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <section className={cardClass}><SectionHeader eyebrow="Email delivery" title="Sender configuration" description="Configure the service and identity used for platform email." icon={Mail} /><div className="grid gap-5 p-6 md:grid-cols-2">
          <label className="md:col-span-2"><Label htmlFor="smtp-host" className={labelClass}>SMTP host</Label><Input id="smtp-host" placeholder="smtp.example.com" className={fieldClass} /></label>
          <label><Label htmlFor="smtp-port" className={labelClass}>SMTP port</Label><Input id="smtp-port" placeholder="587" type="number" className={fieldClass} /></label>
          <label><Label htmlFor="smtp-username" className={labelClass}>Username</Label><Input id="smtp-username" placeholder="email@sca.gg" className={fieldClass} /></label>
          <label><Label htmlFor="from-email" className={labelClass}>From email</Label><Input id="from-email" placeholder="noreply@sca.gg" type="email" className={fieldClass} /></label>
          <label><Label htmlFor="from-name" className={labelClass}>From name</Label><Input id="from-name" defaultValue="Short Circuit Arena" className={fieldClass} /></label>
        </div></section>
        <section className={cardClass}><SectionHeader eyebrow="Messaging rules" title="Notification preferences" description="Choose which platform events produce user notifications." icon={Mail} /><div className="divide-y divide-border px-6">{notificationRows.map(([title, description, enabled]) => <div key={title} className="flex items-center justify-between gap-5 py-5"><div><p className="text-sm font-bold text-foreground">{title}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><Switch defaultChecked={enabled} /></div>)}</div><SaveBar message="Notification changes apply to future messages." /></section>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-6">
        <StaffAccess />
      </TabsContent>
    </Tabs>
  </div></div>;
};

export default Settings;
