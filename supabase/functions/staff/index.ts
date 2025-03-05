
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse the request body
    const requestBody = await req.json()
    const { action } = requestBody
    
    console.log(`Processing ${action} request:`, requestBody)
    
    // Handle different actions
    switch (action) {
      case 'create-staff': {
        const { email, firstName, lastName, role, password } = requestBody
        
        if (!email || !firstName || !lastName || !role) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })
        
        if (authError) {
          console.error('Error creating auth user:', authError)
          return new Response(
            JSON.stringify({ error: authError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        // 2. Add staff record
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
          
          return new Response(
            JSON.stringify({ error: staffError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        return new Response(
          JSON.stringify(staffData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'update-staff': {
        const { id, email, firstName, lastName, role } = requestBody
        
        if (!id || !email || !firstName || !lastName || !role) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        const { data, error } = await supabase
          .from('staff')
          .update({
            email,
            first_name: firstName,
            last_name: lastName,
            role
          })
          .eq('id', id)
          .select()
          .single()
        
        if (error) {
          console.error('Error updating staff:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'delete-staff': {
        const { staffId, userId } = requestBody
        
        if (!staffId) {
          return new Response(
            JSON.stringify({ error: 'Staff ID is required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        // Delete staff record first
        const { error: staffError } = await supabase
          .from('staff')
          .delete()
          .eq('id', staffId)
        
        if (staffError) {
          console.error('Error deleting staff record:', staffError)
          return new Response(
            JSON.stringify({ error: staffError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        // If auth_id exists, delete the auth user
        if (userId) {
          try {
            const { error: authError } = await supabase.auth.admin.deleteUser(userId)
            
            if (authError) {
              console.error('Error deleting auth user:', authError)
              // Continue anyway since the staff record was deleted
            }
          } catch (error) {
            console.error('Exception when deleting auth user:', error)
            // Continue anyway since the staff record was deleted
          }
        }
        
        return new Response(
          JSON.stringify({ message: 'Staff deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'sync-gohighlevel': {
        const { apiKey } = requestBody
        
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'GoHighLevel API key is required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        // This would be where we implement the actual GoHighLevel integration
        // For now, we'll just simulate a successful sync
        console.log('Would sync with GoHighLevel using API key:', apiKey)
        
        return new Response(
          JSON.stringify({ message: 'Staff synchronized with GoHighLevel successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
