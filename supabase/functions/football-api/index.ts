import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { endpoint } = await req.json()
    const FOOTBALL_API_BASE_URL = 'https://api.football-data.org/v4'
    
    console.log(`Proxying request to: ${FOOTBALL_API_BASE_URL}${endpoint}`)
    
    const response = await fetch(`${FOOTBALL_API_BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': Deno.env.get('FOOTBALL_API_KEY') || '',
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in football-api function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})