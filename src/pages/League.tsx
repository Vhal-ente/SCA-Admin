import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Award, Pencil, Trash2, Calendar } from "lucide-react";
import { LeagueModal, League } from "@/components/LeagueModal";
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

const LeaguePage = () => {
  const { toast } = useToast();
  const [leagues, setLeagues] = useState<League[]>([
    {
      id: 1,
      name: "CODM Pro League",
      game: "Call of Duty Mobile",
      status: "Active",
      season: "Spring 2025",
      teams: 12,
      prize: "$25,000",
    },
    {
      id: 2,
      name: "MLBB Masters League",
      game: "Mobile Legends",
      status: "Upcoming",
      season: "Summer 2025",
      teams: 16,
      prize: "$30,000",
    },
    {
      id: 3,
      name: "Valorant Elite Series",
      game: "Valorant",
      status: "Completed",
      season: "Winter 2024",
      teams: 10,
      prize: "$20,000",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState<League | null>(null);
  const [filter, setFilter] = useState<"all" | "Active" | "Upcoming" | "Completed">("all");

  const handleCreateLeague = () => {
    setSelectedLeague(null);
    setModalOpen(true);
  };

  const handleEditLeague = (league: League) => {
    setSelectedLeague(league);
    setModalOpen(true);
  };

  const handleDeleteClick = (league: League) => {
    setLeagueToDelete(league);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (leagueToDelete) {
      setLeagues(leagues.filter((l) => l.id !== leagueToDelete.id));
      toast({
        title: "League Deleted",
        description: `${leagueToDelete.name} has been deleted.`,
      });
      setLeagueToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveLeague = (leagueData: Omit<League, "id"> & { id?: number }) => {
    if (leagueData.id) {
      // Edit existing
      setLeagues(
        leagues.map((l) =>
          l.id === leagueData.id ? { ...leagueData, id: l.id } as League : l
        )
      );
      toast({
        title: "League Updated",
        description: `${leagueData.name} has been updated.`,
      });
    } else {
      // Create new
      const newLeague: League = {
        ...leagueData,
        id: Math.max(...leagues.map((l) => l.id), 0) + 1,
      } as League;
      setLeagues([...leagues, newLeague]);
      toast({
        title: "League Created",
        description: `${leagueData.name} has been created.`,
      });
    }
  };

  const filteredLeagues =
    filter === "all"
      ? leagues
      : leagues.filter((l) => l.status === filter);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">League Management</h1>
          <p className="text-muted-foreground">Manage seasons and league standings</p>
        </div>
        <Button
          onClick={handleCreateLeague}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          New League
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "outline" : "ghost"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "border-primary text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}
        >
          All Leagues
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
        {filteredLeagues.map((league) => (
          <Card
            key={league.id}
            className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow"
          >
            <div className="flex items-start justify-between mb-4">
              <Badge
                className={
                  league.status === "Active"
                    ? "bg-primary/20 text-primary border-primary"
                    : league.status === "Upcoming"
                    ? "bg-accent/20 text-accent border-accent"
                    : "bg-muted text-muted-foreground border-muted"
                }
              >
                {league.status}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditLeague(league)}
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(league)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{league.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{league.game}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{league.season}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{league.teams} Teams</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-lg font-bold text-accent">{league.prize}</span>
              <Button
                variant="ghost"
                onClick={() => handleEditLeague(league)}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <LeagueModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        league={selectedLeague}
        onSave={handleSaveLeague}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete League</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{leagueToDelete?.name}"? This action cannot be undone.
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

export default LeaguePage;
