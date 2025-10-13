import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <Tabs defaultValue="platform" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="platform">Platform Settings</TabsTrigger>
          <TabsTrigger value="notifications">Email & Notifications</TabsTrigger>
          <TabsTrigger value="permissions">Permissions & Roles</TabsTrigger>
        </TabsList>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Update your platform's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-text">Hero Text</Label>
                <Input id="hero-text" placeholder="Enter hero text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-us">About Us</Label>
                <Textarea id="about-us" placeholder="Tell us about your platform" rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your platform's visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Platform Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero Banner</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Banner
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-4">
                  <Input id="primary-color" type="color" className="w-20 h-10" defaultValue="#00d9b8" />
                  <Input value="#00d9b8" className="flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Email & Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email service and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" placeholder="587" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" placeholder="noreply@yourplatform.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" placeholder="Your Platform" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose which notifications to send to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tournament Updates</Label>
                  <p className="text-sm text-muted-foreground">Notify users about tournament changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Match Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send reminders before matches start</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify about prize payouts and fees</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>News & Updates</Label>
                  <p className="text-sm text-muted-foreground">Send platform news and announcements</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Permissions & Roles */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>Manage administrator access and roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-admin">Add New Admin</Label>
                <div className="flex gap-2">
                  <Input id="add-admin" placeholder="Enter email address" type="email" className="flex-1" />
                  <Button>Add Admin</Button>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <Label>Current Admins</Label>
                <div className="space-y-2">
                  {[
                    { email: "admin@platform.com", role: "Super Admin" },
                    { email: "moderator@platform.com", role: "Moderator" },
                    { email: "support@platform.com", role: "Support" },
                  ].map((admin, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="font-medium text-foreground">{admin.email}</p>
                        <p className="text-sm text-muted-foreground">{admin.role}</p>
                      </div>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure what each role can do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Super Admin</Label>
                  <p className="text-sm text-muted-foreground mb-3">Full access to all features</p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked disabled />
                      <span className="text-sm">Manage tournaments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked disabled />
                      <span className="text-sm">Manage users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked disabled />
                      <span className="text-sm">Manage finances</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked disabled />
                      <span className="text-sm">System settings</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Label className="text-base">Moderator</Label>
                  <p className="text-sm text-muted-foreground mb-3">Limited administrative access</p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Manage tournaments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Manage users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">Manage finances</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">System settings</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Label className="text-base">Support</Label>
                  <p className="text-sm text-muted-foreground mb-3">View-only access with user support</p>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">Manage tournaments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">View users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">Manage finances</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">System settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
