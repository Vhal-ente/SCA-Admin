import { useCallback, useEffect, useState } from "react";
import { Search, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { api, type AdminUser } from "@/lib/api";

const SEARCH_DELAY_MS = 300;

const initials = (user: AdminUser) => (user.fullName || user.ign).split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
const since = (iso: string) => (iso ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(iso)) : "Never");

// StaffAccess lists the administrators who can use the console, and promotes
// or removes them. The server keeps at least one, and nobody can change their own access.
export function StaffAccess() {
  const { toast } = useToast();
  const { user: me } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<AdminUser[]>([]);
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAdmins = useCallback(async () => {
    try {
      const { users } = await api.get<{ users: AdminUser[] }>("/admin/users?role=admin&limit=200");
      setAdmins(users);
    } catch (error) {
      toast({ title: "Could not load administrators", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  useEffect(() => {
    if (!search.trim()) {
      setCandidates([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const { users } = await api.get<{ users: AdminUser[] }>(`/admin/users?limit=8&q=${encodeURIComponent(search.trim())}`);
        setCandidates(users.filter(user => user.role !== "admin"));
      } catch {
        setCandidates([]);
      }
    }, SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  const setRole = async (user: AdminUser, role: "admin" | "player") => {
    if (role === "player" && !window.confirm(`Remove console access for ${user.ign}? Their account becomes a player account.`)) return;
    setBusyId(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role });
      toast({ title: role === "admin" ? `${user.ign} is now an administrator` : `${user.ign} no longer has console access` });
      setSearch("");
      await loadAdmins();
    } catch (error) {
      toast({ title: "Could not change access", description: (error as Error).message, variant: "destructive" });
    } finally {
      setBusyId("");
    }
  };

  return <div className="flex flex-col space-y-6 rounded-sm border border-border bg-card p-6">
    <div>
      <p className="sca-eyebrow mb-2">Access control</p>
      <h3 className="text-2xl font-semibold tracking-tight text-foreground">Administrators</h3>
      <p className="mt-1 text-sm text-muted-foreground">Administrators have full access to this console. Players, coaches, and organizers cannot sign in here.</p>
    </div>

    <div className="border border-border bg-background p-4">
      <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Give an existing account console access</label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by IGN, name, or email" className="h-11 rounded-sm border-border bg-card pl-10" />
      </div>
      {candidates.length > 0 && <ul className="mt-2 divide-y divide-border border border-border">{candidates.map(user => <li key={user.id} className="flex items-center justify-between gap-3 p-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold text-foreground">{user.ign} <span className="font-normal text-muted-foreground">· {user.fullName || "No name"}</span></p><p className="truncate text-xs text-muted-foreground">{user.email} · {user.role} · {user.status}</p></div><Button disabled={busyId === user.id || user.status !== "active"} onClick={() => setRole(user, "admin")} className="h-9 shrink-0 gap-2 rounded-sm bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground"><UserPlus className="h-4 w-4" />Make admin</Button></li>)}</ul>}
      {search.trim() && !candidates.length && <p className="mt-2 text-xs text-muted-foreground">No matching accounts without console access. The person needs to sign up first.</p>}
    </div>

    <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
      {[[admins.length, "Administrators"], [admins.filter(admin => admin.status === "active").length, "Active"], [admins.filter(admin => admin.lastLoginAt).length, "Signed in at least once"]].map(([value, label]) => <div key={label} className="bg-background/60 p-4"><p className="text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p></div>)}
    </div>

    {loading && <p className="text-sm text-muted-foreground">Loading administrators…</p>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{admins.map(admin => <article key={admin.id} className="border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center bg-primary/10 text-sm font-black text-primary">{initials(admin)}</span><span className="inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary"><ShieldCheck className="h-3 w-3" />Administrator</span></div>
      <h4 className="mt-5 text-lg font-semibold text-foreground">{admin.fullName || admin.ign}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{admin.ign} · {admin.email}</p>
      <div className="my-5 border-y border-border py-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Last sign-in</p><p className="mt-2 text-sm font-medium text-foreground">{since(admin.lastLoginAt)}</p></div>
      <div className="flex items-center justify-between"><span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${admin.status === "active" ? "text-emerald-400" : "text-muted-foreground"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{admin.status}</span>
        {admin.id === me?.id ? <span className="text-xs text-muted-foreground">You</span> : <Button variant="outline" disabled={busyId === admin.id} onClick={() => setRole(admin, "player")} className="h-9 gap-2 rounded-sm border-destructive/30 text-[10px] font-bold uppercase tracking-wider text-destructive"><UserMinus className="h-4 w-4" />Remove access</Button>}
      </div>
    </article>)}</div>
  </div>;
}
