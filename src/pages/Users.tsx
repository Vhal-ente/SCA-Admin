import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Users = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Users Management</h1>
          <p className="text-muted-foreground">Manage players, teams, and administrators</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <Card className="p-8 bg-gradient-card border-border text-center">
        <p className="text-muted-foreground">User management features coming soon...</p>
      </Card>
    </div>
  );
};

export default Users;
