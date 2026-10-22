import { useEffect, useState } from "react";
import { Activity, Award, CalendarDays, Eye, EyeOff, GalleryHorizontal, ImagePlus, Link2, Pencil, Plus, Save, Shield, Trash2, Trophy, UserPlus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api, uploadFile, type AdminUser } from "@/lib/api";
import { useSiteContent } from "@/hooks/use-site-content";

type Visibility = "Published" | "Draft" | "Hidden";
type Item = { id: number; title: string; detail: string; status: Visibility; imageUrl?: string };
type ClanEvent = Item;
// A roster keeps the player's account id with their name, so the public page can show it.
type RosterEntry = { playerId: string; ign: string; name: string; role: "Captain" | "Starter" | "Substitute" | "Coach" };
type Social = { Instagram: string; YouTube: string; TikTok: string; Discord: string };
type ShogunDoc = { live: boolean; applications: boolean; hero: { title: string; copy: string; cta: string }; events: ClanEvent[]; teams: Division[]; sponsors: Item[]; achievements: Item[]; gallery: Item[]; social: Social };

const defaultShogun: ShogunDoc = {
  live: true, applications: true,
  hero: { title: "Built for battle. Bound by honor.", copy: "The official competitive home of Shogun Clan.", cta: "Join the Shogunate" },
  events: [], teams: [], sponsors: [], achievements: [], gallery: [],
  social: { Instagram: "", YouTube: "", TikTok: "", Discord: "" },
};
type Division = Item & { roster: RosterEntry[] };
const tabItems = [["overview","Overview"],["content","Page Content"],["events","Events"],["teams","Teams & Rosters"],["sponsors","Sponsors"],["achievements","Achievements"],["gallery","Gallery"],["social","Social Links"],["settings","Settings"]] as const;
const tone: Record<Visibility,string> = { Published:"border-emerald-500/30 bg-emerald-500/10 text-emerald-400", Draft:"border-amber-500/30 bg-amber-500/10 text-amber-400", Hidden:"border-border bg-muted text-muted-foreground" };

function Heading({ eyebrow, title, copy, action }: { eyebrow:string; title:string; copy:string; action?:React.ReactNode }) {
  return <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-primary">{eyebrow}</p><h2 className="text-2xl font-semibold md:text-3xl">{title}</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{copy}</p></div>{action}</div>;
}

