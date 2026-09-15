import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Globe, Clock, Shield, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api, type AdminUser, type ApiLeague, type ApiTournament } from "@/lib/api";
import { toUiLeague, toUiTournament } from "@/lib/competitions";
import type { Tournament } from "@/components/TournamentModal";
import type { League } from "@/interfaces/league-modal";

// The users endpoint caps a page; past this the count is shown as a floor.
const USER_LIMIT = 500;
const LIST_SIZE = 4;

const registrationLabel = (item: { status: string; registrationStatus?: string }) =>
  item.status === "Upcoming" ? "Upcoming" : item.registrationStatus === "Open" ? "Registration open" : "In play";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get<{ tournaments: ApiTournament[] }>("/admin/tournaments"),
      api.get<{ leagues: ApiLeague[] }>("/admin/leagues"),
      api.get<{ users: AdminUser[] }>(`/admin/users?limit=${USER_LIMIT}`),
    ]).then(([tournamentResult, leagueResult, userResult]) => {
      if (!active) return;
      if (tournamentResult.status === "fulfilled") setTournaments(tournamentResult.value.tournaments.map(toUiTournament));
      if (leagueResult.status === "fulfilled") setLeagues(leagueResult.value.leagues.map(toUiLeague));
      if (userResult.status === "fulfilled") setUserCount(userResult.value.users.length);
      const failed = [tournamentResult, leagueResult, userResult].find((result) => result.status === "rejected");
      setLoadError(failed ? (failed as PromiseRejectedResult).reason?.message || "Some figures could not be loaded." : "");
    });
    return () => { active = false; };
  }, []);

  const openTournament = (tournamentId: string) => {
    navigate("/tournaments", { state: { tournamentId } });
  };

  const count = (items: unknown[] | null) => (items ? items.length : "—");
  const published = tournaments && leagues
    ? [...tournaments, ...leagues].filter((item) => item.publicationStatus === "Published").length
    : "—";
  const accounts = userCount === null ? "—" : userCount >= USER_LIMIT ? `${USER_LIMIT}+` : userCount;

  const upcomingTournaments = (tournaments || [])
    .filter((tournament) => tournament.status !== "Completed")
    .sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999"))
    .slice(0, LIST_SIZE);
  const currentLeagues = (leagues || []).filter((league) => league.status !== "Completed").slice(0, LIST_SIZE);

  return (
    <div className="p-5 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="border-b border-border pb-6">
        <p className="sca-eyebrow mb-3">SCA Control Centre</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back{user?.name ? `, ${user.name}` : ""}! Here's your competition overview.</p>
      </div>

      {loadError && (
        <p role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden border border-border bg-border">
        <StatCard title="Tournaments" value={count(tournaments)} icon={<Trophy className="w-6 h-6" />} />
        <StatCard title="Leagues" value={count(leagues)} icon={<Award className="w-6 h-6" />} />
        <StatCard title="Live on site" value={published} icon={<Globe className="w-6 h-6" />} />
        <StatCard title="Registered accounts" value={accounts} icon={<Users className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border rounded-sm shadow-none">
          <p className="sca-eyebrow mb-3">Next in the arena</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Tournaments
          </h2>
          <div className="space-y-4">
            {upcomingTournaments.map((tournament) => (
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
                      {tournament.startDate
                        ? new Date(`${tournament.startDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Start date not set"}
                      {" · "}{registrationLabel(tournament)}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-sm">
                    {tournament.teams} {tournament.mode === "Team" ? "teams" : "players"}
                  </span>
                </div>
              </button>
            ))}
            {tournaments && !upcomingTournaments.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">No upcoming or active tournaments.</p>
            )}
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
                    <p className="text-sm text-muted-foreground">{[league.game, league.season].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {registrationLabel(league)}
                </span>
              </button>
            ))}
            {leagues && !currentLeagues.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">No upcoming or active leagues.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
