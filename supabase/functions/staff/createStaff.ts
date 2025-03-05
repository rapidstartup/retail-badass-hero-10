
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { CorsHeaders, createErrorResponse, createSuccessResponse } from "./types.ts"

// Handle staff creation
export async function handleCreateStaff(
  supabase: SupabaseClient,
  requestBody: any,
  corsHeaders: CorsHeaders
): Promise<Response> {
  const { email, firstName, lastName, role, password } = requestBody
  
  if (!email || !firstName || !lastName || !role) {
    return createErrorResponse('Missing required fields', corsHeaders)
  }
  
  // Check if a user with this email already exists in the staff table
  const { data: existingStaffMembers, error: staffSearchError } = await supabase
    .from('staff')
    .select('email, auth_id')
    .eq('email', email)
    .limit(1)
  
  if (staffSearchError) {
    console.error('Error checking for existing staff member:', staffSearchError)
    return createErrorResponse(staffSearchError.message, corsHeaders)
  }
  
  if (existingStaffMembers && existingStaffMembers.length > 0) {
    return createErrorResponse('A staff member with this email already exists', corsHeaders)
  }
  
  // Try to create a new auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  
  if (authError) {
    // Special handling for already existing auth users
    if (authError.message.includes('already been registered')) {
      console.log('Auth user exists but no staff record found. Creating staff record for existing auth user.')
      return await handleExistingAuthUser(supabase, email, firstName, lastName, role, corsHeaders)
    } else {
      console.error('Error creating auth user:', authError)
      return createErrorResponse(authError.message, corsHeaders)
    }
  }
  
  // 2. Add staff record for the new auth user
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .insert([
      {
        auth_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role
      }
    ])
    .select()
    .single()
  
  if (staffError) {
    console.error('Error creating staff record:', staffError)
    
    // Attempt to clean up the auth user since staff record creation failed
    try {
      await supabase.auth.admin.deleteUser(authData.user.id)
    } catch (cleanupError) {
      console.error('Failed to clean up auth user after staff creation error:', cleanupError)
    }
    
    return createErrorResponse(staffError.message, corsHeaders)
  }
  
  return createSuccessResponse(staffData, corsHeaders)
}

// Helper function to handle existing auth user case
async function handleExistingAuthUser(
  supabase: SupabaseClient,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  corsHeaders: CorsHeaders
): Promise<Response> {
  // Try to find the user's ID to link to staff record
  const { data: existingAuthUser } = await supabase.auth.admin.listUsers({
    filters: {
      email: email
    }
  })
  
  if (existingAuthUser && existingAuthUser.users && existingAuthUser.users.length > 0) {
    const existingUser = existingAuthUser.users[0]
    
    // Double check if staff record already exists for this auth user
    const { data: existingStaff } = await supabase
      .from('staff')
      .select('*')
      .eq('auth_id', existingUser.id)
      .limit(1)
    
    if (existingStaff && existingStaff.length > 0) {
      return createErrorResponse('A staff member with this auth ID already exists', corsHeaders)
    }
    
    // Create a staff record linked to the existing auth user
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .insert([
        {
          auth_id: existingUser.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role
        }
      ])
      .select()
      .single()
      
    if (staffError) {
      console.error('Error creating staff record:', staffError)
      return createErrorResponse(staffError.message, corsHeaders)
    }
    
    return createSuccessResponse(staffData, corsHeaders)
  } else {
    console.error('Error finding auth user despite already registered message')
    return createErrorResponse('Auth user registered but not found', corsHeaders)
  }
}
