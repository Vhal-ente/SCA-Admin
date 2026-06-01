import React from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Play, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Edit2
} from 'lucide-react';

// --- Types & Interfaces ---
interface MatchItem {
  id: string;
  teamA: string;
  teamALogo: string;
  teamB: string;
  teamBLogo: string;
  scoreA: number;
  scoreB: number;
  status: 'LIVE' | 'SCHEDULED' | 'COMPLETED';
}

interface UpcomingMatch {
  date: string;
  time: string;
  teamA: string;
  teamB: string;
}

// --- Mock Data ---
const matchesData: MatchItem[] = [
  { id: '#12984-LX', teamA: 'Team Liquid', teamALogo: 'TL', teamB: 'G2 Esports', teamBLogo: 'G2', scoreA: 3, scoreB: 2, status: 'LIVE' },
  { id: '#12985-AZ', teamA: 'FaZe Clan', teamALogo: 'FC', teamB: 'Natus Vincere', teamBLogo: 'NV', scoreA: 0, scoreB: 0, status: 'SCHEDULED' },
  { id: '#12989-GR', teamA: 'Cloud9', teamALogo: 'C9', teamB: 'Vitality', teamBLogo: 'VT', scoreA: 3, scoreB: 0, status: 'COMPLETED' },
  { id: '#12990-YY', teamA: 'Sentinels', teamALogo: 'SEN', teamB: 'T1', teamBLogo: 'T1', scoreA: 1, scoreB: 1, status: 'LIVE' },
];

const upcomingMatches: UpcomingMatch[] = [
  { date: '04 OCT', time: '18:30 GMT', teamA: 'NAVI', teamB: 'FAZE' },
  { date: '04 OCT', time: '20:45 GMT', teamA: 'CLOUD9', teamB: 'T1' }
];

