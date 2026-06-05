import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Trash2, AlertTriangle } from "lucide-react";

type ModalType = "add-player" | "edit-player" | "add-admin" | "edit-team" | "delete" | null;

interface ActionModalsProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  targetData?: any; // Pass row item parameters context dynamically
  onConfirm?: (data: any) => void;
}

export default function UserActionModals({ type, isOpen, onClose, targetData, onConfirm }: ActionModalsProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirm) onConfirm({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0f141c] border border-[#1e293b]/80 text-[#94a3b8] font-sans sm:max-w-[425px] overflow-hidden">
        
        {/* --- 1. ADD / EDIT PLAYER MODAL --- */}
        {(type === "add-player" || type === "edit-player") && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-white tracking-wide">
                {type === "add-player" ? "Add Competitive Player" : "Modify Player Roster Info"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Configure profile handle coordinates and registration telemetry bounds.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs font-bold">
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Player Handle Name</Label>
                <Input defaultValue={targetData?.name || ""} placeholder="e.g. GlitchOps" className="bg-[#07090d] border border-[#1e293b]/60 text-white focus-visible:ring-0 focus-visible:border-[#4ade80]/50 h-9" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Assigned Organization Team</Label>
                <Input defaultValue={targetData?.team || ""} placeholder="e.g. Neon Vipers" className="bg-[#07090d] border border-[#1e293b]/60 text-white focus-visible:ring-0 focus-visible:border-[#4ade80]/50 h-9" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Competitive Rank Designation</Label>
                <Select defaultValue={targetData?.rank?.toLowerCase() || "diamond"}>
                  <SelectTrigger className="bg-[#07090d] border border-[#1e293b]/60 text-slate-300 h-9 font-bold">
                    <SelectValue placeholder="Select rank tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
                    <SelectItem value="grandmaster">Grandmaster</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} className="border-[#1e293b] hover:bg-slate-800/40 text-slate-300 font-bold text-xs uppercase tracking-wider">Cancel</Button>
              <Button type="submit" className="bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] font-black text-xs uppercase tracking-wider">Save Metrics</Button>
            </DialogFooter>
          </form>
        )}

        {/* --- 2. ADD ADMINISTRATIVE MODERATOR MODAL --- */}
        {type === "add-admin" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Elevate System Access</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Grant node configuration credentials to operators.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs font-bold">
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Full Fullname</Label>
                <Input placeholder="e.g. Marcus Vance" className="bg-[#07090d] border border-[#1e293b]/60 text-white focus-visible:ring-0 h-9" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Secure Email Routing</Label>
                <Input type="email" placeholder="operator@kineticvoid.gg" className="bg-[#07090d] border border-[#1e293b]/60 text-white focus-visible:ring-0 h-9" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Platform System Role</Label>
                <Select defaultValue="moderator">
                  <SelectTrigger className="bg-[#07090d] border border-[#1e293b]/60 text-slate-300 h-9 font-bold">
                    <SelectValue placeholder="Select authorization tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
                    <SelectItem value="super-admin">Super Admin (Full Node)</SelectItem>
                    <SelectItem value="moderator">Tournament Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="border-[#1e293b] hover:bg-slate-800/40 text-slate-300 text-xs font-bold uppercase tracking-wider">Dismiss</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider">Provision Access</Button>
            </DialogFooter>
          </form>
        )}

        {/* --- 3. EDIT TEAM RECORDS DIRECTORY MODAL --- */}
        {type === "edit-team" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-white tracking-wide">Edit Organization Profile</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update tournament legal documentation parameters.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs font-bold">
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Club Entity Title</Label>
                <Input defaultValue={targetData?.name || ""} className="bg-[#07090d] border border-[#1e293b]/60 text-white focus-visible:ring-0 h-9" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">Operational Server Region Focus</Label>
                <Input defaultValue={targetData?.region || ""} className="bg-[#07090d] border border-[#1e293b]/60 text-white focus-visible:ring-0 h-9" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-slate-400 uppercase tracking-wider text-[10px]">League Verification Cleared Tag</Label>
                <Select defaultValue={targetData?.status?.toLowerCase() || "verified"}>
                  <SelectTrigger className="bg-[#07090d] border border-[#1e293b]/60 text-slate-300 h-9 font-bold">
                    <SelectValue placeholder="Eligibility criteria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f141c] border border-[#1e293b]/80 text-slate-300">
                    <SelectItem value="verified">Verified (Approved)</SelectItem>
                    <SelectItem value="pending">Pending Validation Review</SelectItem>
                    <SelectItem value="suspended">Suspended (Rule Infraction)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="border-[#1e293b] text-slate-300 text-xs font-bold uppercase tracking-wider">Abort</Button>
              <Button type="submit" className="bg-[#4ade80] hover:bg-[#3ec973] text-[#07090d] font-black text-xs uppercase tracking-wider">Push Updates</Button>
            </DialogFooter>
          </form>
        )}

        {/* --- 4. DATA PURGE CRITICAL DELETION MODAL --- */}
        {type === "delete" && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
                <span>Execute Structural Purge?</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 leading-relaxed">
                Warning: You are attempting to delete <span className="text-white font-bold font-mono">"{targetData?.name || "this resource parameter"}"</span>. This database record rewrite layer sequence is irreversible.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-2 flex flex-row justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="border-[#1e293b] hover:bg-slate-800/40 text-slate-300 text-xs font-bold uppercase tracking-wider">Cancel</Button>
              <Button type="button" onClick={() => { if (onConfirm) onConfirm(targetData); onClose(); }} className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Purge</span>
              </Button>
            </DialogFooter>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}