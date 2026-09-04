import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const quoteId = url.searchParams.get('id');
    const action = url.searchParams.get('action');

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      });
    }

    if (req.method === 'PUT' && quoteId && action === 'update-status') {
      const { status } = await req.json();
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', quoteId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      });
    }

    if (req.method === 'POST' && quoteId && action === 'add-note') {
      const { content, created_by } = await req.json();
      
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('notes')
        .eq('id', quoteId)
        .single();

      if (fetchError) throw fetchError;

      const currentNotes = order.notes || [];
      const newNote = {
        content,
        created_by,
        created_at: new Date().toISOString(),
      };
      const updatedNotes = [...currentNotes, newNote];

      const { error } = await supabase
        .from('orders')
        .update({ notes: updatedNotes })
        .eq('id', quoteId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 405,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 400,
    });
  }
});