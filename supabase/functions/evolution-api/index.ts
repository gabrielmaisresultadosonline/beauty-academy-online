import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL');
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, instanceName, data } = await req.json();
    
    console.log(`[Evolution API] Action: ${action}, Instance: ${instanceName}`);
    console.log(`[Evolution API] URL: ${EVOLUTION_API_URL}`);

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
      throw new Error('Evolution API credentials not configured');
    }

    let endpoint = '';
    let method = 'POST';
    let body: any = null;

    switch (action) {
      case 'create-instance':
        endpoint = '/instance/create';
        body = {
          instanceName: instanceName,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        };
        break;

      case 'get-qrcode':
        endpoint = `/instance/connect/${instanceName}`;
        method = 'GET';
        break;

      case 'get-status':
        endpoint = `/instance/connectionState/${instanceName}`;
        method = 'GET';
        break;

      case 'logout':
        endpoint = `/instance/logout/${instanceName}`;
        method = 'DELETE';
        break;

      case 'delete-instance':
        endpoint = `/instance/delete/${instanceName}`;
        method = 'DELETE';
        break;

      case 'send-message':
        endpoint = `/message/sendText/${instanceName}`;
        body = {
          number: data.phone,
          text: data.message
        };
        break;

      case 'fetch-contacts':
        endpoint = `/chat/findContacts/${instanceName}`;
        method = 'GET';
        break;

      case 'fetch-messages':
        endpoint = `/chat/findMessages/${instanceName}`;
        body = {
          where: {
            key: {
              remoteJid: data.remoteJid
            }
          },
          limit: data.limit || 50
        };
        break;

      case 'list-instances':
        endpoint = '/instance/fetchInstances';
        method = 'GET';
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const url = `${EVOLUTION_API_URL}${endpoint}`;
    console.log(`[Evolution API] Calling: ${method} ${url}`);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
      console.log(`[Evolution API] Body:`, JSON.stringify(body));
    }

    const response = await fetch(url, fetchOptions);
    const responseData = await response.json();

    console.log(`[Evolution API] Response status: ${response.status}`);
    console.log(`[Evolution API] Response:`, JSON.stringify(responseData));

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Evolution API] Error:', errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
