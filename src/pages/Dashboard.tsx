import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Target, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initialTournaments } from "@/data/tournaments";
import { currentLeagues } from "@/data/leagues";

const Dashboard = () => {
  const navigate = useNavigate();

  const openTournament = (tournamentId: number) => {
    navigate("/tournaments", { state: { tournamentId } });
  };

  return (
    <div className="p-5 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="border-b border-border pb-6">
        <p className="sca-eyebrow mb-3">SCA Control Centre</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your tournament overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden border border-border bg-border">
        <StatCard
          title="Total Tournaments"
          value="24"
          icon={<Trophy className="w-6 h-6" />}
          trend={{ value: "12% from last month", isPositive: true }}
        />
        <StatCard
          title="Active Players"
          value="1,234"
          icon={<Users className="w-6 h-6" />}
          trend={{ value: "8% from last month", isPositive: true }}
        />
        <StatCard
          title="Games"
          value="8"
          icon={<Gamepad2 className="w-6 h-6" />}
        />
        <StatCard
          title="Live Matches"
          value="5"
          icon={<Target className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border rounded-sm shadow-none">
          <p className="sca-eyebrow mb-3">Next in the arena</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Tournaments
          </h2>
          <div className="space-y-4">
            {initialTournaments.map((tournament) => (
              <button
                type="button"
                key={tournament.id}
                onClick={() => openTournament(tournament.id)}
                className="w-full p-4 bg-secondary rounded-sm border border-border hover:border-primary/60 transition-colors duration-200"
              >
                <div className="flex justify-between items-start gap-4 text-left">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">{tournament.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(`${tournament.startDate}T00:00:00`).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-sm">
                    {tournament.teams} {tournament.mode === "Team" ? "teams" : "players"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border rounded-sm shadow-none">
          <p className="sca-eyebrow mb-3">Seasonal play</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Current Leagues
          </h2>
          <div className="space-y-4">
            {currentLeagues.map((league) => (
              <button
                type="button"
                key={league.id}
                onClick={() => navigate("/league")}
                className="w-full flex items-center justify-between gap-4 p-4 text-left bg-secondary rounded-sm border border-border hover:border-primary/60 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm border border-primary/20 bg-primary/10 text-primary flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{league.name}</h3>
                    <p className="text-sm text-muted-foreground">{league.description}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {league.status}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
