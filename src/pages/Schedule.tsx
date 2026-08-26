import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpcomingSchedule from "@/components/UpcomingSchedule";
import PastSchedule from "@/components/PastSchedule";
import { 
  PostEventModal,  
  ManageStreamModal 
} from "@/components/modals/ScheduleModals";

const Schedule = () => {
  const [activeTab, setActiveTab] = useState<"all" | "live" | "upcoming" | "past">("live");
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isManageStreamOpen, setIsManageStreamOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-8 xl:p-10">
      
      {/* ─── HEADER BAR ─── */}
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-primary">Platform operations</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Master Schedule</h1>
          <p className="mt-3 text-muted-foreground">Coordinate tournaments, leagues, streams and community events.</p>
        </div>
        <Button 
          onClick={() => setIsPostOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="mx-auto mt-7 max-w-[1500px] space-y-6">

        {/* ─── TIME MATRIX NAVIGATION TABS ─── */}
        <div className="grid grid-cols-3 gap-1 rounded-sm border border-border bg-card p-1">
          {(["live", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-11 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ─── DYNAMIC TAB CONTENT VIEW ROUTER MATRIX ─── */}
        <main className="pt-2">
          
          {/* LIVE TAB CONTENT */}
          {activeTab === "live" && (
            <div className="relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-sm border border-primary/40 bg-card p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none"
                style={{ backgroundImage: "url('/arena.png')" }} 
              />
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Live now</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 text-[9px] font-bold tracking-wider uppercase">
                  <span className="text-slate-500">👁</span> {/* Fallback inline eye indicator */}
                  <span>24.8K Viewers</span>
                </div>
              </div>

              <div className="relative z-10 my-4 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                  Valorant Champions Tour
                </span>
                <h2 className="text-xl font-semibold text-foreground md:text-3xl">
                  Regional Semi-Finals
                </h2>
                <p className="text-[11px] font-bold text-[#00d9b8] tracking-wide">
                  Cloud9 vs. Team Liquid <span className="text-slate-500 px-1">•</span> MAP 3
                </p>
              </div>

              <div className="relative z-10">
                <Button 
                  onClick={() => setIsManageStreamOpen(true)}
                  variant="outline"
                  className="h-11 w-full rounded-sm font-bold uppercase tracking-[0.15em]"
                >
                  Manage Stream
                </Button>
              </div>
            </div>
          )}

          {/* UPCOMING TAB CONTENT */}
          {activeTab === "upcoming" && <UpcomingSchedule />}

          {/* PAST TAB CONTENT */}
          {activeTab === "past" && <PastSchedule />}

          {/* ALL/FALLBACK TAB CONTENT CONTAINER */}
          {activeTab === "all" && (
            <div className="text-center py-20 border border-dashed border-slate-800/80 rounded-2xl bg-[#0b0f19]/30">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Consolidating historical dataset feeds... Select an explicit status vector tab above.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* ─── SYSTEM ACTION MODAL COMPONENT BASE footprint ─── */}
      <PostEventModal 
        isOpen={isPostOpen} 
        onClose={() => setIsPostOpen(false)} 
      />
      
      <ManageStreamModal 
        isOpen={isManageStreamOpen} 
        onClose={() => setIsManageStreamOpen(false)} 
        onUpdateStream={(data) => console.log("Stream layout synced:", data)}
      />
    </div>
  );
};

export default Schedule;
