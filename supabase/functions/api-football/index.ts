import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params } = await req.json();
    console.log('Received request for endpoint:', endpoint, 'with params:', params);

    if (!endpoint) {
      throw new Error('No endpoint provided');
    }

    const apiKey = Deno.env.get('API_FOOTBALL_KEY');
    if (!apiKey) {
      console.error('API Football key not found in environment');
      throw new Error('API Football key not configured');
    }

    // Log API key presence (never log the actual key)
    console.log('API key is present and has length:', apiKey.length);

    // Construct URL with query parameters
    const url = new URL(`${API_FOOTBALL_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    console.log('Making request to:', url.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

    console.log('API Football response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Football error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`API Football Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received data from API Football');
    
    return new Response(
      JSON.stringify({ data }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error.message);
    console.error('Full error details:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});