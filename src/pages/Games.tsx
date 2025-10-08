import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowRight } from "lucide-react";

const Games = () => {
  const [activeTab, setActiveTab] = useState("games");

  const games = [
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
      name: "MLBB", 
      fullName: "Mobile Legends Bang Bang",
      players: 90,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop"
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">GAMES AND PLAYERS MANAGEMENT</h1>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          Add Game
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0 h-auto">
          <TabsTrigger 
            value="games"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
          >
            Games
          </TabsTrigger>
          <TabsTrigger 
            value="players"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 text-muted-foreground"
          >
            Players
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-accent mb-1">{game.name}</h3>
                    <p className="text-sm text-muted-foreground">Players - {game.players}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-accent hover:text-accent hover:bg-accent/10 group-hover:bg-accent/20"
                >
                  Edit
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="players" className="mt-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Players management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Games;
