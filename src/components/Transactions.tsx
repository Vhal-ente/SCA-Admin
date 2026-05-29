import React, { useState } from 'react';
import { Search, Filter, Download, X, CheckCircle, Copy, FileText, HelpCircle } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  entity: string;
  tournament: string;
  amount: string;
  gateway: string;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
}

const transactionsData: Transaction[] = [
  { id: 'TXN-7821', date: '12 Oct, 2026', entity: 'Team Liquid', tournament: 'CODM Pro League', amount: '$500.00', gateway: 'Paystack', status: 'SUCCESSFUL' },
  { id: 'TXN-7820', date: '12 Oct, 2026', entity: 'Viper7', tournament: 'Spring 2026', amount: '$250.00', gateway: 'Paystack', status: 'PENDING' },
  { id: 'TXN-7819', date: '11 Oct, 2026', entity: 'Ghost Gaming', tournament: 'Elite Invitational', amount: '$500.00', gateway: 'Paystack', status: 'FAILED' },
];

export default function TransactionsTab() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(transactionsData[0]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
      {/* Table Column */}
      <div className="xl:col-span-2 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#0f141c]/40 p-3 rounded-xl border border-[#1e293b]/20">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-[#07090d] border border-[#1e293b]/40 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#4ade80]/40"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#07090d] border border-[#1e293b]/40 rounded-lg text-xs font-bold hover:text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#142324] border border-[#4ade80]/20 text-[#4ade80] rounded-lg text-xs font-bold hover:bg-[#1b3335] transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-500 border-b border-[#1e293b]/30 uppercase tracking-wider text-[9px] font-bold">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Entity</th>
                <th className="pb-3">Tournament</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Gateway</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/10 font-medium">
              {transactionsData.map((txn) => (
                <tr 
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className={`hover:bg-[#141b26]/40 transition-colors cursor-pointer group ${selectedTxn?.id === txn.id ? 'bg-[#141b26]/60' : ''}`}
                >
                  <td className="py-4 font-mono text-[11px] text-slate-400">
                    <div>{txn.id}</div>
                    <div className="text-[9px] text-slate-600 mt-0.5">{txn.date}</div>
                  </td>
                  <td className="py-4 text-white font-bold tracking-wide">{txn.entity}</td>
                  <td className="py-4 text-slate-400">{txn.tournament}</td>
                  <td className="py-4 text-white font-black">{txn.amount}</td>
                  <td className="py-4 text-slate-500 font-semibold">{txn.gateway}</td>
                  <td className="py-4 text-right">
                    <span className={`inline-block px-2 py-0.5 text-[8px] font-black tracking-widest rounded-full ${
                      txn.status === 'SUCCESSFUL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      txn.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Side Drawer */}
      <div className="bg-[#0f141c] border border-[#1e293b]/40 rounded-xl p-5 flex flex-col space-y-6">
        {selectedTxn ? (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Transaction Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="p-1 hover:text-white text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#07090d] border border-[#1e293b]/20 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2">
              <div className={`p-1.5 rounded-full ${selectedTxn.status === 'SUCCESSFUL' ? 'bg-emerald-500/10 text-emerald-400' : 'text-rose-400 bg-rose-500/10'}`}>
                <CheckCircle className="w-5 h-5 fill-current bg-transparent" />
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{selectedTxn.amount}</p>
              <span className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded uppercase border border-emerald-500/10">
                {selectedTxn.status}
              </span>
              <p className="text-[9px] text-slate-600 mt-1">Processed on October 12, 2026 • 14:32 PM</p>
            </div>

            <div className="flex flex-col space-y-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Transaction ID</span>
                <div className="flex items-center justify-between text-white font-mono mt-1 bg-[#07090d]/50 p-2 rounded border border-[#1e293b]/10">
                  <span>{selectedTxn.id}-LIQUID-2026</span>
                  <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-white cursor-pointer" />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Team / Participant</span>
                <div className="text-white font-bold mt-1.5 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-slate-800 rounded-full" />
                  <span>{selectedTxn.entity}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Tournament</span>
                  <span className="text-slate-300 block mt-1 font-bold">{selectedTxn.tournament}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Payment Method</span>
                  <span className="text-slate-300 block mt-1 font-bold">💳 {selectedTxn.gateway}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Note</span>
                <p className="text-[11px] text-slate-400 mt-1 bg-[#07090d]/30 p-2.5 rounded border border-dashed border-[#1e293b]/40 leading-relaxed">
                  Prize pool distribution for Week 4 Qualifiers. Approved by League Admin #04.
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-4">
              <button className="w-full bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/10">
                <FileText className="w-3.5 h-3.5" />
                <span>Download Receipt</span>
              </button>
              <button className="w-full bg-[#1e293b]/40 hover:bg-[#1e293b]/80 text-slate-300 font-bold py-2 rounded-lg text-xs uppercase tracking-wider border border-[#1e293b]/60 transition-colors flex items-center justify-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-600 text-xs py-12">Select a transaction column row to inspect.</div>
        )}
      </div>
    </div>
  );
}