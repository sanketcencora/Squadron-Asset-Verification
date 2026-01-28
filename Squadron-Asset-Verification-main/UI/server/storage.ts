
import { users, assets, campaigns, verifications, verificationItems, type User, type InsertUser, type Asset, type InsertAsset, type Campaign, type Verification, type VerificationItem } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assets
  getAssets(filters?: { search?: string, status?: string }): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetsByUserId(userId: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset>;
  deleteAsset(id: number): Promise<void>;
  
  // Campaigns
  getCampaigns(): Promise<Campaign[]>;
  getActiveCampaign(): Promise<Campaign | undefined>;
  createCampaign(campaign: Campaign): Promise<Campaign>; // Seed helper

  // Verifications
  getVerifications(): Promise<(Verification & { user: User })[]>;
  getVerificationByUserId(userId: number, campaignId: number): Promise<Verification | undefined>;
  createVerification(verification: Verification): Promise<Verification>;
  updateVerificationStatus(id: number, status: string): Promise<Verification>;
  
  // Verification Items
  createVerificationItems(items: VerificationItem[]): Promise<VerificationItem[]>;
  getVerificationItems(verificationId: number): Promise<(VerificationItem & { asset?: Asset })[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Assets
  async getAssets(filters?: { search?: string, status?: string }): Promise<Asset[]> {
    let query = db.select().from(assets);
    // Add filters logic if needed, for now return all
    return await query;
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async getAssetsByUserId(userId: number): Promise<Asset[]> {
    return await db.select().from(assets).where(eq(assets.assignedToId, userId));
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    return newAsset;
  }

  async updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset> {
    const [updated] = await db.update(assets).set(asset).where(eq(assets.id, id)).returning();
    return updated;
  }

  async deleteAsset(id: number): Promise<void> {
    await db.delete(assets).where(eq(assets.id, id));
  }

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getActiveCampaign(): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.status, 'Active'));
    return campaign;
  }

  async createCampaign(campaign: Campaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  // Verifications
  async getVerifications(): Promise<(Verification & { user: User })[]> {
    const results = await db.select().from(verifications)
      .innerJoin(users, eq(verifications.userId, users.id));
    
    return results.map(r => ({ ...r.verifications, user: r.users }));
  }

  async getVerificationByUserId(userId: number, campaignId: number): Promise<Verification | undefined> {
    const [verification] = await db.select().from(verifications)
      .where(and(eq(verifications.userId, userId), eq(verifications.campaignId, campaignId)));
    return verification;
  }

  async createVerification(verification: Verification): Promise<Verification> {
    const [newVerification] = await db.insert(verifications).values(verification).returning();
    return newVerification;
  }
  
  async updateVerificationStatus(id: number, status: string): Promise<Verification> {
    const [updated] = await db.update(verifications)
      .set({ status })
      .where(eq(verifications.id, id))
      .returning();
    return updated;
  }

  // Verification Items
  async createVerificationItems(items: VerificationItem[]): Promise<VerificationItem[]> {
    return await db.insert(verificationItems).values(items).returning();
  }

  async getVerificationItems(verificationId: number): Promise<(VerificationItem & { asset?: Asset })[]> {
    const results = await db.select().from(verificationItems)
      .leftJoin(assets, eq(verificationItems.assetId, assets.id))
      .where(eq(verificationItems.verificationId, verificationId));
      
    return results.map(r => ({ ...r.verification_items, asset: r.assets || undefined }));
  }
}

export const storage = new DatabaseStorage();
