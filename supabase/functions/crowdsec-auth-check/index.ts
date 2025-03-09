import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const CROWDSEC_API_KEY = Deno.env.get('CROWDSEC_API_KEY');
const CROWDSEC_INSTANCE_ID = Deno.env.get('CROWDSEC_INSTANCE_ID');

serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  // Check IP against CrowdSec
  const response = await fetch(`https://api.crowdsec.net/v2/decisions?ip=${ip}`, {
    headers: {
      'X-Api-Key': CROWDSEC_API_KEY,
      'X-Instance-ID': CROWDSEC_INSTANCE_ID,
    },
  });

  if (!response.ok) {
    return new Response('Error checking security', { status: 500 });
  }

  const data = await response.json();
  if (data.length > 0 && data[0].type === 'ban') {
    return new Response('Blocked by security system', { status: 403 });
  }

  return new Response(JSON.stringify({ allowed: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
