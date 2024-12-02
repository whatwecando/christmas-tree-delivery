import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { User, UserRole } from '../types';
import { hashPassword, verifyPassword } from '../utils/auth';

const router = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.nativeEnum(UserRole)
});

router.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  const userJson = await c.env.USERS.get(`user:${email}`);
  if (!userJson) {
    return c.json({ error: 'Identifiants invalides' }, 401);
  }

  const user = JSON.parse(userJson) as User;
  const isValid = await verifyPassword(password, user.passwordHash);
  
  if (!isValid) {
    return c.json({ error: 'Identifiants invalides' }, 401);
  }

  const token = await sign({ sub: user.id }, c.env.JWT_SECRET);
  
  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

router.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, name, role } = c.req.valid('json');

  // Vérifier si l'utilisateur existe déjà
  const existing = await c.env.USERS.get(`user:${email}`);
  if (existing) {
    return c.json({ error: 'Cet email est déjà utilisé' }, 400);
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  
  const user: User = {
    id,
    email,
    name,
    passwordHash,
    role,
    createdAt: Date.now()
  };

  await c.env.USERS.put(`user:${email}`, JSON.stringify(user));
  await c.env.USERS.put(id, JSON.stringify(user));

  const token = await sign({ sub: id }, c.env.JWT_SECRET);
  
  return c.json({
    token,
    user: {
      id,
      email,
      name,
      role
    }
  });
});

export default router;