export default function MatchTab( { activeTab }: { activeTab: string }) {
    
  if (activeTab !== "MATCHES") return null;

  return (
    <div className="flex flex-col space-y-6 w-full text-[#94a3b8] font-sans antialiased relative pb-16">
      
      {/* --- TOP METRICS CARDS ROW --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Matches */}
        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Matches</p>
            <p className="text-3xl font-black text-white mt-1 tracking-tight">128</p>
          </div>
          <p className="text-[10px] text-[#00FFC6] font-bold mt-4">↑ +12 from last week</p>
        </div>

        {/* Completed */}
        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Completed</p>
            <p className="text-3xl font-black text-white mt-1 tracking-tight">84</p>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-[#1e293b]/50 h-1 rounded-full overflow-hidden">
              <div className="bg-[#00FFC6] h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* Live Now */}
        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-5 flex flex-col justify-between relative">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Live Now</p>
            <p className="text-3xl font-black text-rose-500 mt-1 tracking-tight">03</p>
          </div>
          <span className="absolute bottom-5 right-5 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]" />
        </div>

        {/* Scheduled */}
        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Scheduled</p>
            <p className="text-3xl font-black text-white mt-1 tracking-tight">41</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Calendar className="w-4 h-4 text-[#00FFC6]" />
          </div>
        </div>
      </section>

      {/* --- ACTIVE SCHEDULE CONTROL TABLE --- */}
      <section className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-5 flex flex-col space-y-4">
        {/* Table Filter Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-white tracking-wide">Active Schedule</h3>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search match ID or team..." 
                className="w-full bg-transparent border border-white/40 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-400 placeholder-gray-400 focus:outline-none transition-colors"
              />
            </div>
            {/* Filter Toggle */}
            <button className="p-2 bg-[#2A2A2A] border border-[#2A2A2A]/40 rounded-lg hover:text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Schedule List / Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-[#1e293b]/30 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Match ID</th>
                <th className="pb-3 font-semibold">Teams (A vs B)</th>
                <th className="pb-3 font-semibold text-center w-28">Score</th>
                <th className="pb-3 font-semibold text-center w-32">Status</th>
                <th className="pb-3 font-semibold text-right w-16">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/20 font-medium">
              {matchesData.map((match) => (
                <tr key={match.id} className="hover:bg-[#141b26]/30 transition-colors group">
                  {/* Match ID */}
                  <td className="py-4 text-gray-400 font-mono text-[11px]">{match.id}</td>
                  
                  {/* Teams Configuration */}
                  <td className="py-4">
                    <div className="flex items-center space-x-3 text-white font-bold">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-[9px] text-white">{match.teamALogo}</div>
                        <span>{match.teamA}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal lowercase">vs</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-[9px] text-white">{match.teamBLogo}</div>
                        <span>{match.teamB}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Scores Block */}
                  <td className="py-4">
                    <div className="flex items-center justify-center space-x-1 font-black">
                      <span className="w-7 py-1 bg-[#07090d] text-center rounded text-white border border-[#1e293b]/20">{match.scoreA}</span>
                      <span className="text-slate-600 px-0.5">-</span>
                      <span className="w-7 py-1 bg-[#07090d] text-center rounded text-white border border-[#1e293b]/20">{match.scoreB}</span>
                    </div>
                  </td>
                  
                  {/* Status Badges */}
                  <td className="py-4 text-center">
                    <div className="flex justify-center">
                      {match.status === 'LIVE' && (
                        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[9px] font-black tracking-widest rounded uppercase animate-pulse">
                          ● Live
                        </span>
                      )}
                      {match.status === 'SCHEDULED' && (
                        <span className="px-2 py-0.5 bg-slate-800/60 border border-slate-700/50 text-slate-400 text-[9px] font-bold tracking-widest rounded uppercase">
                          Scheduled
                        </span>
                      )}
                      {match.status === 'COMPLETED' && (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-[#00FFC6] text-[9px] font-black tracking-widest rounded uppercase">
                          Completed
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Edit Option Icon */}
                  <td className="py-4 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors p-1">
                      {match.status === 'LIVE' ? (
                        <ExternalLink className="w-3.5 h-3.5 text-[#00FFC6]" />
                      ) : (
                        <Edit2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Table Control Pagination */}
        <div className="flex justify-between items-center pt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Showing 1-10 of 128 matches</span>
          <div className="flex items-center bg-[#07090d] border border-[#1e293b]/30 rounded-lg p-0.5 text-xs">
            <button className="p-1.5 hover:text-white transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="px-2.5 py-1 bg-[#142324] text-[#00FFC6] font-black rounded-md">1</button>
            <button className="px-2.5 py-1 hover:text-white transition-colors">2</button>
            <button className="px-2.5 py-1 hover:text-white transition-colors">3</button>
            <button className="p-1.5 hover:text-white transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </section>

      {/* --- BOTTOM ROW: LIVE STREAM & UPCOMING SECTIONS --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Streaming Block (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Live Streaming Now</h4>
          <div className="w-full h-56 bg-slate-900 border border-[#1e293b]/40 rounded-xl relative overflow-hidden group shadow-lg flex items-end p-6">
            
            {/* Cyberpunk Style Virtual Arena Background Fallback Pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-slate-950 opacity-90" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-xl" />

            {/* Play Badge Icon */}
            <button className="absolute top-4 right-4 bg-[#00FFC6] hover:scale-105 transition-transform text-[#07090d] p-2 rounded-lg z-20 shadow-lg shadow-emerald-500/20">
              <Play className="w-4 h-4 fill-current" />
            </button>

            {/* Content overlay */}
            <div className="z-20 flex flex-col space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#00FFC6]">Grand Finals Warmup</span>
              <h2 className="text-base font-black text-white tracking-wide">Team Liquid vs G2 Esports</h2>
            </div>
          </div>
        </div>

        {/* Next Up / Upcoming Matches Section (1 col wide) */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Next Up</h4>
          <div className="flex-1 flex flex-col space-y-3">
            {upcomingMatches.map((upMatch, idx) => (
              <div key={idx} className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex flex-col space-y-3 justify-between relative">
                
                {/* Meta details Header */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-wide">
                  <span>{upMatch.date} • {upMatch.time}</span>
                  <Calendar className="w-3 h-3 text-[#00FFC6]/70" />
                </div>

                {/* Team Previews Display */}
                <div className="flex items-center justify-center space-x-6 text-xs font-black text-white py-1">
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-[10px]" />
                    <span className="tracking-wide">{upMatch.teamA}</span>
                  </div>
                  <span className="text-[10px] text-[#00FFC6] font-black tracking-widest">VS</span>
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-[10px]" />
                    <span className="tracking-wide">{upMatch.teamB}</span>
                  </div>
                </div>

                {/* Action Link Row */}
                <button className="w-full py-1.5 bg-[#1c1c1c] hover:bg-[#161616] text-[10px] font-bold text-gray-400 uppercase tracking-wider rounded-lg border border-[#1e293b]/30 transition-colors">
                  Match Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Global Fast Creation Plus Trigger Button */}
      <button className="fixed bottom-6 right-6 bg-[#4ade80] text-[#07090d] p-3.5 rounded-xl shadow-xl shadow-emerald-500/20 hover:bg-[#3ec973] transition-all duration-200 group z-50">
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
      </button>

    </div>
  );
}