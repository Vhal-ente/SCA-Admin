import { Card } from "@/components/ui/card";

const Shogun = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Shogun Esports</h1>
        <p className="text-muted-foreground">Manage your esports team</p>
      </div>

      <Card className="p-8 bg-gradient-card border-border text-center">
        <p className="text-muted-foreground">Team management features coming soon...</p>
      </Card>
    </div>
  );
};

export default Shogun;
