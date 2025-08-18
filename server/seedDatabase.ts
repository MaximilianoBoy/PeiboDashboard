import { db } from "./db";
import { clients, inventory, cards, incidents } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingClients = await db.select().from(clients);
    if (existingClients.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Seed clients
    const clientsData = [
      { 
        id: "1", 
        name: "BBVA", 
        code: "BBVA", 
        contactEmail: "contact@bbva.com", 
        contactPhone: "+1234567890", 
        isActive: 1, 
        createdAt: new Date() 
      },
      { 
        id: "2", 
        name: "Santander", 
        code: "SANT", 
        contactEmail: "contact@santander.com", 
        contactPhone: "+1234567891", 
        isActive: 1, 
        createdAt: new Date() 
      },
      { 
        id: "3", 
        name: "Banco Nación", 
        code: "BNA", 
        contactEmail: "contact@bna.gov.ar", 
        contactPhone: "+1234567892", 
        isActive: 1, 
        createdAt: new Date() 
      }
    ];

    await db.insert(clients).values(clientsData);

    // Seed inventory items
    const inventoryData = [
      { 
        id: "1", 
        itemType: "cards", 
        itemName: "Tarjetas Plásticas", 
        currentStock: 2450, 
        minimumStock: 5000, 
        maxStock: 50000, 
        unit: "units", 
        location: "Warehouse A", 
        lastUpdated: new Date() 
      },
      { 
        id: "2", 
        itemType: "chips", 
        itemName: "Chips de Seguridad", 
        currentStock: 7800, 
        minimumStock: 10000, 
        maxStock: 100000, 
        unit: "units", 
        location: "Warehouse B", 
        lastUpdated: new Date() 
      },
      { 
        id: "3", 
        itemType: "envelopes", 
        itemName: "Sobres de Envío", 
        currentStock: 15600, 
        minimumStock: 8000, 
        maxStock: 80000, 
        unit: "units", 
        location: "Warehouse C", 
        lastUpdated: new Date() 
      }
    ];

    await db.insert(inventory).values(inventoryData);

    // Seed cards
    const now = new Date();
    const cardsData = [
      { 
        id: "1", 
        cardNumber: "1234-5678-9012-3456", 
        status: "active", 
        clientId: "1", 
        channel: "branch", 
        type: "credit", 
        issuedAt: now, 
        deliveredAt: now, 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: "2", 
        cardNumber: "2345-6789-0123-4567", 
        status: "blocked", 
        clientId: "2", 
        channel: "digital", 
        type: "debit", 
        issuedAt: now, 
        deliveredAt: null, 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: "3", 
        cardNumber: "3456-7890-1234-5678", 
        status: "delivered", 
        clientId: "3", 
        channel: "call_center", 
        type: "credit", 
        issuedAt: now, 
        deliveredAt: now, 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        id: "4", 
        cardNumber: "4567-8901-2345-6789", 
        status: "transit", 
        clientId: "1", 
        channel: "branch", 
        type: "debit", 
        issuedAt: now, 
        deliveredAt: null, 
        createdAt: now, 
        updatedAt: now 
      }
    ];

    await db.insert(cards).values(cardsData);

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

    await db.insert(incidents).values(incidentsData);

    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}