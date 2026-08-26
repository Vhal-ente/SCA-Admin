import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Gamepad2, Trophy, User, Users } from "lucide-react";

export interface Tournament {
  id: number;
  name: string;
  game: string;
  status: "Active" | "Upcoming" | "Completed";
  mode: "Player" | "Team";
  entryType: "Free" | "Paid";
  entryFee: string;
  startDate: string;
  teams: number;
  prize: string;
  prizeAllocations?: number[];
  bannerUrl?: string;
  publicationStatus?: "Draft" | "Published";
  phase?: "Registration" | "Drafting" | "Finalized";
}

interface TournamentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament?: Tournament | null;
  onSave: (tournament: Omit<Tournament, "id"> & { id?: number }) => void;
}

export const TournamentModal = ({
  open,
  onOpenChange,
  tournament,
  onSave,
}: TournamentModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    status: "Upcoming" as Tournament["status"],
    mode: "Team" as Tournament["mode"],
    entryType: "Free" as Tournament["entryType"],
    entryFee: "",
    startDate: "",
    teams: 0,
    prize: "",
    publicationStatus: "Draft" as Tournament["publicationStatus"],
    phase: "Registration" as Tournament["phase"],
  });

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name,
        game: tournament.game,
        status: tournament.status,
        mode: tournament.mode,
        entryType: tournament.entryType || "Free",
        entryFee: tournament.entryFee || "",
        startDate: tournament.startDate,
        teams: tournament.teams,
        prize: tournament.prize,
        publicationStatus: tournament.publicationStatus || "Draft",
        phase: tournament.phase || "Registration",
      });
    } else {
      setFormData({
        name: "",
        game: "",
        status: "Upcoming",
        mode: "Team",
        entryType: "Free",
        entryFee: "",
        startDate: "",
        teams: 0,
        prize: "",
        publicationStatus: "Draft",
        phase: "Registration",
      });
    }
  }, [tournament, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: tournament?.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-sm border-border bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
          <p className="sca-eyebrow">Competition setup</p>
          <DialogTitle className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {tournament ? "Edit Tournament" : "Create Tournament"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Configure registration, format, schedule, and prize information.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Participation mode</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["Team", "Player"] as const).map((mode) => {
                const Icon = mode === "Team" ? Users : User;
                const selected = formData.mode === mode;
                return (
                  <button key={mode} type="button" onClick={() => setFormData({ ...formData, mode })} className={`flex items-start gap-3 rounded-sm border p-4 text-left transition-colors ${selected ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"}`}>
                    <Icon className={`mt-0.5 h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    <span><span className="block text-sm font-semibold text-foreground">{mode} tournament</span><span className="mt-1 block text-xs text-muted-foreground">{mode === "Team" ? "Roster-based registration" : "Individual registration"}</span></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter tournament name"
              required
              className="h-11 rounded-sm bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game" className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-primary" /> Game</Label>
            <Select
              value={formData.game}
              onValueChange={(value) =>
                setFormData({ ...formData, game: value })
              }
            >
              <SelectTrigger className="h-11 rounded-sm bg-background border-border">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call of Duty Mobile">Call of Duty Mobile</SelectItem>
                <SelectItem value="Mobile Legends">Mobile Legends</SelectItem>
                <SelectItem value="Valorant">Valorant</SelectItem>
                <SelectItem value="PUBG Mobile">PUBG Mobile</SelectItem>
                <SelectItem value="Free Fire">Free Fire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Competition Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Tournament["status"]) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="h-11 rounded-sm bg-background border-border">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
              className="h-11 rounded-sm bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teams" className="flex items-center gap-2">{formData.mode === "Team" ? <Users className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />} Number of {formData.mode === "Team" ? "Teams" : "Players"}</Label>
            <Input
              id="teams"
              type="number"
              min="2"
              value={formData.teams || ""}
              onChange={(e) =>
                setFormData({ ...formData, teams: parseInt(e.target.value) || 0 })
              }
              placeholder={`Enter number of ${formData.mode === "Team" ? "teams" : "players"}`}
              required
              className="h-11 rounded-sm bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="prize" className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Prize Pool</Label>
            <Input
              id="prize"
              value={formData.prize}
              onChange={(e) =>
                setFormData({ ...formData, prize: e.target.value })
              }
              placeholder="e.g. $10,000"
              required
              className="h-11 rounded-sm bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label>Registration Type</Label>
            <Select value={formData.entryType} onValueChange={(value: Tournament["entryType"]) => setFormData({ ...formData, entryType: value, entryFee: value === "Free" ? "" : formData.entryFee })}>
              <SelectTrigger className="h-11 rounded-sm bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Free">Free registration</SelectItem><SelectItem value="Paid">Paid registration</SelectItem></SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryFee">Entry Fee</Label>
            <Input id="entryFee" value={formData.entryFee} onChange={(event) => setFormData({ ...formData, entryFee: event.target.value })} placeholder={formData.entryType === "Paid" ? "e.g. ₦5,000" : "No fee"} disabled={formData.entryType === "Free"} required={formData.entryType === "Paid"} className="h-11 rounded-sm bg-background border-border focus-visible:ring-primary disabled:opacity-60" />
          </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-border pt-5 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-sm border-border px-6"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 rounded-sm bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90">
              {tournament ? "Save Changes" : "Create Tournament"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
