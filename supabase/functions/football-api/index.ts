import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FOOTBALL_API_BASE_URL = 'https://api.football-data.org/v4'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { endpoint } = await req.json()
    console.log('Requesting endpoint:', endpoint)

    if (!endpoint) {
      throw new Error('No endpoint provided')
    }

    const apiKey = Deno.env.get('FOOTBALL_API_KEY')
    if (!apiKey) {
      throw new Error('Football API key not configured')
    }

    const response = await fetch(`${FOOTBALL_API_BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })

    console.log('Football API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Football API error:', errorText)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge function error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})