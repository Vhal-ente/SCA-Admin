import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerDirectory } from "@/components/PlayerDirectory";
import { TeamDirectory } from "@/components/TeamDirectory";
import { StaffAccess } from "@/components/StaffAccess";
import ReportsDesk from "@/components/ReportsDesk";

const Users = () => {
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div className="min-h-screen bg-background p-5 text-foreground md:p-8 lg:p-10">
      
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
          <StaffAccess />
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
