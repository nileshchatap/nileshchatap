// Sends an email notification to the admin when a new contact submission arrives.
// Uses the Resend connector via the Lovable connector gateway.
// Requires: LOVABLE_API_KEY (auto-provisioned) and RESEND_API_KEY (from Resend connector).

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email not configured. Add the Resend connector and verify a sending domain.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = (await req.json()) as ContactPayload;
    if (!body?.name || !body?.email || !body?.message) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Pull the admin notification email from site_settings (fallback below).
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    let notifyTo = 'nileshchatap25@gmail.com';
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=notification_email&limit=1`, {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      });
      const rows = (await r.json()) as Array<{ notification_email: string }>;
      if (rows[0]?.notification_email) notifyTo = rows[0].notification_email;
    } catch (_) { /* keep fallback */ }

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
      ${body.phone ? `<p><strong>Phone:</strong> ${escapeHtml(body.phone)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(body.message).replace(/\n/g, '<br/>')}</p>
    `;

    const emailRes = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: [notifyTo],
        reply_to: body.email,
        subject: `New portfolio message from ${body.name}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const details = await emailRes.text();
      console.error('Resend gateway error', emailRes.status, details);
      return new Response(JSON.stringify({ ok: false, status: emailRes.status, details }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('notify-contact failure', err);
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
