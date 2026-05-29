import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Bell, 
  User 
} from 'lucide-react';
import TransactionsTab from "@/components/Transactions";
import PaymentsTab from "@/components/Payments";

// --- Types & Interfaces ---
interface SettlementRow {
  id: string;
  leagueName: string;
  badgeText: string;
  badgeBg: string;
  payoutDate: string;
  participants: string;
  totalPool: string;
  status: 'SETTLED' | 'IN PROGRESS' | 'UPCOMING';
}

// Added 'overview' to type matching your UI button goals
type SubTab = 'overview' | 'transactions' | 'settings';

// --- Mock Data ---
const settlementData: SettlementRow[] = [
  { 
    id: '1', 
    leagueName: 'Void Series: Alpha', 
    badgeText: 'VS', 
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 
    payoutDate: 'Oct 24, 2023', 
    participants: '64 Teams', 
    totalPool: '$12,000.00', 
    status: 'SETTLED' 
  },
  { 
    id: '2', 
    leagueName: 'Cyber Hunter Invitational', 
    badgeText: 'CH', 
    badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', 
    payoutDate: 'Nov 12, 2023', 
    participants: '128 Teams', 
    totalPool: '$25,500.00', 
    status: 'IN PROGRESS' 
  },
  { 
    id: '3', 
    leagueName: 'Neon Knight Cup', 
    badgeText: 'NK', 
    badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30', 
    payoutDate: 'Nov 28, 2023', 
    participants: '32 Teams', 
    totalPool: '$4,200.00', 
    status: 'UPCOMING' 
  },
];

