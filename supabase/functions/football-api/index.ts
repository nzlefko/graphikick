import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const FOOTBALL_API_BASE_URL = 'https://api.football-data.org/v4'

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
    const { endpoint, params } = await req.json()
    console.log('Received request for endpoint:', endpoint, 'params:', params)

    if (!endpoint) {
      throw new Error('No endpoint provided')
    }

    // Ensure endpoint starts with a forward slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    
    // Build URL with query parameters
    const url = new URL(`${FOOTBALL_API_BASE_URL}${formattedEndpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value.toString())
      })
    }
    
    console.log('Making request to:', url.toString())
    
    const apiKey = Deno.env.get('FOOTBALL_API_KEY')
    if (!apiKey) {
      console.error('Football API key not configured')
      throw new Error('Football API key not configured')
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })

    console.log('Football API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Football API error response:', errorText)
      throw new Error(`Football API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully received data from Football API')
    
    return new Response(
      JSON.stringify({ data }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined,
        endpoint: req.body ? JSON.parse(await req.text()).endpoint : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})