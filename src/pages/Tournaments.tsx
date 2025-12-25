import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Trophy, Pencil, Trash2 } from "lucide-react";
import { TournamentModal, Tournament } from "@/components/TournamentModal";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Tournaments = () => {
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "CODM Championship 2025",
      game: "Call of Duty Mobile",
      status: "Active",
      startDate: "2025-01-15",
      teams: 16,
      prize: "$10,000",
    },
    {
      id: 2,
      name: "MLBB Spring League",
      game: "Mobile Legends",
      status: "Upcoming",
      startDate: "2025-01-20",
      teams: 24,
      prize: "$15,000",
    },
    {
      id: 3,
      name: "Valorant Masters",
      game: "Valorant",
      status: "Completed",
      startDate: "2024-12-01",
      teams: 12,
      prize: "$8,000",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const [filter, setFilter] = useState<"all" | "Active" | "Upcoming" | "Completed">("all");

  const handleCreateTournament = () => {
    setSelectedTournament(null);
    setModalOpen(true);
  };

  const handleEditTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setModalOpen(true);
  };

  const handleDeleteClick = (tournament: Tournament) => {
    setTournamentToDelete(tournament);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (tournamentToDelete) {
      setTournaments(tournaments.filter((t) => t.id !== tournamentToDelete.id));
      toast({
        title: "Tournament Deleted",
        description: `${tournamentToDelete.name} has been deleted.`,
      });
      setTournamentToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveTournament = (tournamentData: Omit<Tournament, "id"> & { id?: number }) => {
    if (tournamentData.id) {
      // Edit existing
      setTournaments(
        tournaments.map((t) =>
          t.id === tournamentData.id ? { ...tournamentData, id: t.id } as Tournament : t
        )
      );
      toast({
        title: "Tournament Updated",
        description: `${tournamentData.name} has been updated.`,
      });
    } else {
      // Create new
      const newTournament: Tournament = {
        ...tournamentData,
        id: Math.max(...tournaments.map((t) => t.id), 0) + 1,
      } as Tournament;
      setTournaments([...tournaments, newTournament]);
      toast({
        title: "Tournament Created",
        description: `${tournamentData.name} has been created.`,
      });
    }
  };

  const filteredTournaments =
    filter === "all"
      ? tournaments
      : tournaments.filter((t) => t.status === filter);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Tournaments</h1>
          <p className="text-muted-foreground">Manage and monitor all tournaments</p>
        </div>
        <Button
          onClick={handleCreateTournament}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tournament
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "outline" : "ghost"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "border-primary text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}
        >
          All Tournaments
        </Button>
        <Button
          variant={filter === "Active" ? "outline" : "ghost"}
          onClick={() => setFilter("Active")}
          className={filter === "Active" ? "border-primary text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}
        >
          Active
        </Button>
        <Button
          variant={filter === "Upcoming" ? "outline" : "ghost"}
          onClick={() => setFilter("Upcoming")}
          className={filter === "Upcoming" ? "border-primary text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === "Completed" ? "outline" : "ghost"}
          onClick={() => setFilter("Completed")}
          className={filter === "Completed" ? "border-primary text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}
        >
          Completed
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow"
          >
            <div className="flex items-start justify-between mb-4">
              <Badge
                className={
                  tournament.status === "Active"
                    ? "bg-primary/20 text-primary border-primary"
                    : tournament.status === "Upcoming"
                    ? "bg-accent/20 text-accent border-accent"
                    : "bg-muted text-muted-foreground border-muted"
                }
              >
                {tournament.status}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditTournament(tournament)}
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(tournament)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{tournament.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{tournament.game}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{tournament.teams} Teams</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-lg font-bold text-accent">{tournament.prize}</span>
              <Button
                variant="ghost"
                onClick={() => handleEditTournament(tournament)}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <TournamentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tournament={selectedTournament}
        onSave={handleSaveTournament}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tournament</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tournamentToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tournaments;