function Manager({ title, copy, icon:Icon, items, setItems, enableImage = false, imageLabel = "Image" }: { title:string; copy:string; icon:typeof Trophy; items:Item[]; setItems:React.Dispatch<React.SetStateAction<Item[]>>; enableImage?: boolean; imageLabel?: string }) {
  const [edit,setEdit] = useState<Item|null>(null); const { toast } = useToast();
  const open = (item?:Item) => setEdit(item ? { ...item } : { id:Date.now(), title:"", detail:"", status:"Draft", imageUrl:"" });
  const chooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !edit) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Choose an image file", description: "PNG, JPG and WebP files are supported.", variant: "destructive" });
      return;
    }
    // The image is stored on the API; the page keeps its link.
    uploadFile(file)
      .then(({ url }) => setEdit(current => current ? { ...current, imageUrl: url } : current))
      .catch(error => toast({ title: "Upload failed", description: (error as Error).message, variant: "destructive" }));
  };
  const save = () => { if (!edit?.title.trim()) return; setItems(old => old.some(x=>x.id===edit.id) ? old.map(x=>x.id===edit.id?edit:x) : [...old,edit]); setEdit(null); toast({title:`${title} updated`}); };
  return <div className="space-y-6"><Heading eyebrow="Shogun operations" title={title} copy={copy} action={<Button onClick={()=>open()} className="gap-2"><Plus className="h-4 w-4"/>Add new</Button>}/><div className="grid gap-4 lg:grid-cols-2">{items.map(item=><Card key={item.id} className="rounded-sm border-border bg-card p-5"><div className="flex gap-4">{enableImage && item.imageUrl ? <div className="grid h-16 w-24 shrink-0 place-items-center border border-border bg-background p-2"><img src={item.imageUrl} alt={`${item.title} sponsor logo`} className="h-full w-full object-contain"/></div> : <div className="grid h-11 w-11 shrink-0 place-items-center bg-primary/10 text-primary"><Icon className="h-5 w-5"/></div>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{item.title}</h3><Badge variant="outline" className={tone[item.status]}>{item.status}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{item.detail}</p></div></div><div className="mt-5 flex gap-2 border-t border-border pt-4"><Button variant="outline" className="flex-1 gap-2" onClick={()=>open(item)}><Pencil className="h-4 w-4"/>Edit</Button><Button variant="outline" size="icon" className="text-destructive" onClick={()=>setItems(old=>old.filter(x=>x.id!==item.id))}><Trash2 className="h-4 w-4"/></Button></div></Card>)}</div>
  <Dialog open={!!edit} onOpenChange={v=>!v&&setEdit(null)}><DialogContent className="max-h-[90vh] overflow-y-auto rounded-sm sm:max-w-xl"><DialogHeader><DialogTitle>Manage {title.toLowerCase()}</DialogTitle><DialogDescription>Update this public Shogun record.</DialogDescription></DialogHeader>{edit&&<div className="space-y-4">{enableImage&&<div><Label>{imageLabel}</Label>{edit.imageUrl?<div className="mt-2 space-y-3"><div className="grid min-h-32 place-items-center border border-border bg-background p-5"><img src={edit.imageUrl} alt={`${edit.title || "Sponsor"} preview`} className="max-h-28 max-w-full object-contain"/></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline" className="gap-2"><label className="cursor-pointer"><ImagePlus className="h-4 w-4"/>Replace image<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={chooseImage}/></label></Button><Button type="button" variant="outline" className="gap-2 text-destructive" onClick={()=>setEdit({...edit,imageUrl:""})}><Trash2 className="h-4 w-4"/>Remove</Button></div></div>:<label className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary"><ImagePlus className="h-6 w-6 text-primary"/><span className="font-medium">Upload sponsor image</span><span className="text-xs text-muted-foreground">PNG, JPG or WebP up to 5 MB</span><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={chooseImage}/></label>}</div>}<div><Label>Name</Label><Input className="mt-2" value={edit.title} onChange={e=>setEdit({...edit,title:e.target.value})}/></div><div><Label>Details</Label><Textarea className="mt-2" value={edit.detail} onChange={e=>setEdit({...edit,detail:e.target.value})}/></div><div><Label>Visibility</Label><Select value={edit.status} onValueChange={(status:Visibility)=>setEdit({...edit,status})}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Published">Published</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Hidden">Hidden</SelectItem></SelectContent></Select></div></div>}<DialogFooter><Button variant="outline" onClick={()=>setEdit(null)}>Cancel</Button><Button onClick={save}>Save record</Button></DialogFooter></DialogContent></Dialog></div>;
}

