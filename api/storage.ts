import { db } from "./db";
import { sites, type InsertSite, type Site } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSite(site: InsertSite): Promise<Site>;
  updateSite(id: number, updates: Partial<Site>): Promise<Site>;
  getSite(id: number): Promise<Site | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createSite(insertSite: InsertSite): Promise<Site> {
    const [site] = await db.insert(sites).values(insertSite).returning();
    return site;
  }

  async updateSite(id: number, updates: Partial<Site>): Promise<Site> {
    const [site] = await db
      .update(sites)
      .set(updates)
      .where(eq(sites.id, id))
      .returning();
    return site;
  }

  async getSite(id: number): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.id, id));
    return site;
  }
}

export const storage = new DatabaseStorage();
