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
    console.log('Received request for endpoint:', endpoint)

    if (!endpoint) {
      throw new Error('No endpoint provided')
    }

    // Ensure endpoint starts with a forward slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    console.log('Formatted endpoint:', formattedEndpoint)

    const apiKey = Deno.env.get('FOOTBALL_API_KEY')
    if (!apiKey) {
      console.error('Football API key not configured')
      throw new Error('Football API key not configured')
    }

    console.log('Making request to:', `${FOOTBALL_API_BASE_URL}${formattedEndpoint}`)
    
    const response = await fetch(`${FOOTBALL_API_BASE_URL}${formattedEndpoint}`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })

    console.log('Football API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Football API error response:', errorText)
      
      // Return a more detailed error response
      return new Response(
        JSON.stringify({
          error: `Football API Error: ${response.status}`,
          details: errorText,
          endpoint: formattedEndpoint
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
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
    console.error('Edge function error:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})