import { 
  users, cards, incidents, inventory, clients, sessions,
  type User, type InsertUser, type Card, type InsertCard, 
  type Incident, type InsertIncident, type InventoryItem, 
  type InsertInventoryItem, type Client, type InsertClient,
  type Session, type InsertSession
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sessions
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;

  // Cards
  getCards(filters?: { status?: string; clientId?: string; channel?: string }): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, card: Partial<Card>): Promise<Card | undefined>;
  getCardStats(): Promise<{ active: number; blocked: number; delivered: number; transit: number }>;

  // Incidents
  getIncidents(filters?: { status?: string; clientId?: string; priority?: string }): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: string, incident: Partial<Incident>): Promise<Incident | undefined>;

  // Inventory
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem | undefined>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Database storage doesn't need initialization like in-memory storage
  }

  // Users methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Sessions methods
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.token, token));
    return session || undefined;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  // Cards methods
  async getCards(filters?: { status?: string; clientId?: string; channel?: string }): Promise<Card[]> {
    let query = db.select().from(cards);
    
    if (filters?.status || filters?.clientId || filters?.channel) {
      query = query.where(
        filters?.status ? eq(cards.status, filters.status) : undefined
      );
      // Add more filters as needed
    }
    
    return await query;
  }

  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card || undefined;
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db
      .insert(cards)
      .values({
        ...insertCard,
        status: insertCard.status || 'active'
      })
      .returning();
    return card;
  }

  async updateCard(id: string, cardUpdate: Partial<Card>): Promise<Card | undefined> {
    const [card] = await db
      .update(cards)
      .set({ ...cardUpdate, updatedAt: new Date() })
      .where(eq(cards.id, id))
      .returning();
    return card || undefined;
  }

  async getCardStats(): Promise<{ active: number; blocked: number; delivered: number; transit: number }> {
    const allCards = await db.select().from(cards);
    return {
      active: allCards.filter(card => card.status === "active").length,
      blocked: allCards.filter(card => card.status === "blocked").length,
      delivered: allCards.filter(card => card.status === "delivered").length,
      transit: allCards.filter(card => card.status === "transit").length
    };
  }

  // Incidents methods
  async getIncidents(filters?: { status?: string; clientId?: string; priority?: string }): Promise<Incident[]> {
    const allIncidents = await db.select().from(incidents);
    
    let filteredIncidents = allIncidents;
    if (filters?.status) {
      filteredIncidents = filteredIncidents.filter(incident => incident.status === filters.status);
    }
    if (filters?.clientId) {
      filteredIncidents = filteredIncidents.filter(incident => incident.clientId === filters.clientId);
    }
    if (filters?.priority) {
      filteredIncidents = filteredIncidents.filter(incident => incident.priority === filters.priority);
    }
    
    return filteredIncidents.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident || undefined;
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const allIncidents = await db.select().from(incidents);
    const incidentNumber = `INC-${String(allIncidents.length + 1).padStart(3, '0')}`;
    
    const [incident] = await db
      .insert(incidents)
      .values({
        ...insertIncident,
        incidentNumber,
        status: insertIncident.status || 'new',
        priority: insertIncident.priority || 'medium',
        assignedTo: insertIncident.assignedTo || null,
        resolvedAt: insertIncident.resolvedAt || null
      })
      .returning();
    return incident;
  }

  async updateIncident(id: string, incidentUpdate: Partial<Incident>): Promise<Incident | undefined> {
    const [incident] = await db
      .update(incidents)
      .set({ ...incidentUpdate, updatedAt: new Date() })
      .where(eq(incidents.id, id))
      .returning();
    return incident || undefined;
  }

  // Inventory methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventory);
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, id));
    return item || undefined;
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db
      .insert(inventory)
      .values({
        ...insertItem,
        location: insertItem.location || null
      })
      .returning();
    return item;
  }

  async updateInventoryItem(id: string, itemUpdate: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const [item] = await db
      .update(inventory)
      .set({ ...itemUpdate, lastUpdated: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return item || undefined;
  }

  // Clients methods
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.isActive, 1));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values({
        ...insertClient,
        contactEmail: insertClient.contactEmail || null,
        contactPhone: insertClient.contactPhone || null,
        isActive: insertClient.isActive || 1
      })
      .returning();
    return client;
  }
}

export const storage = new DatabaseStorage();
