
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'finance', 'manager', 'employee'
  name: text("name").notNull(),
  department: text("department"),
  avatar: text("avatar"),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  serviceTag: text("service_tag").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Laptop', 'Mobile', 'Monitor'
  model: text("model").notNull(),
  cost: integer("cost").notNull(),
  purchaseDate: timestamp("purchase_date"),
  status: text("status").notNull(), // 'Instock', 'Assigned', 'Retired'
  assignedToId: integer("assigned_to_id"),
  specs: jsonb("specs"), // For extra details
});

export const peripherals = pgTable("peripherals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // 'Charger', 'Headphones', 'Mouse'
  assignedToId: integer("assigned_to_id"),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'Active', 'Completed', 'Draft'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalEmployees: integer("total_employees").default(0),
  verifiedCount: integer("verified_count").default(0),
});

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id"),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // 'Pending', 'Verified', 'Exception', 'Overdue'
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
});

export const verificationItems = pgTable("verification_items", {
  id: serial("id").primaryKey(),
  verificationId: integer("verification_id").notNull(),
  assetId: integer("asset_id"), // Nullable for peripherals
  peripheralName: text("peripheral_name"), // If it's a peripheral
  isPresent: boolean("is_present").notNull(),
  photoUrl: text("photo_url"),
  status: text("status").notNull(), // 'Pending', 'Verified', 'Exception'
});

// === RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
  assets: many(assets),
  verifications: many(verifications),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  assignedTo: one(users, {
    fields: [assets.assignedToId],
    references: [users.id],
  }),
}));

export const verificationsRelations = relations(verifications, ({ one, many }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [verifications.campaignId],
    references: [campaigns.id],
  }),
  items: many(verificationItems),
}));

export const verificationItemsRelations = relations(verificationItems, ({ one }) => ({
  verification: one(verifications, {
    fields: [verificationItems.verificationId],
    references: [verifications.id],
  }),
  asset: one(assets, {
    fields: [verificationItems.assetId],
    references: [assets.id],
  }),
}));

// === SCHEMA EXPORTS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true });
export const insertVerificationSchema = createInsertSchema(verifications).omit({ id: true });
export const insertVerificationItemSchema = createInsertSchema(verificationItems).omit({ id: true });

// === TYPES ===
export type User = typeof users.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type VerificationItem = typeof verificationItems.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;

// API Types
export type LoginRequest = {
  role: 'finance' | 'manager' | 'employee';
  email?: string; // Optional for demo mode
};

export type DashboardStats = {
  totalAssets: number;
  verificationCompleted: number;
  pendingVerifications: number;
  exceptions: number;
};

export type VerificationWithDetails = Verification & {
  user: User;
  items: (VerificationItem & { asset?: Asset })[];
};
