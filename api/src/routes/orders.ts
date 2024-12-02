import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { TreeOrder, DeliveryStatus, UserRole } from '../types';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = new Hono();

router.use('*', authMiddleware);

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    phoneNumber: z.string().regex(/^\d{10}$/),
    email: z.string().email().optional()
  }),
  treeSize: z.number().min(1).max(3),
  requestScoutDelivery: z.boolean(),
  notes: z.string().optional()
});

// Obtenir toutes les commandes
router.get('/', async (c) => {
  const user = c.get('user');
  const list = await c.env.ORDERS.list();
  const orders: TreeOrder[] = [];
  
  for (const key of list.keys) {
    const orderJson = await c.env.ORDERS.get(key.name);
    if (orderJson) {
      const order = JSON.parse(orderJson) as TreeOrder;
      // Les scouts ne voient que les commandes qui leur sont assignées
      if (user.role === UserRole.SCOUT && !order.requestScoutDelivery) {
        continue;
      }
      orders.push(order);
    }
  }
  
  return c.json(orders);
});

// Créer une nouvelle commande
router.post('/', zValidator('json', orderSchema), requireRole([UserRole.ADMIN, UserRole.MANAGER]), async (c) => {
  const data = c.req.valid('json');
  const user = c.get('user');
  
  const order: TreeOrder = {
    id: crypto.randomUUID(),
    ...data,
    colorCode: Math.random().toString(16).substring(2, 8),
    orderDate: new Date().toISOString(),
    deliveryStatus: DeliveryStatus.PENDING,
    history: [{
      timestamp: Date.now(),
      action: 'Commande créée',
      userId: user.id,
      previousStatus: DeliveryStatus.PENDING,
      newStatus: DeliveryStatus.PENDING
    }],
    createdBy: user.id,
    updatedBy: user.id,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await c.env.ORDERS.put(order.id, JSON.stringify(order));
  return c.json(order, 201);
});

// Stream des mises à jour
router.get('/stream', async (c) => {
  const user = c.get('user');
  
  // Création du stream
  const stream = new ReadableStream({
    async start(controller) {
      // Fonction pour envoyer les mises à jour
      const sendUpdate = async () => {
        const list = await c.env.ORDERS.list();
        const orders: TreeOrder[] = [];
        
        for (const key of list.keys) {
          const orderJson = await c.env.ORDERS.get(key.name);
          if (orderJson) {
            const order = JSON.parse(orderJson) as TreeOrder;
            // Filtrer selon le rôle
            if (user.role === UserRole.SCOUT && !order.requestScoutDelivery) {
              continue;
            }
            orders.push(order);
          }
        }
        
        controller.enqueue(`data: ${JSON.stringify(orders)}\n\n`);
      };

      // Envoyer les données initiales
      await sendUpdate();
      
      // Garder la connexion ouverte avec un heartbeat
      const interval = setInterval(() => {
        controller.enqueue('ping: \n\n');
      }, 30000);

      // Nettoyer à la fermeture
      c.req.raw.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});

// Mettre à jour une commande
router.patch('/:id', requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.SCOUT]), async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');
  
  const orderJson = await c.env.ORDERS.get(id);
  if (!orderJson) {
    return c.json({ error: 'Commande non trouvée' }, 404);
  }

  const order = JSON.parse(orderJson) as TreeOrder;
  const updates = await c.req.json();
  
  // Les scouts ne peuvent que changer le statut de livraison
  if (user.role === UserRole.SCOUT) {
    if (!order.requestScoutDelivery) {
      return c.json({ error: 'Non autorisé' }, 403);
    }
    if (Object.keys(updates).length > 1 || !updates.deliveryStatus) {
      return c.json({ error: 'Les scouts ne peuvent que modifier le statut de livraison' }, 403);
    }
  }

  const updatedOrder: TreeOrder = {
    ...order,
    ...updates,
    updatedBy: user.id,
    updatedAt: Date.now(),
    history: [
      ...order.history,
      {
        timestamp: Date.now(),
        action: 'Commande mise à jour',
        userId: user.id,
        previousStatus: order.deliveryStatus,
        newStatus: updates.deliveryStatus || order.deliveryStatus
      }
    ]
  };

  await c.env.ORDERS.put(id, JSON.stringify(updatedOrder));
  return c.json(updatedOrder);
});

// Supprimer une commande
router.delete('/:id', requireRole([UserRole.ADMIN]), async (c) => {
  const id = c.req.param('id');
  await c.env.ORDERS.delete(id);
  return c.json({ success: true });
});

// Import Excel
router.post('/import', requireRole([UserRole.ADMIN, UserRole.MANAGER]), async (c) => {
  const orders = await c.req.json() as Omit<TreeOrder, 'id'>[];
  const user = c.get('user');
  const results = [];

  for (const orderData of orders) {
    const order: TreeOrder = {
      id: crypto.randomUUID(),
      ...orderData,
      history: [{
        timestamp: Date.now(),
        action: 'Commande importée',
        userId: user.id,
        previousStatus: DeliveryStatus.PENDING,
        newStatus: DeliveryStatus.PENDING
      }],
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await c.env.ORDERS.put(order.id, JSON.stringify(order));
    results.push(order);
  }

  return c.json(results, 201);
});

export default router;
