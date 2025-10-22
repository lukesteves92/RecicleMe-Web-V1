import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Mensagem recebida:', message);

    // TODO: Integrar com IBM Watson Assistant quando as credenciais forem fornecidas
    // const IBM_WATSON_API_KEY = Deno.env.get('IBM_WATSON_API_KEY');
    // const IBM_WATSON_URL = Deno.env.get('IBM_WATSON_URL');
    // const IBM_WATSON_ASSISTANT_ID = Deno.env.get('IBM_WATSON_ASSISTANT_ID');

    // Por enquanto, retornamos respostas mockadas baseadas em palavras-chave
    let response = '';

    const messageLower = message.toLowerCase();

    if (messageLower.includes('coleta') || messageLower.includes('coletar')) {
      response = 'Você pode agendar coletas através do nosso aplicativo! Temos pontos de coleta em diversos bairros da cidade. Precisa de ajuda para encontrar o ponto mais próximo?';
    } else if (messageLower.includes('recicl') || messageLower.includes('lixo')) {
      response = 'A reciclagem é fundamental! Separamos materiais como plástico, papel, vidro e metal. Você sabe como separar corretamente seus resíduos?';
    } else if (messageLower.includes('ponto') || messageLower.includes('local')) {
      response = 'Temos vários pontos de coleta disponíveis: EcoPonto Centro (Rua das Flores, 123), Cooperativa ReciclaVida (Av. Reciclagem, 456) e EcoPonto Norte (Rua Sustentável, 789). Qual fica mais próximo de você?';
    } else if (messageLower.includes('como') || messageLower.includes('funciona')) {
      response = 'É muito simples! 1) Separe seus resíduos recicláveis, 2) Encontre o ponto de coleta mais próximo, 3) Leve seus materiais até lá, 4) Ganhe pontos que podem ser trocados por recompensas!';
    } else if (messageLower.includes('pontos') || messageLower.includes('recompensa')) {
      response = 'A cada kg de material reciclável que você entrega, ganha pontos! Plástico e vidro: 10 pontos/kg, Papel: 8 pontos/kg, Metal: 15 pontos/kg. Acumule pontos e troque por descontos em parceiros!';
    } else if (messageLower.includes('olá') || messageLower.includes('oi') || messageLower.includes('bom dia') || messageLower.includes('boa tarde') || messageLower.includes('boa noite')) {
      response = 'Olá! Bem-vindo ao Recicle.me! 👋 Sou seu assistente virtual. Como posso ajudar você hoje? Posso responder sobre coletas, pontos de reciclagem, recompensas e muito mais!';
    } else {
      response = 'Obrigado pela sua pergunta! Posso ajudar você com informações sobre coletas, pontos de reciclagem, tipos de materiais recicláveis e recompensas. Como posso auxiliar?';
    }

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Erro no watson-chat:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
