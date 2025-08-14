import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema, insertIncidentSchema, insertInventorySchema, insertClientSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cards routes
  app.get("/api/cards", async (req, res) => {
    try {
      const { status, clientId, channel } = req.query;
      const cards = await storage.getCards({
        status: status as string,
        clientId: clientId as string,
        channel: channel as string
      });
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  app.get("/api/cards/stats", async (req, res) => {
    try {
      const stats = await storage.getCardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch card stats" });
    }
  });

  app.get("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch card" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(validatedData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid card data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create card" });
    }
  });

  app.patch("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.updateCard(req.params.id, req.body);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to update card" });
    }
  });

  // Incidents routes
  app.get("/api/incidents", async (req, res) => {
    try {
      const { status, clientId, priority } = req.query;
      const incidents = await storage.getIncidents({
        status: status as string,
        clientId: clientId as string,
        priority: priority as string
      });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  app.get("/api/incidents/:id", async (req, res) => {
    try {
      const incident = await storage.getIncident(req.params.id);
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch incident" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const validatedData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(validatedData);
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid incident data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create incident" });
    }
  });

  app.patch("/api/incidents/:id", async (req, res) => {
    try {
      const incident = await storage.updateIncident(req.params.id, req.body);
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ error: "Failed to update incident" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid inventory data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Export routes
  app.get("/api/export/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      const csv = convertToCSV(cards, ['cardNumber', 'status', 'clientId', 'channel', 'type', 'issuedAt', 'deliveredAt']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=cards_export.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export cards" });
    }
  });

  app.get("/api/export/incidents", async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      const csv = convertToCSV(incidents, ['incidentNumber', 'title', 'description', 'clientId', 'status', 'priority', 'createdAt']);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=incidents_export.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export incidents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function convertToCSV(data: any[], columns: string[]): string {
  const headers = columns.join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col];
      if (value instanceof Date) {
        return value.toISOString();
      }
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value || '';
    }).join(',')
  );
  return [headers, ...rows].join('\n');
}
