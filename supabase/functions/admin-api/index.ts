import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se é admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (roleError || !roleData) {
      console.error('Role check error:', roleError)
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin role required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse URL e método
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    console.log('Admin API called:', { path, method: req.method, user: user.id })

    // Roteamento
    switch (path) {
      case 'settings':
        return await handleSettings(req, supabase, user.id)
      
      case 'stats':
        return await handleStats(supabase)
      
      case 'toggle-feature':
        return await handleToggleFeature(req, supabase, user.id)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleSettings(req: Request, supabase: any, userId: string) {
  if (req.method === 'GET') {
    // Listar todas as configurações
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .order('key')

    if (error) {
      console.error('Settings fetch error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch settings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ settings: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (req.method === 'PUT') {
    // Atualizar configuração
    const { key, value } = await req.json()

    if (!key) {
      return new Response(
        JSON.stringify({ error: 'Missing key parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabase
      .from('platform_settings')
      .update({ value, updated_by: userId })
      .eq('key', key)

    if (error) {
      console.error('Settings update error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update setting' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Setting updated:', { key, value, by: userId })

    return new Response(
      JSON.stringify({ success: true, message: `Setting ${key} updated` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleStats(supabase: any) {
  // Total de usuários
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Total de coletas
  const { count: coletasCount } = await supabase
    .from('coletas')
    .select('*', { count: 'exact', head: true })

  // Total de pontos
  const { data: pontosData } = await supabase
    .from('coletas')
    .select('pontos_ganhos')

  const totalPontos = pontosData?.reduce((sum: number, c: any) => sum + (c.pontos_ganhos || 0), 0) || 0

  // Total de categorias
  const { count: categoriasCount } = await supabase
    .from('categorias')
    .select('*', { count: 'exact', head: true })

  console.log('Stats fetched:', { usersCount, coletasCount, totalPontos, categoriasCount })

  return new Response(
    JSON.stringify({
      stats: {
        totalUsers: usersCount || 0,
        totalColetas: coletasCount || 0,
        totalPontos,
        totalCategorias: categoriasCount || 0,
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleToggleFeature(req: Request, supabase: any, userId: string) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { feature } = await req.json()

  if (!feature) {
    return new Response(
      JSON.stringify({ error: 'Missing feature parameter' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Buscar valor atual
  const { data: currentSetting } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', feature)
    .single()

  if (!currentSetting) {
    return new Response(
      JSON.stringify({ error: 'Feature not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Toggle
  const newValue = currentSetting.value === 'true' ? 'false' : 'true'

  const { error } = await supabase
    .from('platform_settings')
    .update({ value: newValue, updated_by: userId })
    .eq('key', feature)

  if (error) {
    console.error('Toggle error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to toggle feature' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  console.log('Feature toggled:', { feature, newValue, by: userId })

  return new Response(
    JSON.stringify({ 
      success: true, 
      feature, 
      enabled: newValue === 'true' 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
