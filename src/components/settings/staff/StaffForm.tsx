
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  auth_id?: string;
  gohighlevel_id?: string;
}

interface StaffFormProps {
  isAdding: boolean;
  isEditing: string | null;
  email: string;
  setEmail: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  resetForm: () => void;
  handleAddStaff: (e: React.FormEvent) => Promise<void>;
  handleEditStaff: (e: React.FormEvent) => Promise<void>;
}

const StaffForm: React.FC<StaffFormProps> = ({
  isAdding,
  isEditing,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  role,
  setRole,
  password,
  setPassword,
  resetForm,
  handleAddStaff,
  handleEditStaff
}) => {
  return (
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
  );
};

export default StaffForm;
