import { useState } from "react";
import { LeagueModalProps } from "@/interfaces/league-modal";
import {
  LayoutGrid,
  Users,
  Swords,
  BarChart2,
  Settings,
  Upload,
  ChevronDown,
} from "lucide-react";
import { TeamsTab } from "./LeagueTeamTab";

// ─── Constants ───────────────────────────────────────────────

const cardClass = "bg-[#171924] p-6 rounded-xl border border-[#2a2e42]";
const primaryBtn =
  "px-6 py-2.5 bg-[#00FFC6] text-[#003b2f] rounded font-semibold hover:scale-[1.02] transition-all";
const secondaryBtn =
  "px-6 py-2.5 text-slate-400 hover:text-white transition-all";

// ─── Reusable Components ─────────────────────────────────────

function Card({ children }) {
  return <div className={cardClass}>{children}</div>;
}

function Button({ label, variant = "primary", onClick }) {
  return (
    <button
      className={variant === "primary" ? primaryBtn : secondaryBtn}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export const Overview = ({
  league,
  onSave,
  onBack,
}: LeagueModalProps) => {
  const [leagueState, setLeague] = useState(league?.name || "CODM Pro League");
  const [game, setGame] = useState(league?.game || "Call of Duty Mobile");
  const [prize, setPrize] = useState(league?.prize || "50000");
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  return (
    <div className="min-h-screen bg-background text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onBack}
        >
          <span className="text-white text-lg">←</span>
          <h1 className="text-xl font-bold text-white">{game}</h1>
        </div>
        <button className="px-5 py-2 rounded-lg bg-[#00FFC6] text-[#001a13] font-bold text-sm hover:brightness-110 transition-all">
          Publish
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs mb-6 flex justify-center space-x-1">
        {[
          { label: "OVERVIEW", icon: <LayoutGrid size={20} /> },
          { label: "TEAMS", icon: <Users size={20} /> },
          { label: "MATCHES", icon: <Swords size={20} /> },
          { label: "STANDINGS", icon: <BarChart2 size={20} /> },
          { label: "SETTINGS", icon: <Settings size={20} /> },
        ].map(({ label, icon }) => {
          const isActive = label === activeTab; // your active tab state
          return (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-t-lg text-[10px] font-bold tracking-widest transition-all
          ${
            isActive
              ? "bg-[#1a1d2e] text-[#00FFC6] border border-[#00FFC6]/40 shadow-[0_2px_0_0_#00FFC6]"
              : "text-gray-400 hover:text-gray-200 bg-transparent"
          }`}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>
      {/* Hero */}
        {activeTab === "OVERVIEW" && (
          <>
      <div className="relative h-52 mb-6 rounded-xl overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsNpezIyvYkNgk7nfe2OaxbcoidVZAW8ZrUfVhCSljXXtyitzZtgmr_Tf7SkM506b__z0fxYfV0sAHpm2p7WUX4MvwZGcMqHl2rC433NUGBoQLphuRLTBolZOusp3JBeqQVV82dqVoT0i9lJ6FqArBgqGLUHFtGI42upsIgrnzLBSJ9C9Mt7kxQknEzbDyykJoEh7lMKz1NRkARTZdqlyiJEsMPeRA5p35cnutggFZ0KDpDUIhnz-P2AFYfgmvNmRTsS-sbJ7gWa4"
          alt="hero"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute bottom-4 left-4">
          <span className="bg-[#00FFC6]/10 text-[#00FFC6] text-sm font-medium py-1 px-3 rounded-full mb-2 inline-block">
            PRO LEAGUE SERIES
          </span>
          <h2 className="text-3xl font-bold">League Overview</h2>
          <p className="text-base font-medium mt-2 text-slate-400">
            Manage the core parameters, schedule, and prize distribution for
            upcoming Spring 2025 Mobile Championship
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="mb-4 font-bold text-lg">General Information</h3>
              <span className="bg-slate-400/10 text-sm font-medium text-center py-2 px-3">
                <h3 className="text-xs text-[#AAAAB7]">LAST SAVED: 2M AGO</h3>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* League Name */}
              <div>
                <p className="text-sm font-medium text-[#AAAAB7] mb-2">
                  LEAGUE NAME
                </p>
                <input
                  placeholder="CODM Pro League"
                  className="w-full bg-[#222532] rounded-lg px-4 py-3 text-sm text-[#f0f0fd] focus:ring-2 focus:ring-[#00FFC6] focus:bg-[#1b1e2b] outline-none"
                />
              </div>

              {/* Game */}
              <div>
                <p className="text-sm font-medium text-[#AAAAB7] mb-2">GAME</p>
                <input
                  placeholder="Call of Duty Mobile"
                  className="w-full bg-[#222532] rounded-lg px-4 py-3 text-sm text-[#f0f0fd] focus:ring-2 focus:ring-[#00FFC6] focus:bg-[#1b1e2b] outline-none"
                />
              </div>

              {/* Season */}
              <div>
                <p className="text-sm font-medium text-[#AAAAB7] mb-2">
                  SEASON
                </p>

                <div className="relative">
                  <select className="w-full appearance-none bg-[#222532] rounded-lg px-4 pr-12 py-3 text-sm text-[#f0f0fd] focus:ring-2 focus:ring-[#00FFC6] outline-none">
                    <option>Spring 2025</option>
                    <option>Summer 2025</option>
                    <option>Fall 2025</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm font-medium text-[#AAAAB7] mb-2">
                  STATUS
                </p>
                <div className="flex gap-2">
                  {["Active", "Upcoming", "Completed"].map((s, i) => (
                    <button
                      key={s}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${
            i === 0
              ? "bg-[#00FFC6]/10 text-[#00FFC6] border border-[#00FFC6]/30"
              : "bg-[#222532] text-slate-400 hover:text-white"
          }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prize Pool */}
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-[#AAAAB7] mb-2">
                  PRIZE POOL ALLOCATION
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    className="w-full bg-[#222532] rounded-lg pl-8 pr-4 py-3 text-lg font-semibold text-[#f0f0fd] focus:ring-2 focus:ring-[#00FFC6] outline-none"
                  />
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 flex rounded overflow-hidden">
                  <div className="w-[60%] bg-[#00FFC6]" />
                  <div className="w-[25%] bg-[#6dddff]" />
                  <div className="w-[15%] bg-slate-600" />
                </div>

                <div className="flex justify-between text-xs mt-1 text-slate-400">
                  <span>1ST: $30K</span>
                  <span>2ND: $12.5K</span>
                  <span>3RD: $7.5K</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 rounded-xl">
              <Button
                label="Discard Changes"
                variant="secondary"
                onClick={() => {}}
              />
              <Button label="Save Changes" onClick={() => {}} />
            </div>
          </Card>

          <Card>
            <h3 className="mb-6 font-bold text-lg">League Lifecycle</h3>

            <div className="relative pl-6 space-y-8">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#2a2e42]" />

              {/* Item */}
              <div className="flex gap-4 items-start">
                <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#1b2e2a] border border-[#00FFC6]">
                  <span className="text-[#00FFC6] text-xs">✓</span>
                </div>

                <div>
                  <p className="text-sm font-semibold">Registration Phase</p>
                  <p className="text-xs text-slate-400">
                    Jan 15 - Feb 10, 2025
                  </p>
                </div>
              </div>

              {/* Item */}
              <div className="flex gap-4 items-start">
                <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#1b2e2a] border border-[#00FFC6]">
                  <span className="text-[#00FFC6] text-xs">↻</span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#00FFC6]">
                    Live Season
                  </p>
                  <p className="text-xs text-slate-400">
                    Feb 15 - Apr 30, 2025 (In Progress)
                  </p>
                </div>
              </div>

              {/* Item */}
              <div className="flex gap-4 items-start opacity-40">
                <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#222532]">
                  <span className="text-xs">🏆</span>
                </div>

                <div>
                  <p className="text-sm font-semibold">Grand Finals</p>
                  <p className="text-xs text-slate-400">
                    May 15 - May 18, 2025
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h4 className="mb-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Quick Stats
            </h4>
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    Registered Teams
                  </p>
                  <p className="text-3xl font-bold text-white">
                    24<span className="text-gray-500">/32</span>
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#00FFC6] mt-1">
                  +12%
                </span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Peak Viewers</p>
                  <p className="text-3xl font-bold text-white">14.2k</p>
                </div>
                <span className="text-xs font-semibold text-cyan-400 mt-1">
                  +5.4k
                </span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Total Matches</p>
                  <p className="text-3xl font-bold text-white">114</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">0 Pending</span>
              </div>
            </div>
          </Card>
          <Card>
            <h4 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
              Game Banner
            </h4>
            <button
              onClick={() => document.getElementById("banner-upload")?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#111827] border border-white/10 text-white font-medium hover:border-[#00FFC6]/40 hover:text-[#00FFC6] transition-all group"
            >
              <Upload
                size={18}
                className="text-[#00FFC6] group-hover:scale-110 transition-transform"
              />
              Upload Game Banner
            </button>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) console.log("Selected:", file.name); // replace with your handler
              }}
            />
          </Card>
        </div>
      </div>
      </>
        )}

      {/* Teams Tab */}
      <TeamsTab activeTab={activeTab} />
    </div>
  );
};
