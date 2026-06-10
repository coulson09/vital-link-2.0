import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const url = new URL(req.url);
    const path = url.pathname;

    // GET /profiles - Obtener todos los perfiles
    if (req.method === 'GET' && path.endsWith('/profiles')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /profiles - Crear perfil
    if (req.method === 'POST' && path.endsWith('/profiles')) {
      const body = await req.json();
      const { data, error } = await supabase
        .from('profiles')
        .insert(body)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // PUT /profiles/:id - Actualizar perfil
    const updateMatch = path.match(/\/profiles\/([^\/]+)$/);
    if (req.method === 'PUT' && updateMatch) {
      const id = updateMatch[1];
      const body = await req.json();

      const updateData = {
        name: body.name,
        status: body.status,
        type: body.type,
        plan: body.plan,
        photo: body.photo || null,
        phone: body.phone || null,
        emergency_contact: body.emergencyContact || body.emergency_contact || null,
        emergency_phone: body.emergencyPhone || body.emergency_phone || null,
        medical_notes: body.medicalNotes || body.medical_notes || null,
        allergies: body.allergies || null,
        blood_type: body.bloodType || body.blood_type || null,
        address: body.address || null,
        owner_name: body.ownerName || body.owner_name || null,
        breed: body.breed || null,
        color: body.color || null,
        weight: body.weight || null,
        birth_date: body.birthDate || body.birth_date || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // DELETE /profiles/:id - Eliminar perfil
    const deleteMatch = path.match(/\/profiles\/([^\/]+)$/);
    if (req.method === 'DELETE' && deleteMatch) {
      const id = deleteMatch[1];
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
