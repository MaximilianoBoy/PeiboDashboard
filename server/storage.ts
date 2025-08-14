import { type User, type InsertUser, type Card, type InsertCard, type Incident, type InsertIncident, type InventoryItem, type InsertInventoryItem, type Client, type InsertClient } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, Card>;
  private incidents: Map<string, Incident>;
  private inventory: Map<string, InventoryItem>;
  private clients: Map<string, Client>;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.incidents = new Map();
    this.inventory = new Map();
    this.clients = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed clients
    const clientsData = [
      { id: "1", name: "BBVA", code: "BBVA", contactEmail: "contact@bbva.com", contactPhone: "+1234567890", isActive: 1, createdAt: new Date() },
      { id: "2", name: "Santander", code: "SANT", contactEmail: "contact@santander.com", contactPhone: "+1234567891", isActive: 1, createdAt: new Date() },
      { id: "3", name: "Banco Nación", code: "BNA", contactEmail: "contact@bna.gov.ar", contactPhone: "+1234567892", isActive: 1, createdAt: new Date() }
    ];
    clientsData.forEach(client => this.clients.set(client.id, client));

    // Seed inventory items
    const inventoryData = [
      { id: "1", itemType: "cards", itemName: "Tarjetas Plásticas", currentStock: 2450, minimumStock: 5000, maxStock: 50000, unit: "units", location: "Warehouse A", lastUpdated: new Date() },
      { id: "2", itemType: "chips", itemName: "Chips de Seguridad", currentStock: 7800, minimumStock: 10000, maxStock: 100000, unit: "units", location: "Warehouse B", lastUpdated: new Date() },
      { id: "3", itemType: "envelopes", itemName: "Sobres de Envío", currentStock: 15600, minimumStock: 8000, maxStock: 80000, unit: "units", location: "Warehouse C", lastUpdated: new Date() }
    ];
    inventoryData.forEach(item => this.inventory.set(item.id, item));

    // Seed cards
    const now = new Date();
    const cardsData = [
      { id: "1", cardNumber: "1234-5678-9012-3456", status: "active", clientId: "1", channel: "branch", type: "credit", issuedAt: now, deliveredAt: now, createdAt: now, updatedAt: now },
      { id: "2", cardNumber: "2345-6789-0123-4567", status: "blocked", clientId: "2", channel: "digital", type: "debit", issuedAt: now, deliveredAt: null, createdAt: now, updatedAt: now },
      { id: "3", cardNumber: "3456-7890-1234-5678", status: "delivered", clientId: "3", channel: "call_center", type: "credit", issuedAt: now, deliveredAt: now, createdAt: now, updatedAt: now },
      { id: "4", cardNumber: "4567-8901-2345-6789", status: "transit", clientId: "1", channel: "branch", type: "debit", issuedAt: now, deliveredAt: null, createdAt: now, updatedAt: now }
    ];
    cardsData.forEach(card => this.cards.set(card.id, card));

    // Seed incidents
    const incidentsData = [
      { 
        id: "1", 
        incidentNumber: "INC-001", 
        title: "Tarjeta bloqueada por error del sistema", 
        description: "Sistema automático bloqueó tarjeta sin motivo válido",
        clientId: "1", 
        status: "in_progress", 
        priority: "high", 
        assignedTo: "admin", 
        createdAt: new Date("2024-11-14"), 
        updatedAt: new Date("2024-11-14"), 
        resolvedAt: null 
      },
      { 
        id: "2", 
        incidentNumber: "INC-002", 
        title: "Demora en entrega de tarjetas", 
        description: "Retraso en el proceso de entrega a domicilio",
        clientId: "2", 
        status: "resolved", 
        priority: "medium", 
        assignedTo: "admin", 
        createdAt: new Date("2024-11-12"), 
        updatedAt: new Date("2024-11-13"), 
        resolvedAt: new Date("2024-11-13") 
      },
      { 
        id: "3", 
        incidentNumber: "INC-003", 
        title: "Problema de activación automática", 
        description: "Falla en el sistema de activación automática de tarjetas",
        clientId: "3", 
        status: "new", 
        priority: "low", 
        assignedTo: null, 
        createdAt: new Date("2024-11-15"), 
        updatedAt: new Date("2024-11-15"), 
        resolvedAt: null 
      }
    ];
    incidentsData.forEach(incident => this.incidents.set(incident.id, incident));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCards(filters?: { status?: string; clientId?: string; channel?: string }): Promise<Card[]> {
    let cards = Array.from(this.cards.values());
    
    if (filters?.status) {
      cards = cards.filter(card => card.status === filters.status);
    }
    if (filters?.clientId) {
      cards = cards.filter(card => card.clientId === filters.clientId);
    }
    if (filters?.channel) {
      cards = cards.filter(card => card.channel === filters.channel);
    }
    
    return cards;
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const now = new Date();
    const card: Card = { 
      ...insertCard,
      id, 
      status: insertCard.status || 'active',
      createdAt: now, 
      updatedAt: now 
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, cardUpdate: Partial<Card>): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard = { ...card, ...cardUpdate, updatedAt: new Date() };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async getCardStats(): Promise<{ active: number; blocked: number; delivered: number; transit: number }> {
    const cards = Array.from(this.cards.values());
    return {
      active: cards.filter(card => card.status === "active").length,
      blocked: cards.filter(card => card.status === "blocked").length,
      delivered: cards.filter(card => card.status === "delivered").length,
      transit: cards.filter(card => card.status === "transit").length
    };
  }

  async getIncidents(filters?: { status?: string; clientId?: string; priority?: string }): Promise<Incident[]> {
    let incidents = Array.from(this.incidents.values());
    
    if (filters?.status) {
      incidents = incidents.filter(incident => incident.status === filters.status);
    }
    if (filters?.clientId) {
      incidents = incidents.filter(incident => incident.clientId === filters.clientId);
    }
    if (filters?.priority) {
      incidents = incidents.filter(incident => incident.priority === filters.priority);
    }
    
    return incidents.sort((a, b) => {
      const aTime = a.createdAt ? a.createdAt.getTime() : 0;
      const bTime = b.createdAt ? b.createdAt.getTime() : 0;
      return bTime - aTime;
    });
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = randomUUID();
    const now = new Date();
    const incidentNumber = `INC-${String(this.incidents.size + 1).padStart(3, '0')}`;
    const incident: Incident = { 
      ...insertIncident,
      id, 
      incidentNumber,
      status: insertIncident.status || 'new',
      priority: insertIncident.priority || 'medium',
      assignedTo: insertIncident.assignedTo || null,
      resolvedAt: insertIncident.resolvedAt || null,
      createdAt: now, 
      updatedAt: now 
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: string, incidentUpdate: Partial<Incident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident = { ...incident, ...incidentUpdate, updatedAt: new Date() };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = { 
      ...insertItem,
      id, 
      location: insertItem.location || null,
      lastUpdated: new Date() 
    };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryItem(id: string, itemUpdate: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemUpdate, lastUpdated: new Date() };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(client => client.isActive === 1);
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = { 
      ...insertClient,
      id,
      contactEmail: insertClient.contactEmail || null,
      contactPhone: insertClient.contactPhone || null,
      isActive: insertClient.isActive || 1,
      createdAt: new Date() 
    };
    this.clients.set(id, client);
    return client;
  }
}

export const storage = new MemStorage();
