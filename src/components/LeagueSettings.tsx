import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SettingsTab({ activeTab }) {
  const [visibility, setVisibility] = useState(true);
  const [teams, setTeams] = useState(16);

  if (activeTab !== "SETTINGS") return null;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold">League Settings</h2>
        <p className="text-base text-gray-400 mt-2 max-w-xl">
          Configure the core parameters and visibility rules for your competitive bracket.
          <br />
          Changes will reflect across all participant dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* General Configuration */}
          <div className="bg-[#2C2C2C] p-8 rounded-xl border border-[#2a2a2a] relative space-y-4">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FFC6] rounded-l-xl" />

            <h3 className="text-xl text-[#00FFC6] mb-5 font-semibold">
              General Configuration
            </h3>

            {/* League Format */}
            <div className="mb-6">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                League Format
              </label>

              <div className="mt-2 relative">
                <select className="w-full appearance-none bg-[#353535] border border-[#2a2a2a] px-3 py-4 rounded text-sm text-white focus:outline-none">
                  <option>Round Robin</option>
                </select>
              <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
              </div>

              <p className="text-[11px] text-gray-500 mt-2">
                Every team plays against every other team in the tournament.
              </p>
            </div>

            {/* Max Teams */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-gray-400 uppercase tracking-wide">
                  Max Teams
                </label>
                <span className="text-sm text-white">{teams}</span>
              </div>

              <input
                type="range"
                min="4"
                max="64"
                value={teams}
                onChange={(e) => setTeams(Number(e.target.value))}
                className="w-full mt-3 accent-[#00FFC6]"
              />

              <p className="text-[11px] text-gray-500 mt-2">
                Maximum capacity for participant slots (Minimum 4, Maximum 64).
              </p>
            </div>
          </div>

          {/* Accessibility & Visibility */}
          <div className="bg-[#2C2C2C] p-8 rounded-xl border border-[#2a2a2a] relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FFC6] rounded-l-xl" />

            <h3 className="text-sm text-[#00FFC6] mb-5 font-semibold">
              Accessibility & Visibility
            </h3>

            <div className="flex justify-between items-center bg-[#353535] border border-[#2a2e42] rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium">Public Visibility</p>
                <p className="text-xs text-gray-400">
                  Allow anyone to view bracket and league stats.
                </p>
              </div>

              <button
                onClick={() => setVisibility(!visibility)}
                className={`w-11 h-6 flex items-center rounded-full px-1 ${
                  visibility ? "bg-[#00FFC6]" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition ${
                    visibility ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 p-2">
          <div className="bg-[#2C2C2C] p-4 rounded-xl border border-[#2a2a2a]">
            <div className="h-60 w-full rounded-lg bg-[#353535] flex items-center justify-center mb-4">
              <span className="text-xs font-semibold text-[#00FFC6] bg-[#00FFC6]/10 rounded-full px-2 py-1">
                TIER 1 LEAGUE
              </span>
            </div>

            <p className="text-lg font-medium mb-1">League Identity</p>
            <p className="text-sm text-gray-400 mb-3">
              Update the visual representation of this league across the platform.
            </p>

            <button className="w-full bg-[#2a2a2a] border border-[#2c2c2c] py-2 rounded text-xs">
              Upload Artwork
            </button>
          </div>

          <div className="bg-[#2C2C2C] p-4 rounded-xl border border-[#2a2a2a]">
            <p className="text-lg text-gray-400 mb-2">League Status</p>
            <p className="text-sm text-[#00FFC6] font-medium">• Active & Live</p>
            <p className="text-sm text-gray-500 mt-1">
              System is active with registrations open.
            </p>
          </div>
        </div>
      </div>
      {/* Danger Zone */}
          <div className="bg-[#2a0f14] p-6 rounded-xl border border-[#5a1f28]">
            <h3 className="text-sm text-red-400 mb-2 font-semibold">
              Danger Zone
            </h3>

            <p className="text-xs text-gray-300 mb-4">
              Permanently remove this league, all history, matches, and participant data.
              This action is irreversible.
            </p>

            <button className="bg-[#ff5c5c] px-5 py-2 rounded text-sm font-medium">
              Delete League
            </button>
          </div>
    </div>
  );
}