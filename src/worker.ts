// Interface pour l'environnement
interface Env {
  DB: D1Database;
  TREES_WEBSOCKET: DurableObjectNamespace;
}

// Types pour nos modèles
interface ChristmasTree {
  id?: number;
  customer_id: number;
  size: string;
  price: number;
  sale_date: string;
  pickup_status: 'pending' | 'scheduled' | 'completed';
  pickup_date?: string;
  pickup_notes?: string;
}

// Durable Object pour gérer l'état en temps réel
export class TreesWebSocket {
  private sessions: WebSocket[];
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = [];
  }

  async fetch(request: Request) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      await this.handleSession(server);
      
      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }
    return new Response('Expected WebSocket', { status: 400 });
  }

  private async handleSession(webSocket: WebSocket) {
    this.sessions.push(webSocket);

    webSocket.accept();

    webSocket.addEventListener('message', async msg => {
      const data = JSON.parse(msg.data as string);
      // Diffuser la mise à jour à tous les clients connectés
      this.broadcast(data);
    });

    webSocket.addEventListener('close', () => {
      this.sessions = this.sessions.filter(session => session !== webSocket);
    });
  }

  private broadcast(data: any) {
    this.sessions.forEach(session => {
      session.send(JSON.stringify(data));
    });
  }
}

// Middleware pour gérer les CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

// Gestionnaire principal des requêtes
export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Gestion des connexions WebSocket
    if (path === '/api/ws') {
      const id = env.TREES_WEBSOCKET.idFromName('TREES_SINGLETON');
      const wsObject = env.TREES_WEBSOCKET.get(id);
      return wsObject.fetch(request);
    }

    try {
      // Routes pour les sapins
      if (path.startsWith('/api/trees')) {
        if (request.method === 'GET') {
          const trees = await env.DB.prepare(
            `SELECT t.*, c.name as customer_name, c.phone as customer_phone 
             FROM christmas_trees t 
             JOIN customers c ON t.customer_id = c.id 
             ORDER BY t.updated_at DESC`
          ).all();
          return Response.json(trees, { headers: corsHeaders });
        }

        if (request.method === 'PUT' && path.includes('/status')) {
          const treeId = path.split('/')[3];
          const { pickup_status, pickup_date, pickup_notes } = await request.json();
          
          // Mise à jour dans la base de données
          await env.DB.prepare(
            `UPDATE christmas_trees 
             SET pickup_status = ?, pickup_date = ?, pickup_notes = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`
          )
          .bind(pickup_status, pickup_date, pickup_notes, treeId)
          .run();

          // Notifier tous les clients connectés via WebSocket
          const id = env.TREES_WEBSOCKET.idFromName('TREES_SINGLETON');
          const wsObject = env.TREES_WEBSOCKET.get(id);
          await wsObject.fetch(new Request('http://internal/', {
            method: 'POST',
            body: JSON.stringify({
              type: 'UPDATE',
              treeId,
              pickup_status,
              pickup_date,
              pickup_notes
            })
          }));

          return Response.json({ success: true, id: treeId }, { headers: corsHeaders });
        }
      }

      // Route pour les créneaux de récupération
      if (path.startsWith('/api/pickup-slots')) {
        if (request.method === 'POST') {
          const { tree_id, scheduled_date, time_slot } = await request.json();
          
          const result = await env.DB.prepare(
            `INSERT INTO pickup_slots (tree_id, scheduled_date, time_slot) 
             VALUES (?, ?, ?)`
          )
          .bind(tree_id, scheduled_date, time_slot)
          .run();

          return Response.json({ success: true, id: result.lastRowId }, { headers: corsHeaders });
        }
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return Response.json({ error: error.message }, { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },
};
