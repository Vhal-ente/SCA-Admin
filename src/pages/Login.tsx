import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import SCA from "../../public/sca_white.png";


export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
    console.log("Logging in...");
  };

    const onNavigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-[#94a3b8] font-sans antialiased flex flex-col justify-between selection:bg-[#4ade80]/30 selection:text-white">
      
      {/* --- TOP BRANDING NAV --- */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#1e293b]/10">
        <div className="flex items-center space-x-2 text-white font-black tracking-widest text-sm uppercase">
         <img src={SCA} alt="SCA Logo" className="h-8 w-auto object-contain pl-1 border-l border-slate-700/60" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          <a href="#support" className="hover:text-white transition-colors">Support</a>
        </div>
      </nav>

      {/* --- MAIN CORE INTERFACE MATRIX --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 flex items-center justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-4xl bg-[#0b0f17] border border-[#1e293b]/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 min-h-[540px]">
          
          {/* LEFT DECORATIVE ACCENT LAYER */}
          <div className="md:col-span-5 relative bg-[#07090d] p-8 flex flex-col justify-between overflow-hidden border-r border-[#1e293b]/20">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#4ade80]/5 rounded-full blur-[120px]" />
            <div className="relative z-10 my-auto space-y-4">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
                Ascend to the <br />
                <span className="text-[#4ade80] italic font-black text-4xl">Echelon</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Enter the high-frequency arena where data meets destiny. Your kinetic journey begins here.
              </p>
              <div className="pt-6 flex items-center space-x-2">
                <div className="h-1 w-12 bg-[#4ade80] rounded-full animate-pulse" />
                <span className="text-[9px] font-black tracking-widest text-[#4ade80] uppercase">System Online: Sector 7G</span>
              </div>
            </div>
          </div>

          {/* RIGHT FORM INTERFACE PANEL */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#0c111a]">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-white tracking-wide uppercase">Initialize Access</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Sync your credentials to rejoin the fleet.</p>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <Input type="email" placeholder="commander@void.io" className="bg-[#07090d] border border-[#1e293b]/60 rounded-xl pl-9 text-xs text-white placeholder-slate-700 h-10 focus-visible:ring-0 focus-visible:border-[#4ade80]/40 transition-colors" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="">
                    <Label className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Security Pass / Password</Label>
                    
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <Input type="password" placeholder="••••••••••••" className="bg-[#07090d] border border-[#1e293b]/60 rounded-xl pl-9 text-xs text-white placeholder-slate-700 h-10 focus-visible:ring-0 focus-visible:border-[#4ade80]/40 transition-colors" required />
                  </div>
                   <div className="flex items-center space-y-2 right-0 justify-end">
                    <a href="#reset" className="text-[9px] text-[#4ade80] hover:underline font-black uppercase tracking-wider">Forgot Key?</a>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] font-black text-xs uppercase tracking-widest h-10 rounded-xl shadow-lg shadow-emerald-500/10 transition-all transform active:scale-[0.99]">
                Establish Connection
              </Button>

              <p className="text-center text-[10px] text-slate-500 font-bold">
                New to the void?{" "}
                <button type="button" onClick={onNavigateToSignup} className="text-[#4ade80] hover:underline font-black ml-0.5">
                  Join the fleet
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* --- PLATFORM FOOTER LAYER --- */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between border-t border-[#1e293b]/10 gap-3 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        <div className="flex items-center space-x-1">
          <img src={SCA} alt="SCA Logo" className="h-6 w-auto object-contain pl-1 border-l border-slate-700/60" />
          <span>© 2026 Kinetic Void Echelon. All rights reserved.</span>
        </div>
        <div className="flex space-x-4">
          <a href="#support" className="hover:text-slate-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}