function EventManager({ items, setItems }: { items: ClanEvent[]; setItems: React.Dispatch<React.SetStateAction<ClanEvent[]>> }) {
  const [edit, setEdit] = useState<ClanEvent | null>(null);
  const { toast } = useToast();
  const open = (item?: ClanEvent) => setEdit(item ? { ...item } : { id: Date.now(), title: "", detail: "", status: "Draft", imageUrl: "" });
  const chooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !edit) return;
    // The image is stored on the API; the page keeps its link.
    uploadFile(file)
      .then(({ url }) => setEdit(current => current ? { ...current, imageUrl: url } : current))
      .catch(error => toast({ title: "Upload failed", description: (error as Error).message, variant: "destructive" }));
  };
  const save = () => {
    if (!edit?.title.trim()) return;
    setItems(old => old.some(item => item.id === edit.id) ? old.map(item => item.id === edit.id ? edit : item) : [...old, edit]);
    setEdit(null);
    toast({ title: "Clan event saved", description: "The event image and details are ready for the public Shogun page." });
  };

  return <div className="space-y-6">
    <Heading eyebrow="Shogun operations" title="Clan events" copy="Publish image-led trials, scrims, appearances and community events." action={<Button onClick={() => open()} className="gap-2"><Plus className="h-4 w-4"/>Add event</Button>}/>
    <div className="grid gap-5 lg:grid-cols-2">{items.map(item => <Card key={item.id} className="overflow-hidden rounded-sm border-border bg-card">
      <div className="aspect-[16/8] border-b border-border bg-background">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-muted-foreground"><div className="text-center"><ImagePlus className="mx-auto h-8 w-8 text-primary"/><p className="mt-2 text-sm">No event image</p></div></div>}</div>
      <div className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-semibold">{item.title}</h3><Badge variant="outline" className={tone[item.status]}>{item.status}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{item.detail}</p><div className="mt-5 flex gap-2 border-t border-border pt-4"><Button variant="outline" className="flex-1 gap-2" onClick={() => open(item)}><Pencil className="h-4 w-4"/>Edit event</Button><Button variant="outline" size="icon" className="text-destructive" onClick={() => setItems(old => old.filter(entry => entry.id !== item.id))}><Trash2 className="h-4 w-4"/></Button></div></div>
    </Card>)}</div>
    <Dialog open={!!edit} onOpenChange={value => !value && setEdit(null)}><DialogContent className="max-h-[90vh] overflow-y-auto rounded-sm sm:max-w-2xl"><DialogHeader><DialogTitle>{items.some(item => item.id === edit?.id) ? "Edit Shogun event" : "Create Shogun event"}</DialogTitle><DialogDescription>Add the cover image used on event cards and the public event detail view.</DialogDescription></DialogHeader>{edit && <div className="space-y-5">
      <div><Label>Event image</Label><div className="mt-2 overflow-hidden border border-border bg-background">{edit.imageUrl ? <img src={edit.imageUrl} alt="Event preview" className="aspect-video w-full object-cover"/> : <div className="grid aspect-video place-items-center"><div className="text-center text-muted-foreground"><ImagePlus className="mx-auto h-9 w-9 text-primary"/><p className="mt-2 text-sm">New events start without an image</p></div></div>}</div><div className="mt-3 flex flex-wrap gap-2"><Button type="button" variant="outline" asChild><label className="cursor-pointer gap-2"><ImagePlus className="h-4 w-4"/>{edit.imageUrl ? "Replace image" : "Upload image"}<input type="file" accept="image/*" className="sr-only" onChange={chooseImage}/></label></Button>{edit.imageUrl && <Button type="button" variant="ghost" className="gap-2 text-destructive" onClick={() => setEdit({ ...edit, imageUrl: "" })}><X className="h-4 w-4"/>Remove</Button>}</div></div>
      <div><Label>Event name</Label><Input className="mt-2" value={edit.title} onChange={event => setEdit({ ...edit, title: event.target.value })}/></div>
      <div><Label>Date, location and details</Label><Textarea className="mt-2" value={edit.detail} onChange={event => setEdit({ ...edit, detail: event.target.value })}/></div>
      <div><Label>Visibility</Label><Select value={edit.status} onValueChange={(status: Visibility) => setEdit({ ...edit, status })}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Published">Published</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Hidden">Hidden</SelectItem></SelectContent></Select></div>
    </div>}<DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>Save event</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

