import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight, Trash2, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameModal, Game } from "@/components/modals/GameModal";
import { api, type ApiGame, type ApiGamePlayer } from "@/lib/api";
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

const SEARCH_DELAY_MS = 300;

const toGame = (game: ApiGame): Game => ({
  id: game.id, name: game.shortName || game.name, fullName: game.name,
  players: game.players ?? 0, image: game.iconUrl, active: game.active,
});

const Games = () => {
  const [activeTab, setActiveTab] = useState("games");
  const { toast } = useToast();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  const [playerGame, setPlayerGame] = useState("");
  const [players, setPlayers] = useState<ApiGamePlayer[]>([]);
  const [playerSearch, setPlayerSearch] = useState("");
  const [playersLoading, setPlayersLoading] = useState(false);

  const loadGames = useCallback(async () => {
    try {
      const { games: list } = await api.get<{ games: ApiGame[] }>("/admin/games");
      setGames(list.map(toGame));
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGames(); }, [loadGames]);
  useEffect(() => { if (!playerGame && games.length) setPlayerGame(games[0].id); }, [games, playerGame]);

  useEffect(() => {
    if (!playerGame) return;
    const timer = window.setTimeout(async () => {
      setPlayersLoading(true);
      try {
        const query = playerSearch.trim() ? `?q=${encodeURIComponent(playerSearch.trim())}` : "";
        const { players: list } = await api.get<{ players: ApiGamePlayer[] }>(`/admin/games/${playerGame}/players${query}`);
        setPlayers(list);
      } catch (error) {
        toast({ title: "Could not load players", description: (error as Error).message, variant: "destructive" });
      } finally {
        setPlayersLoading(false);
      }
    }, SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [playerGame, playerSearch, toast]);

  const handleAddGame = () => {
    setSelectedGame(null);
    setGameModalOpen(true);
  };

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
    setGameModalOpen(true);
  };

  const handleSaveGame = async ({ id, ...data }: Omit<Game, "id" | "players"> & { id?: string }) => {
    const body = { name: data.fullName, shortName: data.name, iconUrl: data.image, active: data.active };
    try {
      if (id) await api.patch(`/admin/games/${id}`, body);
      else await api.post("/admin/games", body);
      toast({ title: id ? "Game Updated" : "Game Added", description: data.fullName });
      await loadGames();
      return true;
    } catch (error) {
      toast({ title: "Could not save game", description: (error as Error).message, variant: "destructive" });
      return false;
    }
  };

  const confirmDeleteGame = async () => {
    if (!gameToDelete) return;
    try {
      await api.delete(`/admin/games/${gameToDelete.id}`);
      toast({ title: "Game Deleted", description: `${gameToDelete.fullName} was removed.` });
      await loadGames();
    } catch (error) {
      toast({ title: "Could not delete game", description: (error as Error).message, variant: "destructive" });
    } finally {
      setGameToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 xl:p-10">
      <div className="mx-auto max-w-[1500px] space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-primary">Platform catalogue</p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">Games & Players</h1>
          <p className="mt-3 text-muted-foreground">Maintain supported titles and see who plays them.</p>
        </div>
        {activeTab === "games" && (
          <Button onClick={handleAddGame} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Game
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0 h-auto">
          <TabsTrigger
            value="games"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 md:px-6 py-3"
          >
            Games
          </TabsTrigger>
          <TabsTrigger
            value="players"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 md:px-6 py-3 text-muted-foreground"
          >
            Players
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="mt-6 md:mt-8">
          {loading && <p className="text-sm text-muted-foreground">Loading games…</p>}
          {loadError && <p className="border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{loadError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className={`p-4 md:p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 group ${game.active ? "" : "opacity-60"}`}
              >
                <div className="flex items-start gap-3 md:gap-4 mb-4">
                  {game.image
                    ? <img src={game.image} alt={game.name} className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover" />
                    : <span className="flex w-16 h-16 md:w-20 md:h-20 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><Gamepad2 className="h-7 w-7" /></span>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl md:text-2xl font-bold text-accent mb-1 truncate">{game.name}</h3>
                      {!game.active && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{game.fullName}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Players - {game.players}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditGame(game)}
                    className="flex-1 justify-between text-accent hover:text-accent hover:bg-accent/10 group-hover:bg-accent/20"
                  >
                    Edit
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${game.fullName}`}
                    onClick={() => setGameToDelete(game)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="players" className="mt-6 md:mt-8">
          <Card className="bg-gradient-card border-border">
            <div className="p-4 md:p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <select
                  value={playerGame}
                  onChange={(e) => setPlayerGame(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  aria-label="Game"
                >
                  {games.map((game) => <option key={game.id} value={game.id}>{game.fullName}</option>)}
                </select>
                <Input
                  placeholder="Search players..."
                  className="max-w-full sm:max-w-sm"
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                />
              </div>
              <p className="mb-4 text-xs text-muted-foreground">Accounts that list this game on their profile. Manage accounts in Users.</p>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="hidden sm:table-cell">Name</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.ign}</TableCell>
                          <TableCell className="hidden sm:table-cell">{player.name || "—"}</TableCell>
                          <TableCell>{player.teams.join(", ") || "No team"}</TableCell>
                          <TableCell>
                            <Badge className={player.status === "active"
                              ? "bg-green-500/20 text-green-500 border-green-500/50"
                              : "bg-muted text-muted-foreground"
                            }>
                              {player.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!players.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                            {playersLoading ? "Loading players…" : "No players list this game yet."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <GameModal
        open={gameModalOpen}
        onOpenChange={setGameModalOpen}
        game={selectedGame}
        onSave={handleSaveGame}
      />

      <AlertDialog open={Boolean(gameToDelete)} onOpenChange={(open) => !open && setGameToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{gameToDelete?.fullName}"? A game that competitions, teams, or profiles use can only be hidden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGame} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
};

export default Games;
