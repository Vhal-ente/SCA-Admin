import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export interface Player {
  id: number;
  name: string;
  team: string;
  rank: string;
  wins: number;
  losses: number;
  status: "active" | "inactive";
  game: string;
}

interface PlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  onSave: (player: Omit<Player, "id"> & { id?: number }) => void;
  games: string[];
}

export const PlayerModal = ({ open, onOpenChange, player, onSave, games }: PlayerModalProps) => {
  const [formData, setFormData] = useState<Omit<Player, "id">>({
    name: "",
    team: "",
    rank: "Bronze",
    wins: 0,
    losses: 0,
    status: "active",
    game: "",
  });

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        team: player.team,
        rank: player.rank,
        wins: player.wins,
        losses: player.losses,
        status: player.status,
        game: player.game,
      });
    } else {
      setFormData({
        name: "",
        team: "",
        rank: "Bronze",
        wins: 0,
        losses: 0,
        status: "active",
        game: games[0] || "",
      });
    }
  }, [player, open, games]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(player ? { id: player.id } : {}),
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{player ? "Edit Player" : "Add New Player"}</DialogTitle>
          <DialogDescription>
            {player ? "Update player details" : "Register a new player"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Player Name</Label>
              <Input
                id="name"
                placeholder="Enter player name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game">Game</Label>
              <Select
                value={formData.game}
                onValueChange={(value) => setFormData({ ...formData, game: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input
                id="team"
                placeholder="Enter team name"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Select
                value={formData.rank}
                onValueChange={(value) => setFormData({ ...formData, rank: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Diamond">Diamond</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Grandmaster">Grandmaster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wins">Wins</Label>
                <Input
                  id="wins"
                  type="number"
                  min="0"
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="losses">Losses</Label>
                <Input
                  id="losses"
                  type="number"
                  min="0"
                  value={formData.losses}
                  onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{player ? "Save Changes" : "Add Player"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
