import React from 'react';
import { Gamepad2, TrendingUp, UserCheck } from 'lucide-react';

// --- Types & Interfaces ---
interface TeamStanding {
  position: string;
  name: string;
  region: string;
  logo: string;
  played: number;
  wins: number;
  losses: number;
  gd: string;
  points: number;
}

// --- Mock Data ---
const standingsData: TeamStanding[] = [
  { position: '01', name: 'Nova Esports', region: 'Pacific West', logo: 'NE', played: 12, wins: 10, losses: 2, gd: '+18', points: 30 },
  { position: '02', name: 'Blaze Squad', region: 'Atlantic East', logo: 'BS', played: 12, wins: 9, losses: 3, gd: '+12', points: 27 },
  { position: '03', name: 'Dragon Elite', region: 'Pacific West', logo: 'DE', played: 12, wins: 8, losses: 4, gd: '+5', points: 24 },
  { position: '04', name: 'Arctic Kings', region: 'North Division', logo: 'AK', played: 12, wins: 7, losses: 5, gd: '0', points: 21 },
  { position: '05', name: 'Shadow Void', region: 'Atlantic East', logo: 'SV', played: 11, wins: 6, losses: 5, gd: '-2', points: 18 },
];

export default function LeagueStandings({ activeTab }: { activeTab: string }) {

    if (activeTab !== "STANDINGS") return null;

  return (
    <div className="flex flex-col space-y-6 w-full text-[#94a3b8] font-sans antialiased">
      
      {/* --- LEAGUE STANDINGS MAIN CARD --- */}
        {/* Table Control Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">League Standings</h2>
            <p className="text-base text-gray-400 mt-1">Real-time performance metrics and ranking management.</p>
          </div>
          
          {/* Toggle Switches */}
          <div className="flex items-center bg-[#07090d] p-1 rounded-lg border border-[#1e293b]/30 text-xs font-bold">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider px-2">Mode:</span>
            <button className="bg-[#142324] text-[#00FFC6] px-3 py-1.5 rounded-md transition-all">
              Auto Calculate
            </button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 transition-all">
              Manual Edit
            </button>
          </div>
        </div>
      <section className="bg-[#0f141c] border border-[#2C2C2C]/40 rounded-2xl p-6 flex flex-col space-y-6">
        {/* Standings Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-[#1e293b]/40 uppercase tracking-wider text-[10px]">
                <th className="pb-4 font-semibold w-20">Position</th>
                <th className="pb-4 font-semibold">Team</th>
                <th className="pb-4 font-semibold text-center w-24">Played</th>
                <th className="pb-4 font-semibold text-center w-24">Wins</th>
                <th className="pb-4 font-semibold text-center w-24">Losses</th>
                <th className="pb-4 font-semibold text-center w-24">GD</th>
                <th className="pb-4 font-semibold text-right w-24">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/20 font-medium">
              {standingsData.map((team) => (
                <tr 
                  key={team.position} 
                  className={`hover:bg-[#141b26]/30  transition-colors group ${
                    team.position === '01' ? 'bg-[#142324]/10' : ''
                  }`}
                >
                  {/* Position */}
                  <td className={`py-4 font-bold text-sm ${team.position === '01' ? 'text-[#00FFC6]' : 'text-gray-400'}`}>
                    {team.position}
                  </td>
                  
                  {/* Team Profile */}
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-inner">
                        {team.logo}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-wide group-hover:text-[#00FFC6] transition-colors">{team.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{team.region}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Stats Fields */}
                  <td className="py-4 text-center text-slate-300 text-sm">{team.played}</td>
                  <td className="py-4 text-center text-[#00FFC6] font-bold text-sm">{team.wins}</td>
                  <td className="py-4 text-center text-rose-400 font-bold text-sm">{team.losses}</td>
                  <td className="py-4 text-center text-slate-300 text-sm font-semibold">{team.gd}</td>
                  
                  {/* Total Points */}
                  <td className={`py-4 text-right text-base font-black ${
                    team.position === '01' ? 'text-[#00FFD4]' : 'text-[#00FFC6]'
                  }`}>
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- BOTTOM SUMMARY METRICS --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Matches */}
        <div className="bg-[#0f141c] border border-[#2C2C2C]/40 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Matches</p>
              <p className="text-4xl font-black text-white mt-2 tracking-tight">144</p>
            </div>
            <div className="p-2 bg-[#142324] rounded-lg border border-[#00FFC6]/20">
              <Gamepad2 className="w-4 h-4 text-[#00FFC6]" />
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-[#1e293b]/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#00FFC6] h-full rounded-full shadow-[0_0_8px_#00FFC6]" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wide">75% of Regular Season Complete</p>
          </div>
        </div>

        {/* Card 2: Avg Score */}
        <div className="bg-[#0f141c] border border-[#2C2C2C]/40 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Score</p>
              <p className="text-4xl font-black text-white mt-2 tracking-tight">248.5</p>
            </div>
            <div className="p-2 bg-[#142324] rounded-lg border border-[#00FFC6]/20">
              <TrendingUp className="w-4 h-4 text-[#00FFC6]" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center space-x-1 text-[#00FFC6] text-xs font-bold">
              <span>↑ 12.4% from last week</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide">Hardpoint and S&D aggregated</p>
          </div>
        </div>

        {/* Card 3: Active Pro-Players */}
        <div className="bg-[#0f141c] border border-[#2C2C2C]/40 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Pro-Players</p>
              <p className="text-4xl font-black text-white mt-2 tracking-tight">42</p>
            </div>
            <div className="p-2 bg-[#142324] rounded-lg border border-[#00FFC6]/20">
              <UserCheck className="w-4 h-4 text-[#00FFC6]" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            {/* Stacked User Avatars */}
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full bg-slate-700 border border-[#0f141c]"></div>
              <div className="inline-block h-6 w-6 rounded-full bg-slate-600 border border-[#0f141c]"></div>
              <div className="inline-block h-6 w-6 rounded-full bg-slate-500 border border-[#0f141c]"></div>
              <div className="inline-block h-6 w-6 rounded-full bg-[#1e293b] border border-[#0f141c] flex items-center justify-center text-[8px] font-bold text-slate-400">
                +39
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Verified roster submissions</p>
          </div>
        </div>

      </section>
    </div>
  );
}