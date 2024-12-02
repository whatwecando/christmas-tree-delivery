import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';

const app = new Hono();

// Middleware CORS
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-production-domain.com'],
  credentials: true
}));

// Routes
app.route('/auth', authRoutes);
app.route('/orders', orderRoutes);

// Route de santé
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
