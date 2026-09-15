import { useCallback, useEffect, useState } from "react";
import { Ban, MoreVertical, RotateCcw, Search, ShieldCheck, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { api, type AdminUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

// The API returns at most this many accounts; search narrows past it.
const USER_LIMIT = 500;
const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 300;

const ROLES = ["player", "coach", "organizer", "admin"] as const;
const STATUSES = ["active", "pending", "suspended", "banned"] as const;

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-amber-500/10 text-amber-500",
  suspended: "bg-rose-500/10 text-rose-400",
  banned: "bg-destructive/15 text-destructive",
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Never";

type PendingChange =
  | { user: AdminUser; kind: "role"; value: string }
  | { user: AdminUser; kind: "status"; value: string };

export function PlayerDirectory() {
  const { toast } = useToast();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<PendingChange | null>(null);

  const loadUsers = useCallback(async (query: string) => {
    try {
      const params = new URLSearchParams({ limit: String(USER_LIMIT) });
      if (query.trim()) params.set("q", query.trim());
      const { users: data } = await api.get<{ users: AdminUser[] }>(`/admin/users?${params}`);
      setUsers(data);
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => loadUsers(search), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [loadUsers, search]);

  const runChange = async (label: string, request: () => Promise<unknown>) => {
    try {
      await request();
      toast({ title: label });
      await loadUsers(search);
    } catch (error) {
      toast({ title: "Could not update account", description: (error as Error).message, variant: "destructive" });
    }
  };

  const confirmPending = () => {
    if (!pending) return;
    const { user, kind, value } = pending;
    setPending(null);
    if (kind === "role") {
      runChange(`${user.ign} is now ${value === "admin" ? "an" : "a"} ${value}`, () => api.patch(`/admin/users/${user.id}/role`, { role: value }));
    } else {
      runChange(value === "active" ? `${user.ign} has been restored` : `${user.ign} has been ${value}`, () => api.patch(`/admin/users/${user.id}/status`, { status: value }));
    }
  };

  const toggleMultiTeam = (user: AdminUser) => {
    const granted = !user.multiTeamAllowed;
    runChange(
      granted ? `${user.ign} can now join multiple teams` : `${user.ign} is limited to one team`,
      () => api.patch(`/admin/users/${user.id}/multi-team`, { granted, reason: granted ? "Granted from the staff console" : "" }),
    );
  };

  const filtered = statusFilter === "all" ? users : users.filter((user) => user.status === statusFilter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstShown = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastShown = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const pendingCopy = pending && (pending.kind === "role"
    ? {
        title: `Make ${pending.user.ign} ${pending.value === "admin" ? "an" : "a"} ${pending.value}?`,
        description: pending.value === "admin"
          ? "Administrators can sign in to this console and manage every competition, account, and setting."
          : `Their role changes from ${pending.user.role} to ${pending.value}.`,
        action: "Change role",
      }
    : pending.value === "active"
      ? { title: `Restore ${pending.user.ign}?`, description: "They will be able to sign in and take part again.", action: "Restore access" }
      : {
          title: `${pending.value === "banned" ? "Ban" : "Suspend"} ${pending.user.ign}?`,
          description: "They are signed out everywhere immediately and cannot sign in until an admin restores the account.",
          action: pending.value === "banned" ? "Ban account" : "Suspend account",
        });

  return (
    <div className="flex flex-col space-y-5 rounded-sm border border-border bg-card p-6">
      <div>
        <p className="sca-eyebrow mb-2">Player directory</p>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">Players</h3>
        <p className="mt-1 text-sm text-muted-foreground">Every account registered on the site. Players sign up themselves; manage their role, access, and team allowance here.</p>
      </div>

      <div className="flex flex-col gap-3 border border-border bg-background p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by IGN, email, or name..."
            className="h-11 w-full rounded-sm border-border bg-card pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
          <SelectTrigger className="h-11 w-full rounded-sm border-border bg-card px-4 text-sm font-semibold text-foreground sm:w-[210px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-sm border-border bg-popover text-popover-foreground">
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((status) => <SelectItem key={status} value={status}>{capitalize(status)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loadError && (
        <p role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{loadError}</p>
      )}

      <div className="overflow-x-auto w-full">
        <Table className="w-full text-left text-xs border-collapse min-w-[820px]">
          <TableHeader>
            <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="pb-3 pl-2 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Account</TableHead>
              <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Role</TableHead>
              <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Teams</TableHead>
              <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Joined</TableHead>
              <TableHead className="pb-3 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Last sign-in</TableHead>
              <TableHead className="pb-3 text-right pr-2 uppercase tracking-wider text-[9px] font-bold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border font-medium">
            {visible.map((user) => {
              const isMe = user.id === me?.id;
              return (
                <TableRow key={user.id} className="border-b border-border transition-colors hover:bg-secondary/50">
                  <TableCell className="py-4 pl-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-primary/10 text-xs font-black text-primary">{(user.ign || user.email).slice(0, 2).toUpperCase()}</div>
                      <div className="min-w-0">
                        <p className="font-bold tracking-wide text-foreground">{user.ign}{isMe && <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-primary">You</span>}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{[user.fullName || user.name, user.email].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`pointer-events-none rounded border px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${user.role === "admin" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-transparent text-muted-foreground"}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex items-center space-x-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${STATUS_STYLE[user.status] || "bg-muted text-muted-foreground"}`}>
                      <span className="h-1 w-1 rounded-full bg-current" />
                      <span>{user.status}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-muted-foreground">{user.multiTeamAllowed ? "Multiple" : "One"}</TableCell>
                  <TableCell className="py-4 text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="py-4 text-muted-foreground">{formatDate(user.lastLoginAt)}</TableCell>
                  <TableCell className="py-4 text-right pr-2">
                    {isMe ? (
                      <span className="text-[10px] text-muted-foreground">Managed by another admin</span>
                    ) : (
                      // Non-modal so the confirmation dialog it opens gets focus and pointer events.
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" aria-label={`Manage ${user.ign}`} className="h-9 w-9 rounded-sm p-0 text-muted-foreground hover:bg-secondary hover:text-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-sm border-border bg-popover text-popover-foreground">
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">{user.ign}</DropdownMenuLabel>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer"><ShieldCheck className="mr-2 h-4 w-4" />Change role</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="rounded-sm border-border bg-popover text-popover-foreground">
                              <DropdownMenuRadioGroup value={user.role} onValueChange={(role) => role !== user.role && setPending({ user, kind: "role", value: role })}>
                                {ROLES.map((role) => <DropdownMenuRadioItem key={role} value={role} className="cursor-pointer">{capitalize(role)}</DropdownMenuRadioItem>)}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => toggleMultiTeam(user)} className="cursor-pointer">
                            <UsersIcon className="mr-2 h-4 w-4" />{user.multiTeamAllowed ? "Limit to one team" : "Allow multiple teams"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <>
                              <DropdownMenuItem onClick={() => setPending({ user, kind: "status", value: "suspended" })} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"><Ban className="mr-2 h-4 w-4" />Suspend account</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setPending({ user, kind: "status", value: "banned" })} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"><Ban className="mr-2 h-4 w-4" />Ban account</DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem onClick={() => setPending({ user, kind: "status", value: "active" })} className="cursor-pointer"><RotateCcw className="mr-2 h-4 w-4" />Restore access</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {!visible.length && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  {loading ? "Loading accounts…" : search || statusFilter !== "all" ? "No accounts match these filters." : "No accounts yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:flex-row">
        <span>
          Showing {firstShown}-{lastShown} of {filtered.length} accounts
          {users.length >= USER_LIMIT && " · most recent 500, search to find others"}
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage(currentPage - 1); }} className={currentPage === 1 ? "opacity-40 pointer-events-none" : "cursor-pointer"} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink href="#" isActive={p === currentPage} onClick={(e) => { e.preventDefault(); setPage(p); }} className={`h-8 w-8 rounded-sm text-[11px] font-mono ${p === currentPage ? "bg-primary text-primary-foreground font-black" : "border border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setPage(currentPage + 1); }} className={currentPage === totalPages ? "opacity-40 pointer-events-none" : "cursor-pointer"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AlertDialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent className="rounded-sm border-border bg-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingCopy?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pendingCopy?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPending}
              className={`rounded-sm ${pending?.kind === "status" && pending.value !== "active" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
            >
              {pendingCopy?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
