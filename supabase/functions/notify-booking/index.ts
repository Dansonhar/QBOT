import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { booking_page_id, customer_name, customer_phone, pax, booking_date, booking_time, special_requests } = await req.json();

    // Get the hosted page to find merchant email
    const { data: page, error: pageErr } = await supabase
      .from('hosted_pages')
      .select('business_name, created_by_email, config')
      .eq('short_id', booking_page_id)
      .single();

    if (pageErr || !page) {
      return new Response(
        JSON.stringify({ error: 'Booking page not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save the booking
    const { error: bookErr } = await supabase.from('bookings').insert({
      booking_page_id,
      customer_name,
      customer_phone,
      pax,
      booking_date,
      booking_time,
      special_requests: special_requests || null,
      deposit_confirmed: false,
    });

    if (bookErr) throw bookErr;

    // Send email notification to merchant if email exists
    if (page.created_by_email) {
      // Email notification via Supabase's built-in email or external service
      // For now, we log it — integrate with Resend/SendGrid when ready
      console.log(`New booking notification for ${page.business_name}:`, {
        to: page.created_by_email,
        customer: customer_name,
        phone: customer_phone,
        pax,
        date: booking_date,
        time: booking_time,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
