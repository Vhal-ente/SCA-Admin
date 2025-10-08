import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <Card className="p-8 bg-gradient-card border-border text-center">
        <p className="text-muted-foreground">Settings panel coming soon...</p>
      </Card>
    </div>
  );
};

export default Settings;
