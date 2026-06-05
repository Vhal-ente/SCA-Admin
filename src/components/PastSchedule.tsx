import React, { useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import { ViewReportModal } from "./modals/ScheduleModals";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAST_EVENTS = [
  { 
    id: "p1", 
    type: "MAJORS 2024", 
    score: "FINAL SCORE: 2-0", 
    title: "NEON STRIKE INVITATIONAL", 
    desc: "The grand finale of the winter season featuring top-tier...", 
    players: "12 Teams Participating", 
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400",
    mapScore: "2 — 0",
    peakViewers: "34,102",
    avgDuration: "42.5 Mins",
    totalWatchTime: "24,156 Hrs",
    channels: "YouTube Gaming / Twitch"
  },
  { 
    id: "p2", 
    type: "PRO LEAGUE", 
    score: "FINAL SCORE: 3-1", 
    title: "CYBER DOME CHALLENGE", 
    desc: "Intense 1v1 ladder tournament results for the regional...", 
    players: "8 Pro Players", 
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=400",
    mapScore: "3 — 1",
    peakViewers: "18,450",
    avgDuration: "28.1 Mins",
    totalWatchTime: "8,610 Hrs",
    channels: "Twitch / Kick"
  },
  { 
    id: "p3", 
    type: "GLOBAL SERIES", 
    score: "FINAL SCORE: 1-2", 
    title: "VELOCITY MASTERS", 
    desc: "Racing league seasonal playoffs completed at the...", 
    players: "16 Squads Finalized", 
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400",
    mapScore: "1 — 2",
    peakViewers: "45,890",
    avgDuration: "55.0 Mins",
    totalWatchTime: "42,065 Hrs",
    channels: "YouTube Gaming / SteamTV"
  },
  { 
    id: "p4", 
    type: "COMMUNITY HUB", 
    score: "FINAL SCORE: 4-4 (DRAW)", 
    title: "SHADOW REALM OPEN", 
    desc: "Community-driven weekly bracket for rising talent in th...", 
    players: "32 Contenders", 
    image: "https://images.unsplash.com/photo-142751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
    mapScore: "4 — 4 (DRAW)",
    peakViewers: "4,120",
    avgDuration: "19.3 Mins",
    totalWatchTime: "1,328 Hrs",
    channels: "Twitch Private Link"
  }
];

const ITEMS_PER_PAGE = 4;

export default function PastSchedule() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const openReport = (id: string) => {
    const matchData = PAST_EVENTS.find((event) => event.id === id);
    if (matchData) {
      setSelectedEvent({
        title: matchData.title,
        streamUrl: "https://youtube.com", 
        mapScore: matchData.mapScore,
        peakViewers: matchData.peakViewers,
        avgDuration: matchData.avgDuration,
        totalWatchTime: matchData.totalWatchTime,
        channels: matchData.channels
      });
      setIsReportOpen(true);
    }
  };

  // Pagination Computations
  const totalItems = PAST_EVENTS.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const itemStart = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const itemEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Dynamic slice chunk allocation setup
  const currentVisibleMatches = PAST_EVENTS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Target Content Grid Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentVisibleMatches.map((match) => (
          <div 
            key={match.id}
            className="bg-[#0b0f19] border border-[#1e293b]/30 rounded-xl overflow-hidden grid grid-cols-12 shadow-xl group hover:border-slate-800 transition-colors"
          >
            <div className="col-span-5 relative min-h-[170px] bg-slate-950">
              <img src={match.image} alt={match.title} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-300" />
            </div>

            <div className="col-span-7 p-4 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-black tracking-wider">
                  <span className="text-slate-500 uppercase">{match.type}</span>
                  <span className="text-[#4ade80] uppercase font-mono">{match.score}</span>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide leading-snug">{match.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{match.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>{match.players}</span>
                <button 
                  className="text-white hover:text-[#4ade80] font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5 transition-colors group/btn"
                  onClick={() => openReport(match.id)}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-[#4ade80] transition-colors" />
                  View Report <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fully Functional Shadcn Integration Footer */}
      <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>Showing {itemStart}-{itemEnd} of {totalItems} archived events</span>
        
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1.5">
            
            {/* Prev Trigger */}
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "opacity-40 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>

            {/* Core Iterated Links Loop */}
            {pageNumbers.map((page) => {
              const isActive = page === currentPage;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs ${
                      isActive 
                        ? "bg-[#4ade80] text-[#07090d] hover:bg-[#4ade80] hover:text-[#07090d]" 
                        : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Trigger */}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "opacity-40 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

      <ViewReportModal 
        isOpen={isReportOpen} 
        onClose={() => { setIsReportOpen(false); setSelectedEvent(null); }} 
        initialData={selectedEvent}
      />
    </div>
  );
}