
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  gohighlevel_id?: string;
}

const StaffSettings = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  
  const { settings } = useSettings();
  const goHighLevelApiKey = settings.goHighLevelApiKey;

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error: any) {
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");
      
      // 2. Add staff record
      const { error: staffError } = await supabase
        .from('staff')
        .insert([
          {
            auth_id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role
          }
        ]);
      
      if (staffError) throw staffError;
      
      toast.success("Staff member added successfully");
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error adding staff: ${error.message}`);
    }
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    try {
      const { error } = await supabase
        .from('staff')
        .update({
          email,
          first_name: firstName,
          last_name: lastName,
          role
        })
        .eq('id', isEditing);
      
      if (error) throw error;
      
      toast.success("Staff member updated successfully");
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error updating staff: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (id: string, authId: string | null) => {
    try {
      // Delete staff record first
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (staffError) throw staffError;
      
      // If we have an auth_id, delete the auth user too
      if (authId) {
        // Note: This would require admin privileges, so this may need to be
        // handled through an Edge Function in production
        console.log("Would delete auth user with ID:", authId);
      }
      
      toast.success("Staff member deleted successfully");
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error deleting staff: ${error.message}`);
    }
  };

  const startEdit = (staff: StaffMember) => {
    setIsAdding(false);
    setIsEditing(staff.id);
    setEmail(staff.email);
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setRole(staff.role);
    setPassword(""); // Don't set password when editing
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("staff");
    setPassword("");
  };

  const syncWithGoHighLevel = async () => {
    if (!goHighLevelApiKey) {
      toast.error("GoHighLevel API key is not configured");
      return;
    }
    
    setSyncing(true);
    try {
      // This would be implemented in a Supabase Edge Function
      // For now, we'll just show a toast
      toast.info("GoHighLevel sync functionality will be implemented via Edge Function");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error: any) {
      toast.error(`Error syncing with GoHighLevel: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>
            Add and manage staff members with access to the POS system
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {goHighLevelApiKey && (
            <Button 
              variant="outline" 
              onClick={syncWithGoHighLevel}
              disabled={syncing}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {syncing ? "Syncing..." : "Sync with GoHighLevel"}
            </Button>
          )}
          <Button 
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <form 
            className="border rounded-md p-4 mb-6" 
            onSubmit={isEditing ? handleEditStaff : handleAddStaff}
          >
            <h3 className="text-lg font-medium mb-4">
              {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
              {isAdding && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Initial Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={isAdding}
                  />
                  <p className="text-sm text-muted-foreground">
                    The staff member will use this initial password to log in
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Staff" : "Add Staff"}
              </Button>
            </div>
          </form>
        )}
        
        {/* Staff List */}
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">GoHighLevel</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="h-12 px-4 text-center">Loading staff members...</td>
                  </tr>
                ) : staffMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-12 px-4 text-center">No staff members found</td>
                  </tr>
                ) : (
                  staffMembers.map((staff) => (
                    <tr 
                      key={staff.id} 
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4">
                        {staff.first_name} {staff.last_name}
                      </td>
                      <td className="p-4">{staff.email}</td>
                      <td className="p-4">
                        <span className={`capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          staff.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400' 
                            : staff.role === 'manager'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400'
                        }`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {staff.gohighlevel_id ? (
                          <span className="text-green-600 dark:text-green-400">Synced</span>
                        ) : (
                          <span className="text-gray-400">Not synced</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEdit(staff)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteStaff(staff.id, staff.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffSettings;
