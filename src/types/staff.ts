
export interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  auth_id?: string;
  gohighlevel_id?: string;
}

export interface StaffFormState {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}
