import { Trophy, Medal } from "lucide-react";

export default function TournamentStandings({ activeTab }: { activeTab: string }) {
  if (activeTab !== "STANDINGS") return null;

  const leaderboard = [
    { rank: 1, name: "Sentinels Alpha", played: 7, won: 6, lost: 1, points: 18, form: ["W", "W", "L", "W", "W"] },
    { rank: 2, name: "Fnatic Rising", played: 7, won: 5, lost: 2, points: 15, form: ["W", "L", "W", "W", "W"] },
    { rank: 3, name: "Natus Vincere", played: 7, won: 4, lost: 3, points: 12, form: ["L", "W", "W", "L", "L"] },
    { rank: 4, name: "T1 Academy", played: 7, won: 2, lost: 5, points: 6, form: ["L", "L", "L", "W", "L"] },
  ];

  return (
    <div className="bg-[#0f141c] border border-[#2a2e42] rounded-xl overflow-hidden max-w-5xl mx-auto shadow-2xl animate-in fade-in duration-200">
      <div className="p-5 border-b border-[#2a2e42] flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[#00FFC6]" />
        <h3 className="font-bold text-lg text-white">Championship Standings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#141923] border-b border-[#2a2e42] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <th className="py-3 px-5 text-center w-16">Rank</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4 text-center">Played</th>
              <th className="py-3 px-4 text-center text-emerald-400">W</th>
              <th className="py-3 px-4 text-center text-rose-400">L</th>
              <th className="py-3 px-4 text-center text-white">PTS</th>
              <th className="py-3 px-5 text-center hidden sm:table-cell">Recent Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e42]/50 text-sm font-medium">
            {leaderboard.map((row) => (
              <tr key={row.rank} className="hover:bg-[#1b212f]/40 transition-colors">
                <td className="py-4 px-5 text-center">
                  {row.rank <= 2 ? (
                    <div className="flex justify-center">
                      <Medal className={`w-5 h-5 ${row.rank === 1 ? "text-amber-400" : "text-slate-300"}`} />
                    </div>
                  ) : (
                    <span className="font-mono text-slate-400">{row.rank}</span>
                  )}
                </td>
                <td className="py-4 px-4 font-bold text-white">{row.name}</td>
                <td className="py-4 px-4 text-center text-slate-300 font-mono">{row.played}</td>
                <td className="py-4 px-4 text-center text-emerald-400/90 font-mono">{row.won}</td>
                <td className="py-4 px-4 text-center text-rose-400/90 font-mono">{row.lost}</td>
                <td className="py-4 px-4 text-center text-[#00FFC6] font-black font-mono text-base">{row.points}</td>
                <td className="py-4 px-5 hidden sm:table-cell">
                  <div className="flex gap-1 justify-center">
                    {row.form.map((res, idx) => (
                      <span key={idx} className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                        res === "W" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}