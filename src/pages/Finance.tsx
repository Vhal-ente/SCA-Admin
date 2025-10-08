import { Card } from "@/components/ui/card";

const Finance = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Finance</h1>
        <p className="text-muted-foreground">Manage revenue, fees, and payouts</p>
      </div>

      <Card className="p-8 bg-gradient-card border-border text-center">
        <p className="text-muted-foreground">Finance management coming soon...</p>
      </Card>
    </div>
  );
};

export default Finance;
