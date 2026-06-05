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
    <div className="p-8 space-y-8 min-h-screen bg-[#07090d] text-slate-200 font-sans selection:bg-[#4ade80]/20">
      
      {/* ─── HEADER BAR ─── */}
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Schedule</h1>
          <p className="text-slate-400">Centralized timeline for all events</p>
        </div>
        <Button 
          onClick={() => setIsPostOpen(true)}
          className="bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] font-bold gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">

        {/* ─── TIME MATRIX NAVIGATION TABS ─── */}
        <div className="bg-[#0b0f19]/80 border border-[#1e293b]/30 p-1.5 rounded-xl grid grid-cols-3 gap-1">
          {(["live", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-[#4ade80] text-[#07090d] shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/30"
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
            <div className="relative border-2 border-[#4ade80]/40 rounded-2xl overflow-hidden bg-[#0c111d] bg-gradient-to-r from-[#07090d] via-transparent to-transparent shadow-xl min-h-[190px] flex flex-col justify-between p-5 md:p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none"
                style={{ backgroundImage: "url('/arena.png')" }} 
              />
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">Live</span>
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
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide leading-none">
                  Regional Semi-Finals
                </h2>
                <p className="text-[11px] font-bold text-[#4ade80] tracking-wide">
                  Cloud9 vs. Team Liquid <span className="text-slate-500 px-1">•</span> MAP 3
                </p>
              </div>

              <div className="relative z-10">
                <Button 
                  onClick={() => setIsManageStreamOpen(true)}
                  variant="outline"
                  className="w-full border-[#1e293b] bg-[#07090d]/80 hover:bg-[#0c111a] hover:text-white text-slate-300 font-black text-[10px] uppercase tracking-[0.15em] h-10 rounded-xl transition-colors"
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