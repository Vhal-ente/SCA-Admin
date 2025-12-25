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

export interface Game {
  id: number;
  name: string;
  fullName: string;
  players: number;
  image: string;
}

interface GameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: Game | null;
  onSave: (game: Omit<Game, "id"> & { id?: number }) => void;
}

export const GameModal = ({ open, onOpenChange, game, onSave }: GameModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    players: 0,
    image: "",
  });

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        fullName: game.fullName,
        players: game.players,
        image: game.image,
      });
    } else {
      setFormData({
        name: "",
        fullName: "",
        players: 0,
        image: "",
      });
    }
  }, [game, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(game ? { id: game.id } : {}),
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{game ? "Edit Game" : "Add New Game"}</DialogTitle>
          <DialogDescription>
            {game ? "Update game details" : "Add a new game to the platform"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Short Name</Label>
              <Input
                id="name"
                placeholder="e.g., CODM"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g., Call of Duty Mobile"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="players">Number of Players</Label>
              <Input
                id="players"
                type="number"
                min="0"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>
            {formData.image && (
              <div className="flex justify-center">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{game ? "Save Changes" : "Add Game"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
