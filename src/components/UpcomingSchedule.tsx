import React, { useState } from "react";
import { Bell, Calendar, Clock, Edit2, MoreVertical, Trash2, TrendingUp, CheckCircle, Clock3 } from "lucide-react";
import { EditEventModal, DeleteEventModal } from "./modals/ScheduleModals";
import { Button } from "./ui/button";

const INITIAL_UPCOMING_EVENTS = [
  {
    id: "u1",
    game: "VALORANT",
    tier: "TIER 1 MAJOR",
    title: "Champions Tour: Tokyo Finals",
    date: "Aug 24, 2024",
    time: "18:00 UTC",
    status: "CONFIRMED" as "CONFIRMED" | "PENDING",
    hasEdit: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "u2",
    game: "CODM",
    tier: "COMMUNITY CUP",
    title: "Elite Series: Northern Qualifier",
    date: "Aug 26, 2024",
    time: "14:30 UTC",
    status: "PENDING" as "CONFIRMED" | "PENDING",
    hasEdit: true,
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "u3",
    game: "LOL",
    tier: "WEEKLY SCRIMS",
    title: "Nexus Invitational: Round 3",
    date: "Aug 28, 2024",
    time: "20:00 UTC",
    status: "CONFIRMED" as "CONFIRMED" | "PENDING",
    hasEdit: true,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "u4",
    game: "DOTA 2",
    tier: "REGIONAL OPEN",
    title: "Shadow Realm Open Qualifiers",
    date: "Sep 01, 2024",
    time: "16:00 UTC",
    status: "CONFIRMED" as "CONFIRMED" | "PENDING",
    hasEdit: true,
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=120",
  },
];

export default function UpcomingSchedule() {
  // ─── LOCAL STATE MANAGEMENT FOR MUTATIONS ───
  const [events, setEvents] = useState(INITIAL_UPCOMING_EVENTS);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedEventData, setSelectedEventData] = useState({
    title: "Regional Qualifiers Tour",
    subTitle: "Live Championship Stream",
    streamUrl: "https://streaming.example.com/event",
    mapInfo: "Map Pool: Ascent, Bind, Split",
    date: "OCT 24",
    time: "18:00 UTC",
  });

  // Action loop toggle to shift state array vectors
  const toggleStatus = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            status: event.status === "PENDING" ? "CONFIRMED" : "PENDING",
          };
        }
        return event;
      })
    );
  };

  const handleEditClick = (event: typeof INITIAL_UPCOMING_EVENTS[0]) => {
    setSelectedEventData({
      title: event.title,
      date: event.date,
      time: event.time,
      subTitle: "Live Match Broadcast",
      streamUrl: "https://youtube.com/live",
      mapInfo: "Map Selection Vector Pending",
    });
    setIsEditOpen(true);
  };

  // Live sidebar analytics metric filters
  const totalScheduled = events.length;
  const totalConfirmed = events.filter((e) => e.status === "CONFIRMED").length;
  const totalPending = events.filter((e) => e.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* ─── LIVE FEEDS SECTION HEADER ─── */}
      <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">
          Upcoming Live Feeds
        </h3>
        <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase">
          Oct 24, 2026
        </span>
      </div>

      {/* ─── MAIN CONTENT DASHBOARD MATRIX GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand Event Cards Stack List */}
        <div className="lg:col-span-8 space-y-3.5">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#0b0f19]/90 border border-[#1e293b]/40 rounded-xl p-4 flex items-center justify-between relative group hover:border-slate-700/60 transition-all shadow-md"
            >
              {/* Highlight Status Vector Bar Line */}
              <div
                className={`absolute top-3 bottom-3 left-0 w-[3px] rounded-r-full transition-colors duration-200 ${
                  event.status === "CONFIRMED" ? "bg-[#00FFC6]" : "bg-amber-500"
                }`}
              />

              <div className="flex items-center space-x-4 pl-2">
                <div className="w-14 h-14 rounded-lg bg-slate-900 overflow-hidden border border-slate-800 relative flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 border border-white/5 rounded-lg" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black tracking-widest bg-slate-800 px-2 py-0.5 rounded text-[#00FFC6] border border-slate-700/50">
                      {event.game}
                    </span>
                    <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase">
                      {event.tier}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">
                    {event.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-slate-500 font-bold text-[10px]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utility Panel Action Interface Controls */}
              <div className="flex items-center space-x-3">
                
                {/* ─── INTERACTIVE STATUS TOGGLE BADGE ─── */}
                <button
                  onClick={() => toggleStatus(event.id)}
                  title={`Click to shift to ${event.status === "PENDING" ? "CONFIRMED" : "PENDING"}`}
                  className={`text-[8px] font-black tracking-widest px-2 py-1 rounded-md uppercase flex items-center gap-1.5 transition-all active:scale-95 border cursor-pointer ${
                    event.status === "CONFIRMED"
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400"
                      : "bg-amber-500/5 border-amber-500/20 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                  }`}
                >
                  {event.status === "CONFIRMED" ? (
                    <>
                      <CheckCircle className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{event.status}</span>
                    </>
                  ) : (
                    <>
                      <Clock3 className="w-2.5 h-2.5 stroke-[3] animate-pulse" />
                      <span>{event.status}</span>
                    </>
                  )}
                </button>
                
                <div className="flex space-x-1">
                  {event.hasEdit && (
                    <>
                      <Button
                        onClick={() => handleEditClick(event)}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800 hover:text-white text-slate-400"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                  
                      <Button
                        onClick={() => setIsDeleteOpen(true)}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:border-rose-900/50 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Right Side Info Panels Sidebar Widget Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b0f19] border border-[#1e293b]/40 rounded-xl p-5 space-y-4 shadow-xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-2">
              Upcoming Overview
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Total Scheduled
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {String(totalScheduled).padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Confirmed
                </span>
                <span className="text-lg font-black text-[#00FFC6] font-mono">
                  {String(totalConfirmed).padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Pending Approval
                </span>
                <span className="text-lg font-black text-slate-500 font-mono">
                  {String(totalPending).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span className="text-slate-500">Approval Ratio</span>
                <span className="text-[#00FFC6]">
                  {totalScheduled > 0 ? Math.round((totalConfirmed / totalScheduled) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00FFC6] h-full rounded-full transition-all duration-300"
                  style={{ width: `${totalScheduled > 0 ? (totalConfirmed / totalScheduled) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div
            className="relative rounded-xl overflow-hidden min-h-[140px] flex flex-col justify-end p-5 border border-slate-800 group bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-0" />
            <div className="relative z-10 space-y-1">
              <h3 className="text-base font-black text-white uppercase tracking-wide leading-tight">
                The Nexus Grand Open 2024
              </h3>
              <span className="text-[9px] font-black text-[#00FFC6] uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> System Announcement
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── MODAL CONTROLS MOUNT POINT ─── */}
      <EditEventModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={selectedEventData}
      />
      <DeleteEventModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          console.log("Purged item tracking context vector");
          setIsDeleteOpen(false);
        }}
      />
    </div>
  );
}