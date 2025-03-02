
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  auth_id?: string;
  gohighlevel_id?: string;
}

interface StaffListProps {
  staffMembers: StaffMember[];
  loading: boolean;
  startEdit: (staff: StaffMember) => void;
  handleDeleteStaff: (id: string, authId: string | null) => Promise<void>;
}

const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  loading,
  startEdit,
  handleDeleteStaff
}) => {
  return (
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
                        onClick={() => handleDeleteStaff(staff.id, staff.auth_id || null)}
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
  );
};

export default StaffList;
