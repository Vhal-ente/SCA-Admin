import { useState } from "react";
import { ShieldAlert, EyeOff, Save, Trash2 } from "lucide-react";

export default function SettingsTab({ activeTab }: { activeTab: string }) {
  const [notifications, setNotifications] = useState(true);
  const [publicView, setPublicView] = useState(true);

  if (activeTab !== "SETTINGS") return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Visibility Block */}
      <div className="bg-[#0f141c] border border-[#2a2e42] rounded-xl p-6">
        <h3 className="font-bold text-lg mb-1 text-white">General Preferences</h3>
        <p className="text-xs text-slate-400 mb-6">Configure platform access states and background operational webhooks.</p>

        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <label className="text-sm font-bold text-white block mb-1">Public Bracket Visibility</label>
              <span className="text-xs text-slate-400">Allow anonymous guest users to inspect brackets, schedules, and matches.</span>
            </div>
            <input 
              type="checkbox" 
              checked={publicView} 
              onChange={() => setPublicView(!publicView)}
              className="w-4 h-4 mt-1 accent-[#00FFC6] cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-start gap-4 pt-4 border-t border-[#2a2e42]/50">
            <div>
              <label className="text-sm font-bold text-white block mb-1">Match Automation Notifications</label>
              <span className="text-xs text-slate-400">Ping discord webhooks automatically when match scores are submitted.</span>
            </div>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)}
              className="w-4 h-4 mt-1 accent-[#00FFC6] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1c1216] border border-rose-950 rounded-xl p-6">
        <div className="flex items-center gap-2 text-rose-400 mb-2">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-bold text-lg">Danger Zone</h3>
        </div>
        <p className="text-xs text-rose-300/70 mb-4">Actions here are permanent and cannot be reversed under any circumstance.</p>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-rose-950/20 rounded-lg border border-rose-900/30 gap-4">
          <div>
            <p className="text-sm font-bold text-rose-200">Archive this Tournament</p>
            <p className="text-xs text-rose-400/80">Freeze all mutations, match schedules, and roster adjustments.</p>
          </div>
          <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-900/40 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded border border-rose-700/40 transition-colors">
            <EyeOff className="w-3.5 h-3.5" /> Archive
          </button>
        </div>
      </div>

      {/* Footer Update Row */}
      <div className="flex justify-end gap-3 pt-2">
        <button className="px-5 py-2.5 bg-[#222532] text-slate-300 hover:text-white text-sm font-bold rounded-lg transition-colors">
          Reset to Default
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#00FFC6] text-[#003b2f] text-sm font-bold rounded-lg hover:scale-[1.02] transition-all">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}