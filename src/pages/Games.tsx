import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight, Edit, Trash2, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameModal, Game } from "@/components/GameModal";
import { PlayerModal, Player } from "@/components/PlayerModal";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Games = () => {
  const [activeTab, setActiveTab] = useState("games");
  const { toast } = useToast();

  // Games state
  const [games, setGames] = useState<Game[]>([
    { 
      id: 1, 
      name: "CODM", 
      fullName: "Call of Duty Mobile",
      players: 11,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop"
    },
    { 
      id: 2, 
      name: "MLBB", 
      fullName: "Mobile Legends",
      players: 9,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop"
    },
    { 
      id: 3, 
      name: "PUBGM", 
      fullName: "PUBG Mobile",
      players: 90,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop"
    },
  ]);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [deleteGameDialog, setDeleteGameDialog] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  // Players state
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player1", team: "Team Alpha", rank: "Diamond", wins: 150, losses: 120, status: "active", game: "CODM" },
    { id: 2, name: "Player2", team: "Team Beta", rank: "Platinum", wins: 80, losses: 60, status: "active", game: "MLBB" },
    { id: 3, name: "Player3", team: "Team Gamma", rank: "Gold", wins: 45, losses: 55, status: "inactive", game: "PUBGM" },
  ]);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [deletePlayerDialog, setDeletePlayerDialog] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [playerSearch, setPlayerSearch] = useState("");

  // Game handlers
  const handleAddGame = () => {
    setSelectedGame(null);
    setGameModalOpen(true);
  };

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
    setGameModalOpen(true);
  };

  const handleSaveGame = (gameData: Omit<Game, "id"> & { id?: number }) => {
    if (gameData.id) {
      setGames(games.map((g) => (g.id === gameData.id ? { ...g, ...gameData } as Game : g)));
      toast({ title: "Game Updated", description: "Game has been updated successfully." });
    } else {
      const newGame = { ...gameData, id: Date.now() } as Game;
      setGames([...games, newGame]);
      toast({ title: "Game Added", description: "New game has been added successfully." });
    }
  };

  const handleDeleteGame = (game: Game) => {
    setGameToDelete(game);
    setDeleteGameDialog(true);
  };

  const confirmDeleteGame = () => {
    if (gameToDelete) {
      setGames(games.filter((g) => g.id !== gameToDelete.id));
      toast({ title: "Game Deleted", description: "Game has been removed successfully." });
      setDeleteGameDialog(false);
      setGameToDelete(null);
    }
  };

  // Player handlers
  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setPlayerModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setPlayerModalOpen(true);
  };

  const handleSavePlayer = (playerData: Omit<Player, "id"> & { id?: number }) => {
    if (playerData.id) {
      setPlayers(players.map((p) => (p.id === playerData.id ? { ...p, ...playerData } as Player : p)));
      toast({ title: "Player Updated", description: "Player has been updated successfully." });
    } else {
      const newPlayer = { ...playerData, id: Date.now() } as Player;
      setPlayers([...players, newPlayer]);
      toast({ title: "Player Added", description: "New player has been registered successfully." });
    }
  };

  const handleDeletePlayer = (player: Player) => {
    setPlayerToDelete(player);
    setDeletePlayerDialog(true);
  };

  const confirmDeletePlayer = () => {
    if (playerToDelete) {
      setPlayers(players.filter((p) => p.id !== playerToDelete.id));
      toast({ title: "Player Deleted", description: "Player has been removed successfully." });
      setDeletePlayerDialog(false);
      setPlayerToDelete(null);
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
    player.team.toLowerCase().includes(playerSearch.toLowerCase())
  );

  const gameNames = games.map((g) => g.name);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">GAMES AND PLAYERS MANAGEMENT</h1>
        </div>
        <Button 
          onClick={activeTab === "games" ? handleAddGame : handleAddPlayer}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          {activeTab === "games" ? "Add Game" : "Add Player"}
        </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="p-4 md:p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 md:gap-4 mb-4">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-accent mb-1 truncate">{game.name}</h3>
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
                    onClick={() => handleDeleteGame(game)}
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
              <div className="mb-4">
                <Input 
                  placeholder="Search players..." 
                  className="max-w-full sm:max-w-sm"
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="hidden sm:table-cell">Game</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="hidden md:table-cell">Rank</TableHead>
                        <TableHead className="hidden lg:table-cell">Stats</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">{player.game}</TableCell>
                          <TableCell>{player.team}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary">{player.rank}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{player.wins} W / {player.losses} L</TableCell>
                          <TableCell>
                            <Badge className={player.status === "active" 
                              ? "bg-green-500/20 text-green-500 border-green-500/50" 
                              : "bg-muted text-muted-foreground"
                            }>
                              {player.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditPlayer(player)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePlayer(player)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Game Modal */}
      <GameModal
        open={gameModalOpen}
        onOpenChange={setGameModalOpen}
        game={selectedGame}
        onSave={handleSaveGame}
      />

      {/* Player Modal */}
      <PlayerModal
        open={playerModalOpen}
        onOpenChange={setPlayerModalOpen}
        player={selectedPlayer}
        onSave={handleSavePlayer}
        games={gameNames}
      />

      {/* Delete Game Dialog */}
      <AlertDialog open={deleteGameDialog} onOpenChange={setDeleteGameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{gameToDelete?.name}"? This action cannot be undone.
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

      {/* Delete Player Dialog */}
      <AlertDialog open={deletePlayerDialog} onOpenChange={setDeletePlayerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playerToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePlayer} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Games;
