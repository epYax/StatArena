import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RiotApiRequest {
  endpoint: string;
  region?: string;
  regional?: string;
  params?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify the request is authenticated via Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the Riot API key from environment (secure server-side)
    const RIOT_API_KEY = Deno.env.get('RIOT_API_KEY')
    if (!RIOT_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Riot API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse the request body
    const { endpoint, region = 'euw1', regional = 'europe', params = {} }: RiotApiRequest = await req.json()

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Build the Riot API URL
    let baseUrl: string
    if (endpoint.includes('/account/') || endpoint.includes('/match/')) {
      // Regional endpoints (for account and match data)
      baseUrl = `https://${regional}.api.riotgames.com`
    } else {
      // Platform endpoints (for summoner, league data)
      baseUrl = `https://${region}.api.riotgames.com`
    }

    // Add query parameters
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value))
      }
    })

    const apiUrl = `${baseUrl}${endpoint}?${urlParams.toString()}`

    console.log(`Making Riot API request to: ${apiUrl}`)

    // Make the request to Riot API
    const riotResponse = await fetch(apiUrl, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
        'Accept': 'application/json',
      },
    })

    if (!riotResponse.ok) {
      const errorText = await riotResponse.text()
      console.error(`Riot API error: ${riotResponse.status} - ${errorText}`)
      
      return new Response(
        JSON.stringify({ 
          error: `Riot API error: ${riotResponse.status}`,
          details: errorText 
        }),
        { 
          status: riotResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await riotResponse.json()

    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in riot-api function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})