function RosterManager({ items, setItems }: { items: Division[]; setItems: React.Dispatch<React.SetStateAction<Division[]>> }) {
  const [edit, setEdit] = useState<Division | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<AdminUser[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    if (!edit) return;
    const timer = window.setTimeout(() => {
      const query = search.trim() ? `&q=${encodeURIComponent(search.trim())}` : "";
      api.get<{ users: AdminUser[] }>(`/admin/users?limit=50${query}`).then(({ users }) => setPlayers(users)).catch(() => setPlayers([]));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [edit, search]);
  const playerFor = (entry: RosterEntry) => entry;
  const open = (item?: Division) => { setEdit(item ? { ...item, roster: item.roster.map(entry => ({ ...entry })) } : { id: Date.now(), title: "", detail: "", status: "Draft", roster: [] }); setSelectedPlayer(""); };
  const addPlayer = () => {
    const player = players.find(item => item.id === selectedPlayer);
    if (!edit || !player || edit.roster.some(entry => entry.playerId === player.id)) return;
    setEdit({ ...edit, roster: [...edit.roster, { playerId: player.id, ign: player.ign, name: player.fullName, role: edit.roster.length ? "Starter" : "Captain" }] });
    setSelectedPlayer("");
  };
  const save = () => {
    if (!edit?.title.trim()) return;
    setItems(old => old.some(item => item.id === edit.id) ? old.map(item => item.id === edit.id ? edit : item) : [...old, edit]);
    setEdit(null);
    toast({ title: "Division roster updated", description: "Roster players are linked to their player accounts." });
  };

  return <div className="space-y-6">
    <Heading eyebrow="Player database" title="Divisions & rosters" copy="Build each Shogun roster from registered player accounts and keep roles current." action={<Button onClick={() => open()} className="gap-2"><Plus className="h-4 w-4"/>Add division</Button>}/>
    <div className="grid gap-5 xl:grid-cols-2">{items.map(item => <Card key={item.id} className="rounded-sm border-border bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.detail}</p></div><Badge variant="outline" className={tone[item.status]}>{item.status}</Badge></div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">{item.roster.map(entry => { const player = playerFor(entry); return player ? <div key={entry.playerId} className="flex items-center gap-3 border border-border bg-background p-3"><div className="grid h-10 w-10 shrink-0 place-items-center bg-primary/10 font-bold text-primary">{player.ign.slice(0,2).toUpperCase()}</div><div className="min-w-0"><p className="truncate font-medium">{player.ign}</p><p className="truncate text-xs text-muted-foreground">{player.name || "Player"} · {entry.role}</p></div></div> : null; })}{!item.roster.length && <p className="text-sm text-muted-foreground">No players assigned.</p>}</div>
      <div className="mt-5 flex gap-2 border-t border-border pt-4"><Button variant="outline" className="flex-1 gap-2" onClick={() => open(item)}><Users className="h-4 w-4"/>Manage roster</Button><Button variant="outline" size="icon" className="text-destructive" onClick={() => setItems(old => old.filter(entry => entry.id !== item.id))}><Trash2 className="h-4 w-4"/></Button></div></Card>)}</div>
    <Dialog open={!!edit} onOpenChange={value => !value && setEdit(null)}><DialogContent className="max-h-[90vh] overflow-y-auto rounded-sm sm:max-w-3xl"><DialogHeader><DialogTitle>Manage division roster</DialogTitle><DialogDescription>Select registered players from Users. Updates here remain linked to their player account.</DialogDescription></DialogHeader>{edit && <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2"><div><Label>Division name</Label><Input className="mt-2" value={edit.title} onChange={event => setEdit({ ...edit, title: event.target.value })}/></div><div><Label>Visibility</Label><Select value={edit.status} onValueChange={(status: Visibility) => setEdit({ ...edit, status })}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Published">Published</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Hidden">Hidden</SelectItem></SelectContent></Select></div></div>
      <div><Label>Division details</Label><Input className="mt-2" value={edit.detail} onChange={event => setEdit({ ...edit, detail: event.target.value })}/></div>
      <div className="border border-border bg-background p-4"><Label>Add player from Users</Label><Input className="mt-3" placeholder="Search players by IGN, name, or email" value={search} onChange={event => setSearch(event.target.value)}/><div className="mt-2 flex flex-col gap-2 sm:flex-row"><Select value={selectedPlayer} onValueChange={setSelectedPlayer}><SelectTrigger className="flex-1"><SelectValue placeholder="Select a registered player"/></SelectTrigger><SelectContent>{players.filter(player => !edit.roster.some(entry => entry.playerId === player.id)).map(player => <SelectItem key={player.id} value={player.id}>{player.ign} — {player.fullName || player.name} ({player.email})</SelectItem>)}</SelectContent></Select><Button type="button" className="gap-2" disabled={!selectedPlayer} onClick={addPlayer}><UserPlus className="h-4 w-4"/>Add player</Button></div></div>
      <div className="space-y-2"><Label>Current roster ({edit.roster.length})</Label>{edit.roster.map(entry => { const player = playerFor(entry); return player ? <div key={entry.playerId} className="grid items-center gap-3 border border-border p-3 sm:grid-cols-[1fr_180px_auto]"><div><p className="font-medium">{player.ign} <span className="font-normal text-muted-foreground">· {player.name}</span></p></div><Select value={entry.role} onValueChange={(role: RosterEntry["role"]) => setEdit({ ...edit, roster: edit.roster.map(item => item.playerId === entry.playerId ? { ...item, role } : item) })}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Captain">Captain</SelectItem><SelectItem value="Starter">Starter</SelectItem><SelectItem value="Substitute">Substitute</SelectItem><SelectItem value="Coach">Coach</SelectItem></SelectContent></Select><Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => setEdit({ ...edit, roster: edit.roster.filter(item => item.playerId !== entry.playerId) })}><Trash2 className="h-4 w-4"/></Button></div> : null; })}{!edit.roster.length && <div className="border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Select players above to build this roster.</div>}</div>
    </div>}<DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save}>Save roster</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

export default function Shogun() {
  const [doc,setDoc,saveState]=useSiteContent<ShogunDoc>("shogun",defaultShogun);
  const [tab,setTab]=useState("overview");
  // Each section edits its own slice of the one saved document.
  const field=<K extends keyof ShogunDoc>(key:K)=>(value:React.SetStateAction<ShogunDoc[K]>)=>setDoc(current=>({...current,[key]:typeof value==="function"?(value as (old:ShogunDoc[K])=>ShogunDoc[K])(current[key]):value}));
  const {live,applications,hero,events,teams,sponsors,achievements,gallery,social}=doc;
  const setLive=field("live"), setApplications=field("applications"), setHero=field("hero"), setEvents=field("events"), setTeams=field("teams"), setSponsors=field("sponsors"), setAchievements=field("achievements"), setGallery=field("gallery"), setSocial=field("social");
  const saveLabel=saveState==="loading"?"Loading…":saveState==="saving"?"Saving…":saveState==="error"?"Not saved":"All changes saved";
  const activeRoster = teams.reduce((total, division) => total + division.roster.length, 0);
  const stats=[["Divisions",teams.length,Shield],["Active roster",activeRoster,Users],["Upcoming events",events.filter(item=>item.status==="Published").length,CalendarDays],["Achievements",achievements.length,Trophy]] as const;
  return <div className="min-h-screen bg-background p-4 md:p-8 xl:p-10"><div className="mx-auto max-w-[1500px] space-y-8"><header className="border-b border-border pb-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-primary">Clan administration</p><h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Shogun Clan Management</h1><p className="mt-3 max-w-2xl text-muted-foreground">Control the public clan experience, divisions, rosters, partners and media.</p></div><div className="flex flex-wrap gap-2"><Badge variant="outline" className={live?tone.Published:tone.Hidden}>{live?"Published":"Hidden"}</Badge><Button variant="outline" className="gap-2" onClick={()=>setLive(!live)}>{live?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}{live?"Hide page":"Publish page"}</Button><span className={`inline-flex items-center gap-2 border px-3 text-xs font-semibold ${saveState==="error"?"border-destructive/40 text-destructive":"border-border text-muted-foreground"}`}><Save className="h-4 w-4"/>{saveLabel}</span></div></div></header>
  <Tabs value={tab} onValueChange={setTab}><TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-sm border border-border bg-card p-1">{tabItems.map(([v,l])=><TabsTrigger key={v} value={v} className="whitespace-nowrap rounded-sm px-4 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">{l}</TabsTrigger>)}</TabsList>
  <TabsContent value="overview" className="mt-7 space-y-7"><Heading eyebrow="Control centre" title="Clan overview" copy="At-a-glance health and shortcuts for the Shogun public experience."/><div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label,value,Icon])=><div key={label} className="bg-card p-6"><Icon className="mb-6 h-5 w-5 text-primary"/><p className="text-3xl font-semibold">{value}</p><p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p></div>)}</div><Card className="rounded-sm border-border bg-card p-6"><h3 className="font-semibold">Quick actions</h3><div className="mt-5 grid gap-3 md:grid-cols-3">{([["Create an event","events"],["Update a roster","teams"],["Add media","gallery"]] as const).map(([x,target])=><Button key={x} variant="outline" className="justify-start p-4" onClick={()=>setTab(target)}>{x}</Button>)}</div></Card><Card className="flex gap-3 rounded-sm border-border bg-card p-6"><Activity className="h-5 w-5 text-primary"/><div><h3 className="font-semibold">Saving</h3><p className="text-sm text-muted-foreground">Every change saves to the public Shogun page automatically. Only published items are shown to visitors. {saveLabel}.</p></div></Card></TabsContent>
  <TabsContent value="content" className="mt-7 space-y-6"><Heading eyebrow="Public page" title="Hero & join experience" copy="Manage the first message visitors see and how prospective members apply."/><Card className="grid gap-6 rounded-sm border-border bg-card p-6 lg:grid-cols-2"><div className="space-y-4"><div><Label>Hero title</Label><Input className="mt-2" value={hero.title} onChange={e=>setHero({...hero,title:e.target.value})}/></div><div><Label>Supporting copy</Label><Textarea className="mt-2" value={hero.copy} onChange={e=>setHero({...hero,copy:e.target.value})}/></div><div><Label>Primary action</Label><Input className="mt-2" value={hero.cta} onChange={e=>setHero({...hero,cta:e.target.value})}/></div></div><div className="min-h-72 border border-dashed border-border bg-background p-7"><p className="mt-14 text-xs font-bold uppercase tracking-[.24em] text-primary">Shogun Clan</p><h3 className="mt-3 text-3xl font-semibold">{hero.title}</h3><p className="mt-3 text-muted-foreground">{hero.copy}</p><Button className="mt-7">{hero.cta}</Button></div></Card><Card className="flex items-center justify-between gap-4 rounded-sm border-border bg-card p-6"><div><h3 className="font-semibold">Join Shogunate applications</h3><p className="text-sm text-muted-foreground">Accept new membership submissions.</p></div><Switch checked={applications} onCheckedChange={setApplications}/></Card></TabsContent>
  <TabsContent value="events" className="mt-7"><EventManager items={events} setItems={setEvents}/></TabsContent><TabsContent value="teams" className="mt-7"><RosterManager items={teams} setItems={setTeams}/></TabsContent><TabsContent value="sponsors" className="mt-7"><Manager title="Sponsors" copy="Manage partner tiers, attribution and public visibility." icon={Award} items={sponsors} setItems={setSponsors} enableImage imageLabel="Sponsor logo"/></TabsContent><TabsContent value="achievements" className="mt-7"><Manager title="Achievements" copy="Record competitive finishes and honours." icon={Trophy} items={achievements} setItems={setAchievements}/></TabsContent>
  <TabsContent value="gallery" className="mt-7"><Manager title="Gallery" copy="Upload, caption and publish clan images." icon={GalleryHorizontal} items={gallery} setItems={setGallery} enableImage imageLabel="Gallery image"/></TabsContent>
  <TabsContent value="social" className="mt-7 space-y-6"><Heading eyebrow="Channels" title="Social links" copy="Keep every public Shogun destination current."/><Card className="space-y-4 rounded-sm border-border bg-card p-6">{(["Instagram","YouTube","TikTok","Discord"] as const).map(x=><div key={x} className="grid items-center gap-3 md:grid-cols-[160px_1fr]"><Label className="flex items-center gap-2"><Link2 className="h-4 w-4 text-primary"/>{x}</Label><Input placeholder={`Enter ${x} URL`} value={social[x]} onChange={e=>setSocial({...social,[x]:e.target.value})}/></div>)}</Card></TabsContent>
  <TabsContent value="settings" className="mt-7 space-y-6"><Heading eyebrow="Governance" title="Shogun settings" copy="Configure visibility, applications and manager access."/><Card className="divide-y divide-border rounded-sm border-border bg-card">{([["Public clan page","Allow visitors to view this page",live,setLive],["Applications open","Accept Join Shogunate submissions",applications,setApplications]] as const).map(([title,copy,value,setter])=><div key={title} className="flex items-center justify-between gap-4 p-6"><div><h3 className="font-medium">{title}</h3><p className="text-sm text-muted-foreground">{copy}</p></div><Switch checked={value} onCheckedChange={setter}/></div>)}</Card></TabsContent>
  </Tabs></div></div>;
}
