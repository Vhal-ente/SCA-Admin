import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Trophy } from "lucide-react";

const Tournaments = () => {
  const tournaments = [
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
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Tournaments</h1>
          <p className="text-muted-foreground">Manage and monitor all tournaments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          Create Tournament
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          All Tournaments
        </Button>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Active
        </Button>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Upcoming
        </Button>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Completed
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
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
              <Trophy className="w-5 h-5 text-primary" />
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
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
