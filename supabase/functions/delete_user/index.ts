import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  try {
    // Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('EXPO_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get Authorization Header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const jwt = authHeader.replace('Bearer ', '');

    // Fetch User from JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Delete User
    const { data, error } = await supabaseClient.auth.admin.deleteUser(user.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully', data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
