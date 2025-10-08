import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Schedule = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Schedule</h1>
          <p className="text-muted-foreground">Centralized timeline for all events</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <Card className="p-8 bg-gradient-card border-border text-center">
        <p className="text-muted-foreground">Calendar view coming soon...</p>
      </Card>
    </div>
  );
};

export default Schedule;