const Finance = () => {
  // Set default state tab to overview to show the main overview page layout first
  const [activeTab, setActiveTab] = useState<SubTab>('overview');

  return (
    <div className="p-8 space-y-6 w-full text-[#94a3b8] font-sans antialiased">
      
      {/* --- TOP BRAND / ACTION BAR --- */}
      <header className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">Finance</h1>
          <p className="text-xs text-slate-500 mt-1">Manage revenue, registration fees, and payouts across all active leagues.</p>
        </div>
        
        {/* Right Corner Shell Utilities */}
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-[#0f141c] text-slate-400 hover:text-white rounded-lg border border-[#1e293b]/40 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </button>
          <button className="p-2 bg-[#0f141c] text-slate-400 hover:text-white rounded-lg border border-[#1e293b]/40 transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- PANEL TITLE & SUB TABS NAVIGATION --- */}
      <section className="border-b border-[#1e293b]/30 pb-px">
        <div className="flex items-center space-x-6 text-xs font-bold tracking-wide">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-2 transition-all relative ${activeTab === 'overview' ? 'text-[#4ade80] font-black' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ade80]" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`pb-2 transition-all relative ${activeTab === 'transactions' ? 'text-[#4ade80] font-black' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Transactions
            {activeTab === 'transactions' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ade80]" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-2 transition-all relative ${activeTab === 'settings' ? 'text-[#4ade80] font-black' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Payment Settings
            {activeTab === 'settings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ade80]" />}
          </button>
        </div>
      </section>

      {/* --- CONDITIONAL VIEWPORTS RENDER LAYER --- */}
      <main className="w-full transition-all duration-150">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* METRICS & HISTOGRAM CARDS GRID */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Total Revenue */}
              <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-black text-white mt-1 tracking-tight">$45,200.00</p>
                    <p className="text-[10px] text-[#4ade80] font-bold mt-1">↑ +12.5% <span className="text-slate-500 font-medium">vs last month</span></p>
                  </div>
                  <div className="p-2 bg-[#142324] rounded-lg border border-[#4ade80]/20 text-[#4ade80]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-1 gap-1.5">
                  <div className="bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors w-full h-[35%] rounded" />
                  <div className="bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors w-full h-[25%] rounded" />
                  <div className="bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors w-full h-[45%] rounded" />
                  <div className="bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors w-full h-[35%] rounded" />
                  <div className="bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors w-full h-[55%] rounded" />
                  <div className="bg-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.4)] w-full h-[85%] rounded" />
                </div>
              </div>

              {/* Card 2: Registration Fees */}
              <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Registration Fees</p>
                    <p className="text-3xl font-black text-white mt-1 tracking-tight">$12,450.00</p>
                    <p className="text-[10px] text-[#4ade80] font-bold mt-1">↑ +5.2% <span className="text-slate-500 font-medium">per active team</span></p>
                  </div>
                  <div className="p-2 bg-cyan-950/40 rounded-lg border border-cyan-500/20 text-cyan-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-1 gap-1.5">
                  <div className="bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors w-full h-[25%] rounded" />
                  <div className="bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors w-full h-[30%] rounded" />
                  <div className="bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors w-full h-[55%] rounded" />
                  <div className="bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors w-full h-[40%] rounded" />
                  <div className="bg-cyan-500/30 hover:bg-cyan-500/40 transition-colors w-full h-[50%] rounded" />
                  <div className="bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] w-full h-[75%] rounded" />
                </div>
              </div>

              {/* Card 3: Pending Payments */}
              <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Payments</p>
                    <p className="text-3xl font-black text-white mt-1 tracking-tight">$3,100.00</p>
                    <p className="text-[10px] text-rose-400 font-bold mt-1">↓ -2.1% <span className="text-slate-500 font-medium">unresolved invoices</span></p>
                  </div>
                  <div className="p-2 bg-rose-950/40 rounded-lg border border-rose-500/20 text-rose-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-1 gap-1.5">
                  <div className="bg-rose-500/30 hover:bg-rose-500/40 transition-colors w-full h-[65%] rounded" />
                  <div className="bg-rose-500/25 hover:bg-rose-500/35 transition-colors w-full h-[50%] rounded" />
                  <div className="bg-rose-500/20 hover:bg-rose-500/30 transition-colors w-full h-[45%] rounded" />
                  <div className="bg-rose-500/15 hover:bg-rose-500/25 transition-colors w-full h-[30%] rounded" />
                  <div className="bg-rose-500/10 hover:bg-rose-500/20 transition-colors w-full h-[25%] rounded" />
                  <div className="bg-rose-500/20 hover:bg-rose-500/30 transition-colors w-full h-[15%] rounded" />
                </div>
              </div>

              {/* Card 4: Successful Transactions */}
              <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Successful Transactions</p>
                    <p className="text-3xl font-black text-white mt-1 tracking-tight">1,248</p>
                    <p className="text-[10px] text-[#4ade80] font-bold mt-1">↑ +8.7% <span className="text-slate-500 font-medium">cleared volume</span></p>
                  </div>
                  <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-1 gap-1.5">
                  <div className="bg-teal-500/10 hover:bg-teal-500/20 transition-colors w-full h-[20%] rounded" />
                  <div className="bg-teal-500/15 hover:bg-teal-500/25 transition-colors w-full h-[35%] rounded" />
                  <div className="bg-teal-500/20 hover:bg-teal-500/30 transition-colors w-full h-[25%] rounded" />
                  <div className="bg-teal-500/25 hover:bg-teal-500/35 transition-colors w-full h-[40%] rounded" />
                  <div className="bg-teal-500/40 hover:bg-teal-500/50 transition-colors w-full h-[60%] rounded" />
                  <div className="bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] w-full h-[80%] rounded" />
                </div>
              </div>
            </section>

            {/* LEAGUE SETTLEMENT STATUS TABLE CARD */}
            <section className="bg-[#0f141c] border border-[#1e293b]/40 rounded-2xl p-5 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white tracking-wide">League Settlement Status</h3>
                <button className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white transition-colors">
                  View All Records
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#1e293b]/30 uppercase tracking-wider text-[9px] font-semibold">
                      <th className="pb-3">League Name</th>
                      <th className="pb-3">Payout Date</th>
                      <th className="pb-3">Participants</th>
                      <th className="pb-3">Total Pool</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/20 font-medium">
                    {settlementData.map((row) => (
                      <tr key={row.id} className="hover:bg-[#141b26]/30 transition-colors group">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 border rounded text-[9px] font-black flex items-center justify-center tracking-tighter ${row.badgeBg}`}>
                              {row.badgeText}
                            </div>
                            <span className="text-white font-bold tracking-wide group-hover:text-[#4ade80] transition-colors">
                              {row.leagueName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-400 font-medium">{row.payoutDate}</td>
                        <td className="py-4 text-slate-300 font-medium">{row.participants}</td>
                        <td className="py-4 text-white font-bold">{row.totalPool}</td>
                        <td className="py-4 text-right">
                          <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black tracking-widest rounded-sm ${
                            row.status === 'SETTLED' ? 'bg-emerald-950/60 border border-emerald-500/20 text-emerald-400' :
                            row.status === 'IN PROGRESS' ? 'bg-cyan-950/60 border border-cyan-500/20 text-cyan-400' :
                            'bg-slate-900 border border-slate-700/50 text-slate-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Dynamic sub-tab triggers */}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'settings' && <PaymentsTab />}
      </main>
    </div>
  );
};

export default Finance;