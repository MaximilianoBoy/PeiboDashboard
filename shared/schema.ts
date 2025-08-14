import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardNumber: varchar("card_number", { length: 19 }).notNull().unique(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  clientId: varchar("client_id").notNull(),
  channel: varchar("channel", { length: 50 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentNumber: varchar("incident_number", { length: 20 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  clientId: varchar("client_id").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemType: varchar("item_type", { length: 50 }).notNull(),
  itemName: text("item_name").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minimumStock: integer("minimum_stock").notNull().default(0),
  maxStock: integer("max_stock").notNull().default(0),
  unit: varchar("unit", { length: 20 }).notNull().default("units"),
  location: varchar("location", { length: 100 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  contactEmail: text("contact_email"),
  contactPhone: varchar("contact_phone", { length: 20 }),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cardTransactions = pgTable("card_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCardSchema = createInsertSchema(cards).omit({ id: true, createdAt: true, updatedAt: true });
export const insertIncidentSchema = createInsertSchema(incidents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true, lastUpdated: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });

export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type CardTransaction = typeof cardTransactions.$inferSelect;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
