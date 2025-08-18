import { storage } from "./storage";
import crypto from "crypto";

export async function authenticateUser(username: string, password: string): Promise<string | null> {
  try {
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return null;
    }

    // En producción, deberías comparar hash de contraseña
    if (user.password !== password) {
      return null;
    }

    // Crear sesión
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas

    await storage.createSession({
      userId: user.id,
      token,
      expiresAt
    });

    return token;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function validateToken(token: string): Promise<any | null> {
  try {
    const session = await storage.getSessionByToken(token);
    
    if (!session) {
      return null;
    }

    if (new Date() > new Date(session.expiresAt)) {
      // Token expirado
      await storage.deleteSession(token);
      return null;
    }

    const user = await storage.getUser(session.userId);
    return user;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export async function logoutUser(token: string): Promise<void> {
  try {
    await storage.deleteSession(token);
  } catch (error) {
    console.error('Logout error:', error);
  }
}