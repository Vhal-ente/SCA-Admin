import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Target, Clock } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your tournament overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <Card className="p-6 bg-gradient-card border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Tournaments
          </h2>
          <div className="space-y-4">
            {[
              { name: "CODM Championship 2025", date: "Jan 15, 2025", teams: 16 },
              { name: "MLBB Spring League", date: "Jan 20, 2025", teams: 24 },
              { name: "Valorant Masters", date: "Feb 1, 2025", teams: 12 },
            ].map((tournament, index) => (
              <div
                key={index}
                className="p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{tournament.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tournament.date}</p>
                  </div>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {tournament.teams} teams
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Top Performing Teams
          </h2>
          <div className="space-y-4">
            {[
              { name: "Phoenix Esports", wins: 45, rank: 1 },
              { name: "Dragon Force", wins: 42, rank: 2 },
              { name: "Storm Raiders", wins: 38, rank: 3 },
            ].map((team) => (
              <div
                key={team.rank}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-accent transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    team.rank === 1 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    #{team.rank}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.wins} wins</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
