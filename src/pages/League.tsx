import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Pencil, Trash2, Calendar } from "lucide-react";
import { Overview } from "@/components/LeagueOverview";
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

  const [leagues, setLeagues] = useState([
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
  ]);

  const [selectedLeague, setSelectedLeague] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleCreateLeague = () => {
    setSelectedLeague({});
  };

  const handleEditLeague = (league) => {
    setSelectedLeague(league);
  };

  const handleBack = () => {
    setSelectedLeague(null);
  };

  const handleDeleteClick = (league) => {
    setLeagueToDelete(league);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setLeagues((prev) => prev.filter((l) => l.id !== leagueToDelete.id));

    toast({
      title: "League Deleted",
      description: `${leagueToDelete.name} deleted`,
    });

    setLeagueToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleSaveLeague = (data) => {
    if (data.id) {
      setLeagues((prev) =>
        prev.map((l) => (l.id === data.id ? { ...l, ...data } : l))
      );
    } else {
      setLeagues((prev) => [...prev, { ...data, id: Date.now() }]);
    }

    handleBack();
  };

  const filteredLeagues =
    filter === "all" ? leagues : leagues.filter((l) => l.status === filter);

  // ─── PAGE SWITCH ───
  if (selectedLeague !== null) {
    return (
      <Overview
        league={selectedLeague}
        onSave={handleSaveLeague}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">League Management</h1>
          <p className="text-muted-foreground">Manage leagues</p>
        </div>

        <Button onClick={handleCreateLeague} className="gap-2">
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      <div className="flex gap-2">
        {["all", "Active", "Upcoming", "Completed"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "outline" : "ghost"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeagues.map((league) => (
          <Card key={league.id} className="p-6">
            <div className="flex justify-between mb-3">
              <Badge>{league.status}</Badge>

              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleEditLeague(league)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(league)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-bold text-lg">{league.name}</h3>
            <p className="text-sm text-muted-foreground">{league.game}</p>

            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {league.season}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" /> {league.teams} teams
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-accent text-lg">{league.prize}</span>
              <Button variant="ghost"
               className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => handleEditLeague(league)}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {leagueToDelete?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaguePage;
