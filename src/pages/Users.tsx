import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Shield,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserActionModals from "@/components/modals/UserActionModals";
import { PlayerDirectory } from "@/components/PlayerDirectory";
import { TeamDirectory } from "@/components/TeamDirectory";
import ReportsDesk from "@/components/ReportsDesk";

type ModalType = "edit-player" | "add-admin" | "edit-team" | "delete" | null;

// Mock Datasets with matching interface structures
const INITIAL_ADMINS = [
  { id: "admin-1", name: "Amina Bello", email: "amina@sca.gg", role: "Super Admin", type: "super", status: "Active" },
  { id: "admin-2", name: "Daniel Cole", email: "daniel@sca.gg", role: "Moderator", type: "mod", status: "Active" },
  { id: "admin-3", name: "Maya Stone", email: "maya@sca.gg", role: "Tournament Manager", type: "manager", status: "Active" },
  { id: "admin-4", name: "Tari Okafor", email: "tari@sca.gg", role: "Shogun Manager", type: "manager", status: "Active" },
  { id: "admin-5", name: "Lena Adeyemi", email: "lena@sca.gg", role: "Finance Manager", type: "manager", status: "Active" },
  { id: "admin-6", name: "Femi James", email: "femi@sca.gg", role: "League Manager", type: "manager", status: "Active" },
  { id: "admin-7", name: "Nora James", email: "nora@sca.gg", role: "Content Admin", type: "manager", status: "Active" },
];

const ITEMS_PER_PAGE = 2; // Slice threshold setup to trigger pagination elements

const Users = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("players");

  // Modal Orchestration State Hooks
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItemContext, setSelectedItemContext] = useState<any>(null);

  const triggerModal = (type: ModalType, context: any = null) => {
    setSelectedItemContext(context);
    setModalType(type);
  };

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      
      {/* --- MODAL INJECTION PORTAL --- */}
      <UserActionModals 
        type={modalType}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        targetData={selectedItemContext}
        onConfirm={(data) => console.log("Database updated callback stream hook:", data)}
      />

      {/* --- TOP PROFILE HEADER --- */}
      <header className="mx-auto flex w-full max-w-[1600px] justify-between border-b border-border pb-7">
        <div>
          <p className="sca-eyebrow mb-2">Platform directory</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">User management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage players, teams, and administrators across the platform's tournaments and leagues.
          </p>
        </div>
      </header>

      {/* --- TABS NAVIGATION INTERFACE --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto mt-7 max-w-[1600px] space-y-7">
        <div className="overflow-x-auto border-b border-border">
          <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
            <TabsTrigger value="players" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Players</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Teams</TabsTrigger>
            <TabsTrigger value="admins" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Admins</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-none border-b-2 border-transparent px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary">Reports</TabsTrigger>
          </TabsList>
        </div>

        {/* --- PLAYERS MANAGEMENT TAB PANEL --- */}
        <TabsContent value="players" className="space-y-6 outline-none focus:outline-none">
          <PlayerDirectory />
        </TabsContent>

        {/* --- TEAMS PANEL TAB INTERFACE --- */}
        <TabsContent value="teams" className="space-y-6 outline-none focus:outline-none">
          <TeamDirectory />
        </TabsContent>

        {/* --- ADMINS PANEL TAB PANEL --- */}
        <TabsContent value="admins" className="space-y-6 outline-none focus:outline-none">
          <div className="flex flex-col space-y-6 rounded-sm border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="sca-eyebrow mb-2">Access control</p>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">Admins &amp; moderators</h3>
                <p className="mt-1 text-sm text-muted-foreground">Assign internal platform roles and system permissions.</p>
              </div>
              <Button onClick={() => triggerModal("add-admin")} className="h-11 w-full gap-2 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <Plus className="w-4 h-4 stroke-[3]" /> Add Admin
              </Button>
            </div>

            <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
              {[['6', 'Active staff'], ['6', 'Operational roles'], ['100%', 'Accounts active']].map(([value, label]) => <div key={label} className="bg-background/60 p-4"><p className="text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p></div>)}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {INITIAL_ADMINS.map((admin) => {
                const scope: Record<string, string> = { 'Super Admin': 'All platform operations', 'Moderator': 'Users, reports & moderation', 'Tournament Manager': 'Tournament operations', 'Shogun Manager': 'Shogun community operations', 'Finance Manager': 'Transactions & payment settings', 'League Manager': 'League operations', 'Content Admin': 'Website content operations' };
                return <article key={admin.id} className="border border-border bg-background p-5">
                  <div className="flex items-start justify-between gap-4"><span className="flex h-12 w-12 items-center justify-center bg-primary/10 text-sm font-black text-primary">{admin.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><Badge className={`pointer-events-none rounded-none border font-bold ${admin.type === 'super' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'}`}><Shield className="mr-1 h-3 w-3" />{admin.role}</Badge></div>
                  <h4 className="mt-5 text-lg font-semibold text-foreground">{admin.name}</h4><p className="mt-1 text-sm text-muted-foreground">{admin.email}</p>
                  <div className="my-5 border-y border-border py-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Access scope</p><p className="mt-2 text-sm font-medium text-foreground">{scope[admin.role]}</p></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{admin.status}</span><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-9 w-9 rounded-none border border-border p-0 text-muted-foreground hover:bg-card hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="rounded-sm border-border bg-popover text-popover-foreground"><DropdownMenuItem onClick={() => triggerModal("edit-player", admin)}><Edit className="mr-2 h-4 w-4" />Modify clearance</DropdownMenuItem><DropdownMenuItem onClick={() => triggerModal("delete", admin)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Revoke access</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
                </article>;
              })}
            </div>
          </div>
        </TabsContent>

        {/* --- REPORTS PANEL TAB PANEL --- */}
        <TabsContent value="reports" className="space-y-6 outline-none focus:outline-none">
          <ReportsDesk />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
