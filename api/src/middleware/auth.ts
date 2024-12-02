import { Context } from 'hono';
import { verify } from 'hono/jwt';
import { User, UserRole } from '../types';

declare global {
  interface Env {
    USERS: KVNamespace;
    JWT_SECRET: string;
  }
}

export interface AuthContext {
  user: User;
}

export const authMiddleware = async (c: Context, next: Function) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return c.json({ error: 'Non authentifié' }, 401);
    }

    const payload = await verify(token, c.env.JWT_SECRET);
    const userJson = await c.env.USERS.get(payload.sub);
    
    if (!userJson) {
      return c.json({ error: 'Utilisateur non trouvé' }, 401);
    }

    const user = JSON.parse(userJson) as User;
    c.set('user', user);
    
    await next();
  } catch (e) {
    return c.json({ error: 'Token invalide' }, 401);
  }
};

export const requireRole = (roles: UserRole[]) => {
  return async (c: Context, next: Function) => {
    const user = c.get('user') as User;
    
    if (!roles.includes(user.role)) {
      return c.json({ error: 'Accès non autorisé' }, 403);
    }
    
    await next();
  };
};
