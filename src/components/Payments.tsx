import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Activity, Terminal, ArrowUpRight } from 'lucide-react';

export default function PaymentsTab() {
  const [showSecret, setShowSecret] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
      {/* Form Settings Configuration Column */}
      <div className="lg:col-span-2 bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#1e293b]/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950/40 border border-teal-500/20 flex items-center justify-center text-teal-400">🏦</div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Paystack Integration</h3>
              <p className="text-[11px] text-slate-500">GLOBAL PAYOUTS & COLLECTIONS</p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enable Paystack</span>
            <button 
              onClick={() => setIsEnabled(!isEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${isEnabled ? 'bg-[#4ade80]' : 'bg-slate-800'}`}
            >
              <span className={`w-3.5 h-3.5 rounded-full bg-[#07090d] absolute transition-all ${isEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-4 text-xs font-bold">
          <div className="flex flex-col space-y-1.5">
            <label className="text-slate-400 uppercase tracking-wider text-[10px]">Public Key</label>
            <input type="text" placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-[#07090d] border border-[#1e293b]/40 rounded-lg px-3 py-2 text-slate-400 font-mono focus:outline-none" />
          </div>

          <div className="flex flex-col space-y-1.5 relative">
            <label className="text-slate-400 uppercase tracking-wider text-[10px]">Secret Key</label>
            <div className="relative">
              <input type={showSecret ? "text" : "password"} placeholder="sk_live_thisisafakesecretkeyforviewportrepresentationonly" className="w-full bg-[#07090d] border border-[#1e293b]/40 rounded-lg pl-3 pr-10 py-2 text-slate-400 font-mono focus:outline-none" />
              <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-slate-400 uppercase tracking-wider text-[10px]">Webhook URL</label>
            <div className="relative">
              <input type="text" placeholder="https://api.kineticvoid.gg/webhooks/paystack" className="w-full bg-[#07090d] border border-[#1e293b]/40 rounded-lg pl-3 pr-10 py-2 text-slate-400 font-mono focus:outline-none" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-slate-400 uppercase tracking-wider text-[10px]">Default Currency</label>
            <select className="w-full bg-[#07090d] border border-[#1e293b]/40 rounded-lg px-3 py-2 text-slate-300 focus:outline-none">
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - United States Dollar</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-3 border-t border-[#1e293b]/10 text-[10px]">
            <p className="text-slate-600 font-semibold">🔒 Your credentials are encrypted using AES-256 GCM.</p>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button className="px-4 py-2 bg-transparent hover:bg-slate-800/40 text-slate-300 font-black border border-[#1e293b]/60 rounded-lg transition-colors uppercase tracking-wider">Test Connection</button>
              <button className="px-4 py-2 bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] font-black rounded-lg transition-colors uppercase tracking-wider">Save Settings</button>
            </div>
          </div>
        </form>
      </div>

      {/* Sidebar Health Widgets Panel */}
      <div className="flex flex-col space-y-4 w-full">
        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex flex-col space-y-3">
          <h4 className="text-xs font-bold text-white tracking-wide">Integration Health</h4>
          <div className="divide-y divide-[#1e293b]/20 text-[11px] font-bold">
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500">API Status</span>
              <span className="text-emerald-400 font-black flex items-center space-x-1 uppercase">
                <Activity className="w-3 h-3" /> <span>● Operational</span>
              </span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500">Last Payout</span>
              <span className="text-slate-300">2h ago</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 flex flex-col space-y-3">
          <div className="w-full h-20 bg-slate-950/60 rounded-lg border border-[#1e293b]/20 flex items-center justify-center p-3 text-slate-500 font-mono text-[9px] text-center select-none relative">
            <Terminal className="w-10 h-10 text-slate-900/30 absolute" />
            <span className="relative">WEBHOOK_RECEIVED (200 OK)<br />event: charge.success</span>
          </div>
          <h4 className="text-xs font-bold text-white tracking-wide">Developer Logs</h4>
          <button className="w-full py-1.5 bg-[#1e293b]/40 hover:bg-[#1e293b]/80 text-xs text-slate-300 font-bold uppercase tracking-wider border border-[#1e293b]/60 rounded-lg transition-colors flex items-center justify-center space-x-1">
            <span>View Logs</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}