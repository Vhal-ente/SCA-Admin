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
import { Switch } from "@/components/ui/switch";

export interface Game {
  id: string;
  // Short name shown on cards, e.g. "CODM".
  name: string;
  // The catalogue name competitions and teams use, e.g. "Call of Duty Mobile".
  fullName: string;
  // Accounts that list the game on their profile.
  players: number;
  image: string;
  active: boolean;
}

interface GameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: Game | null;
  // Resolves false when the save failed, so the form stays open with its edits.
  onSave: (game: Omit<Game, "id" | "players"> & { id?: string }) => Promise<boolean>;
}

const emptyForm = { name: "", fullName: "", image: "", active: true };

export const GameModal = ({ open, onOpenChange, game, onSave }: GameModalProps) => {
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(game ? { name: game.name, fullName: game.fullName, image: game.image, active: game.active } : emptyForm);
  }, [game, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await onSave({ ...(game ? { id: game.id } : {}), ...formData });
    setSaving(false);
    if (saved) onOpenChange(false);
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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g., Call of Duty Mobile"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Competitions, teams, and player profiles pick the game by this name.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Short Name</Label>
              <Input
                id="name"
                placeholder="e.g., CODM"
                maxLength={20}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image link</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg or /assets/game.png"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label htmlFor="active">Shown on the site</Label>
                <p className="text-xs text-muted-foreground">Hidden games stay on existing competitions and profiles.</p>
              </div>
              <Switch id="active" checked={formData.active} onCheckedChange={(active) => setFormData({ ...formData, active })} />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : game ? "Save Changes" : "Add Game"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
