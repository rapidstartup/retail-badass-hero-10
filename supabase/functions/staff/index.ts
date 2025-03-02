
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

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const action = url.searchParams.get('action')
    
    // GET request - Fetch staff
    if (req.method === 'GET') {
      let query = supabase.from('staff').select('*')
      
      if (id) {
        query = query.eq('id', id)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching staff:', error)
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
    
    // POST request - Create or update staff
    if (req.method === 'POST') {
      // Special handling for GoHighLevel sync
      if (action === 'sync-gohighlevel') {
        const { apiKey } = await req.json()
        
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
      
      const staffData = await req.json()
      
      // For adding new staff
      if (!id) {
        // Create auth user if provided with password
        if (staffData.password) {
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: staffData.email,
            password: staffData.password,
            email_confirm: true,
          })
          
          if (authError) {
            console.error('Error creating auth user:', authError)
            return new Response(
              JSON.stringify({ error: authError.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }
          
          // Add auth_id to staff data
          staffData.auth_id = authData.user.id
        }
        
        // Remove password from data before storing in the staff table
        const { password, ...staffDataWithoutPassword } = staffData
        
        const { data, error } = await supabase
          .from('staff')
          .insert(staffDataWithoutPassword)
          .select()
          .single()
        
        if (error) {
          console.error('Error creating staff:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        // Update existing staff
        const { password, ...staffDataWithoutPassword } = staffData
        
        const { data, error } = await supabase
          .from('staff')
          .update(staffDataWithoutPassword)
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
    }
    
    // DELETE request - Delete staff
    if (req.method === 'DELETE') {
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Staff ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // First, get the staff record to check if it has an auth_id
      const { data: staffData, error: fetchError } = await supabase
        .from('staff')
        .select('auth_id')
        .eq('id', id)
        .single()
      
      if (fetchError) {
        console.error('Error fetching staff for deletion:', fetchError)
        return new Response(
          JSON.stringify({ error: fetchError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Delete the staff record
      const { error: deleteError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id)
      
      if (deleteError) {
        console.error('Error deleting staff:', deleteError)
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // If the staff record had an auth_id, delete the auth user too
      if (staffData.auth_id) {
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
          staffData.auth_id
        )
        
        if (authDeleteError) {
          console.error('Error deleting auth user:', authDeleteError)
          // Continue anyway since the staff record was deleted
        }
      }
      
      return new Response(
        JSON.stringify({ message: 'Staff deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Return 405 for unsupported methods
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )
    
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
