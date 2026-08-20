import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Radio, ArrowRight } from "lucide-react";
import SCA from "../../public/sca_white.png";

// interface SignupPageProps {
//   onNavigateToLogin?: () => void;
// }

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
    console.log("Submitting telemetry...");
  };

    const onNavigateToLogin = () => {
    navigate("/login");
  };    

  return (
    <div className="min-h-screen bg-[#07090d] text-[#94a3b8] font-sans antialiased flex flex-col justify-between selection:bg-[#00FFC6]/30 selection:text-white">
      
      {/* --- TOP BRANDING NAV --- */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#1e293b]/10">
        <div className="flex items-center space-x-2 text-white font-black tracking-widest text-sm uppercase">
         <img src={SCA} alt="SCA Logo" className="h-6 w-auto object-contain pl-1 border-l border-slate-700/60" />
</div>
        {/* <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <a href="#tournaments" className="hover:text-white transition-colors">Tournaments</a>
          <a href="#leagues" className="hover:text-white transition-colors">Leagues</a>
          <a href="#news" className="hover:text-white transition-colors">News</a>
        </div> */}
      </nav>

      {/* --- MAIN CORE INTERFACE MATRIX --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 flex items-center justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-4xl bg-[#0b0f17] border border-[#1e293b]/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 min-h-[540px]">
          
          {/* LEFT DECORATIVE SCIFI MATRIX GEOMETRY PANEL */}
          <div className="md:col-span-5 relative bg-[#07090d] p-8 flex flex-col justify-between overflow-hidden border-r border-[#1e293b]/20">
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]" />
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] border border-slate-700 rounded-full border-dashed animate-spin-[120s] linear infinite" />
              <div className="w-[50%] h-[50%] border border-slate-700 absolute rounded-full" />
            </div>

            <div className="relative z-10 my-auto space-y-4">
              <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Echelon Network</span>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
                Join the <br />
                <span className="text-cyan-400 font-mono text-2xl tracking-normal">CyberGrid</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Enter the next evolution of competitive play. Secure your credentials and sync with the void.
              </p>
            </div>
          </div>

          {/* RIGHT OPERATIVE PROVISION FORM PANEL */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#0c111a]">
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white tracking-wide uppercase">Create Operative Account</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Initialize your profile to begin recruitment.</p>
              </div>

              <div className="space-y-3 text-xs font-bold">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      <Input placeholder="John Doe" className="bg-[#07090d] border border-[#1e293b]/60 rounded-xl pl-9 text-xs text-white placeholder-slate-700 h-9 focus-visible:ring-0" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-500 uppercase tracking-wider text-[9px] font-black">In-Game Tag</Label>
                    <div className="relative">
                      <Radio className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      <Input placeholder="X_VOID_REAPER" className="bg-[#07090d] border border-[#1e293b]/60 rounded-xl pl-9 text-xs text-white placeholder-slate-700 h-9 focus-visible:ring-0" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <Input type="email" placeholder="operative@kinetic-void.com" className="bg-[#07090d] border border-[#1e293b]/60 rounded-xl pl-9 text-xs text-white placeholder-slate-700 h-9 focus-visible:ring-0" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Security Pass / Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <Input type="password" placeholder="••••••••••••" className="bg-[#07090d] border border-[#1e293b]/60 rounded-xl pl-9 text-xs text-white placeholder-slate-700 h-9 focus-visible:ring-0" required />
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <Checkbox id="terms-signup" className="mt-0.5 border-[#1e293b] data-[state=checked]:bg-[#00FFC6] data-[state=checked]:text-[#07090d]" required />
                  <label htmlFor="terms-signup" className="text-[10px] text-slate-500 font-bold leading-tight cursor-pointer select-none">
                    I accept the <a href="#terms" className="text-[#00FFC6] hover:underline">Terms of Service</a> and acknowledge the <a href="#privacy" className="text-[#00FFC6] hover:underline">Privacy Protocol</a>.
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#00FFC6] hover:bg-[#00D9A8] text-[#07090d] font-black text-xs uppercase tracking-widest h-10 rounded-xl flex items-center justify-center space-x-1.5 transition-all">
                <span>Create Operative Account</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </Button>

              <p className="text-center text-[10px] text-slate-500 font-bold pt-1">
                Already synced with the grid?{" "}
                <button type="button" onClick={onNavigateToLogin} className="text-[#00FFC6] hover:underline font-black uppercase tracking-wider text-[9px] ml-0.5">
                  Log in here
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
          <span>© 2026 SCA. All rights reserved.</span>
        </div>
        <div className="flex space-x-4">
          <a href="#support" className="hover:text-slate-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}