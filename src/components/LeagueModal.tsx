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

export interface League {
  id: number;
  name: string;
  game: string;
  status: "Active" | "Upcoming" | "Completed";
  season: string;
  teams: number;
  prize: string;
}

interface LeagueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  league?: League | null;
  onSave: (league: Omit<League, "id"> & { id?: number }) => void;
}

export const LeagueModal = ({
  open,
  onOpenChange,
  league,
  onSave,
}: LeagueModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    status: "Upcoming" as League["status"],
    season: "",
    teams: 0,
    prize: "",
  });

  useEffect(() => {
    if (league) {
      setFormData({
        name: league.name,
        game: league.game,
        status: league.status,
        season: league.season,
        teams: league.teams,
        prize: league.prize,
      });
    } else {
      setFormData({
        name: "",
        game: "",
        status: "Upcoming",
        season: "",
        teams: 0,
        prize: "",
      });
    }
  }, [league, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: league?.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {league ? "Edit League" : "Create League"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">League Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter league name"
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game">Game</Label>
            <Select
              value={formData.game}
              onValueChange={(value) =>
                setFormData({ ...formData, game: value })
              }
            >
              <SelectTrigger className="bg-background border-border">
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
            <Label htmlFor="season">Season</Label>
            <Input
              id="season"
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value })
              }
              placeholder="e.g. Spring 2025"
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: League["status"]) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-background border-border">
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
            <Label htmlFor="teams">Number of Teams</Label>
            <Input
              id="teams"
              type="number"
              min="2"
              value={formData.teams || ""}
              onChange={(e) =>
                setFormData({ ...formData, teams: parseInt(e.target.value) || 0 })
              }
              placeholder="Enter number of teams"
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prize">Prize Pool</Label>
            <Input
              id="prize"
              value={formData.prize}
              onChange={(e) =>
                setFormData({ ...formData, prize: e.target.value })
              }
              placeholder="e.g. $10,000"
              required
              className="bg-background border-border"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {league ? "Save Changes" : "Create League"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
