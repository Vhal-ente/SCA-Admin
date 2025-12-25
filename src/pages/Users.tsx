import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Shield, Ban, UserCheck, Users as UsersIcon, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Users = () => {
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Users Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage players, teams, and administrators</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <TabsList className="bg-card border border-border w-max md:w-auto">
            <TabsTrigger value="players" className="text-xs md:text-sm">Players</TabsTrigger>
            <TabsTrigger value="teams" className="text-xs md:text-sm">Teams</TabsTrigger>
            <TabsTrigger value="admins" className="text-xs md:text-sm">Admins</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs md:text-sm">Reports</TabsTrigger>
          </TabsList>
        </div>

        {/* Players Tab */}
        <TabsContent value="players" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl">Players</CardTitle>
                  <CardDescription className="text-sm">Manage all registered players</CardDescription>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Add Player
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <Input placeholder="Search players..." className="w-full sm:max-w-sm" />
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranks</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="hidden sm:table-cell">Team</TableHead>
                        <TableHead className="hidden md:table-cell">Rank</TableHead>
                        <TableHead className="hidden lg:table-cell">Stats</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Player1</TableCell>
                        <TableCell className="hidden sm:table-cell">Team Alpha</TableCell>
                        <TableCell className="hidden md:table-cell"><Badge variant="secondary">Diamond</Badge></TableCell>
                        <TableCell className="hidden lg:table-cell">150 W / 120 L</TableCell>
                        <TableCell><Badge className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl">Teams</CardTitle>
                  <CardDescription className="text-sm">View and manage teams</CardDescription>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="mb-4">
                <Input placeholder="Search teams..." className="w-full sm:max-w-sm" />
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Members</TableHead>
                        <TableHead className="hidden md:table-cell">Captain</TableHead>
                        <TableHead className="hidden lg:table-cell">Win Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Team Alpha</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" />
                            5 Players
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">Player1</TableCell>
                        <TableCell className="hidden lg:table-cell">68%</TableCell>
                        <TableCell><Badge className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admins / Moderators Tab */}
        <TabsContent value="admins" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl">Admins / Moderators</CardTitle>
                  <CardDescription className="text-sm">Assign roles and permissions</CardDescription>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Add Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="mb-4">
                <Input placeholder="Search admins..." className="w-full sm:max-w-sm" />
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Role</TableHead>
                        <TableHead className="hidden lg:table-cell">Permissions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Admin User</TableCell>
                        <TableCell className="hidden sm:table-cell">admin@example.com</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="gap-1">
                            <Shield className="w-3 h-3" />
                            Super Admin
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">Full Access</TableCell>
                        <TableCell><Badge className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Moderator User</TableCell>
                        <TableCell className="hidden sm:table-cell">mod@example.com</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="gap-1">
                            <UserCheck className="w-3 h-3" />
                            Moderator
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">Limited Access</TableCell>
                        <TableCell><Badge className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports & Bans Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Reports & Ban Management</CardTitle>
              <CardDescription className="text-sm">Handle rule violations and user reports</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <Input placeholder="Search reports..." className="w-full sm:max-w-sm" />
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reported User</TableHead>
                        <TableHead className="hidden sm:table-cell">Violation</TableHead>
                        <TableHead className="hidden md:table-cell">Reported By</TableHead>
                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Player2</TableCell>
                        <TableCell className="hidden sm:table-cell">Toxic Behavior</TableCell>
                        <TableCell className="hidden md:table-cell">Player1</TableCell>
                        <TableCell className="hidden lg:table-cell">2024-03-15</TableCell>
                        <TableCell><Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Pending</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="destructive" size="sm" className="gap-1 hidden sm:flex">
                              <Ban className="w-3 h-3" />
                              Ban
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="sm:hidden text-destructive">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Ban
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Review
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Dismiss
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
