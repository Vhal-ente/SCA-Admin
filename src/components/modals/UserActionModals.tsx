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
const fieldClass = "h-11 rounded-sm border-border bg-background text-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary";
const labelClass = "text-[10px] font-bold uppercase tracking-wider text-muted-foreground";
const secondaryButtonClass = "h-11 rounded-sm border-border bg-background px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground";
const primaryButtonClass = "h-11 rounded-sm bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90";

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
      <DialogContent className="overflow-hidden rounded-sm border border-border bg-card p-0 font-sans text-foreground sm:max-w-[520px]">
        
        {/* --- 1. ADD / EDIT PLAYER MODAL --- */}
        {(type === "add-player" || type === "edit-player") && (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
              <p className="sca-eyebrow">Player account</p>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {type === "add-player" ? "Add Competitive Player" : "Modify Player Roster Info"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Configure the player's profile, organization, and competitive rank.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 p-6 text-xs font-bold">
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Player name</Label>
                <Input defaultValue={targetData?.name || ""} placeholder="e.g. GlitchOps" className={fieldClass} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Assigned team</Label>
                <Input defaultValue={targetData?.team || ""} placeholder="e.g. Neon Vipers" className={fieldClass} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Competitive rank</Label>
                <Select defaultValue={targetData?.rank?.toLowerCase() || "diamond"}>
                  <SelectTrigger className={`${fieldClass} font-bold`}>
                    <SelectValue placeholder="Select rank tier" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-border bg-popover text-popover-foreground">
                    <SelectItem value="grandmaster">Grandmaster</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border px-6 py-5 sm:gap-2">
              <Button type="button" variant="outline" onClick={onClose} className={secondaryButtonClass}>Cancel</Button>
              <Button type="submit" className={primaryButtonClass}>Save player</Button>
            </DialogFooter>
          </form>
        )}

        {/* --- 2. ADD ADMINISTRATIVE MODERATOR MODAL --- */}
        {type === "add-admin" && (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
              <p className="sca-eyebrow">Access control</p>
              <DialogTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>Add administrator</span>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Grant a scoped platform role to a member of the operations team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 p-6 text-xs font-bold">
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Full name</Label>
                <Input placeholder="e.g. Marcus Vance" className={fieldClass} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Email address</Label>
                <Input type="email" placeholder="operator@sca.gg" className={fieldClass} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Platform role</Label>
                <Select defaultValue="moderator">
                  <SelectTrigger className={`${fieldClass} font-bold`}>
                    <SelectValue placeholder="Select authorization tier" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-border bg-popover text-popover-foreground">
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="tournament-manager">Tournament Manager</SelectItem>
                    <SelectItem value="shogun-manager">Shogun Manager</SelectItem>
                    <SelectItem value="finance-manager">Finance Manager</SelectItem>
                    <SelectItem value="league-manager">League Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border px-6 py-5 sm:gap-2">
              <Button type="button" variant="outline" onClick={onClose} className={secondaryButtonClass}>Cancel</Button>
              <Button type="submit" className={primaryButtonClass}>Grant access</Button>
            </DialogFooter>
          </form>
        )}

        {/* --- 3. EDIT TEAM RECORDS DIRECTORY MODAL --- */}
        {type === "edit-team" && (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
              <p className="sca-eyebrow">Team directory</p>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">Edit organization</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Update the team's directory and eligibility information.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 p-6 text-xs font-bold">
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Team name</Label>
                <Input defaultValue={targetData?.name || ""} className={fieldClass} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Region</Label>
                <Input defaultValue={targetData?.region || ""} className={fieldClass} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={labelClass}>Verification status</Label>
                <Select defaultValue={targetData?.status?.toLowerCase() || "verified"}>
                  <SelectTrigger className={`${fieldClass} font-bold`}>
                    <SelectValue placeholder="Eligibility criteria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-border bg-popover text-popover-foreground">
                    <SelectItem value="verified">Verified (Approved)</SelectItem>
                    <SelectItem value="pending">Pending Validation Review</SelectItem>
                    <SelectItem value="suspended">Suspended (Rule Infraction)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border px-6 py-5 sm:gap-2">
              <Button type="button" variant="outline" onClick={onClose} className={secondaryButtonClass}>Cancel</Button>
              <Button type="submit" className={primaryButtonClass}>Save changes</Button>
            </DialogFooter>
          </form>
        )}

        {/* --- 4. DATA PURGE CRITICAL DELETION MODAL --- */}
        {type === "delete" && (
          <div>
            <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-destructive">Destructive action</p>
              <DialogTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span>Delete this record?</span>
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                You are about to delete <span className="font-bold text-foreground">"{targetData?.name || "this record"}"</span>. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row justify-end gap-2 px-6 py-5">
              <Button type="button" variant="outline" onClick={onClose} className={secondaryButtonClass}>Cancel</Button>
              <Button type="button" onClick={() => { if (onConfirm) onConfirm(targetData); onClose(); }} className="flex h-11 items-center gap-1.5 rounded-sm bg-destructive px-5 text-xs font-bold uppercase tracking-wider text-destructive-foreground hover:bg-destructive/90">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete record</span>
              </Button>
            </DialogFooter>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
