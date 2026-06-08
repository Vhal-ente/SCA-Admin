import { useState } from "react";
import { Swords, Calendar, Trophy, Play } from "lucide-react";

export default function MatchTab({ activeTab }: { activeTab: string }) {
  const [matches] = useState([
    { id: 1, round: "Quarterfinals", teamA: "Sentinels Alpha", teamB: "Fnatic Rising", scoreA: 2, scoreB: 1, status: "Completed", time: "14:00" },
    { id: 2, round: "Quarterfinals", teamA: "Natus Vincere", teamB: "T1 Academy", scoreA: 0, scoreB: 0, status: "Live", time: "Live Now" },
    { id: 3, round: "Semifinals", teamA: "TBD", teamB: "TBD", scoreA: null, scoreB: null, status: "Scheduled", time: "Tomorrow, 16:30" },
  ]);
  if (activeTab !== "MATCHES") return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-4 max-w-4xl mx-auto">
        {matches.map((match) => (
          <div key={match.id} className="bg-[#0f141c] border border-[#2a2e42] rounded-xl overflow-hidden shadow-xl">
            {/* Round Header Label */}
            <div className="bg-[#141923] border-b border-[#2a2e42] px-5 py-2.5 flex justify-between items-center">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">{match.round}</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                match.status === "Live" ? "bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse" :
                match.status === "Completed" ? "bg-slate-800 text-slate-400" :
                "bg-[#222532] text-cyan-400"
              }`}>
                {match.status}
              </span>
            </div>

            {/* Versus Container */}
            <div className="p-6 grid grid-cols-7 items-center text-center">
              {/* Team A */}
              <div className="col-span-2 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1b1e2b] border border-[#2a2e42] flex items-center justify-center text-lg font-black text-white">
                  {match.teamA.charAt(0)}
                </div>
                <span className="font-bold text-sm text-white truncate max-w-full">{match.teamA}</span>
              </div>

              {/* Score and Center Elements */}
              <div className="col-span-3 flex flex-col items-center justify-center gap-1">
                {match.status === "Scheduled" ? (
                  <div className="flex flex-col items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-400 font-medium">{match.time}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <span className={`text-3xl font-black font-mono ${match.scoreA! > match.scoreB! ? "text-[#00FFC6]" : "text-slate-400"}`}>
                      {match.scoreA}
                    </span>
                    <Swords className="w-4 h-4 text-slate-600" />
                    <span className={`text-3xl font-black font-mono ${match.scoreB! > match.scoreA! ? "text-[#00FFC6]" : "text-slate-400"}`}>
                      {match.scoreB}
                    </span>
                  </div>
                )}
              </div>

              {/* Team B */}
              <div className="col-span-2 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1b1e2b] border border-[#2a2e42] flex items-center justify-center text-lg font-black text-white">
                  {match.teamB.charAt(0)}
                </div>
                <span className="font-bold text-sm text-white truncate max-w-full">{match.teamB}</span>
              </div>
            </div>

            {/* Interactive Lower Control Stripe */}
            <div className="bg-[#121620]/50 px-5 py-2.5 border-t border-[#2a2e42]/60 flex justify-end gap-3">
              {match.status === "Live" && (
                <button className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-rose-400" /> Stream
                </button>
              )}
              <button className="text-xs font-bold text-[#00FFC6] hover:underline">Match Details →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}