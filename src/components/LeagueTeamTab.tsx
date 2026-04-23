import React from "react";

const teams = [
  {
    logo: "/path/to/void-runners-logo.png",
    name: "VOID RUNNERS",
    tier: "Tier 1 • NA East",
    players: "5 / 6",
    wins: 24,
    losses: 4,
  },
  {
    logo: "/path/to/neon-phantoms-logo.png",
    name: "NEON PHANTOMS",
    tier: "Tier 1 • EU West",
    players: "6 / 6",
    wins: 21,
    losses: 7,
  },
  {
    logo: "/path/to/glitch-legion-logo.png",
    name: "GLITCH LEGION",
    tier: "Tier 2 • SEA",
    players: "5 / 6",
    wins: 18,
    losses: 10,
  },
  {
    logo: "/path/to/static-shock-logo.png",
    name: "STATIC SHOCK",
    tier: "Tier 1 • NA West",
    players: "6 / 6",
    wins: 15,
    losses: 13,
  },
  {
    logo: "/path/to/ronin-ghosts-logo.png",
    name: "RONIN GHOSTS",
    tier: "Tier 1 • SA",
    players: "4 / 6",
    wins: 12,
    losses: 16,
  },
];

export const TeamsTab = ({ activeTab }) => {
  if (activeTab !== "TEAMS") return null;

  return (
    <div className="bg-sidebar text-white p-6 rounded-xl border border-[#1c2235]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-[#00FFC6] uppercase tracking-wide mb-1">
            Ecosystem Management
          </p>
          <h2 className="text-3xl font-bold">Registered Teams</h2>
        </div>

        <button className="bg-[#00FFC6] text-black px-4 py-2 rounded-md font-medium">
          + Add Team
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "TOTAL TEAMS", value: 32 },
          { label: "ACTIVE ROOSTERS", value: 160 },
          { label: "TOTAL PRIZE POOL", value: "$50,000" },
          { label: "PENDING VERIFICATION", value: 4 },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#2C2C2C] p-6 space-y-4 rounded-lg border border-sidebar"
          >
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-lg font-semibold">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#2C2C2C] rounded-lg border border-[#1c2235] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-[#1c2235] uppercase">
            <tr>
              <th className="text-left p-3">Team Name</th>
              <th className="text-left p-3">Players Count</th>
              <th className="text-left p-3">Wins</th>
              <th className="text-left p-3">Losses</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team, i) => (
              <tr
                key={i}
                className="border-b border-[#1c2235] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-9 h-9 rounded-md border border-[#2a2e42]"
                    />
                    <div>
                      <p className="font-semibold">{team.name}</p>
                      <p className="text-xs text-gray-400">{team.tier}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{team.players}</td>
                <td className="p-3 text-[#00FFC6]">{team.wins}</td>
                <td className="p-3 text-red-500">{team.losses}</td>
                <td className="p-3">...</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-center p-3 text-xs text-gray-400">
          <span>Showing 5 of 32 Teams</span>

          <div className="flex gap-2">
            <button className="px-2 py-1 bg-background rounded">Prev</button>
            <button className="px-2 py-1 bg-[#00FFC6] text-black rounded">
              1
            </button>
            <button className="px-2 py-1 bg-background rounded">2</button>
            <button className="px-2 py-1 bg-background rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
