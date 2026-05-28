import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vendors, uids, admins } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Vendor queries
export async function getVendorByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vendors).where(eq(vendors.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllVendors() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vendors);
}

export async function createVendor(username: string, passwordHash: string, uidLimit: number = 10) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(vendors).values({
    username,
    passwordHash,
    uidLimit,
  });
}

export async function updateVendor(vendorId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(vendors).set(updates).where(eq(vendors.id, vendorId));
}

export async function deleteVendor(vendorId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(vendors).where(eq(vendors.id, vendorId));
}

// UID queries
export async function getVendorUIDs(vendorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(uids).where(eq(uids.vendorId, vendorId));
}

export async function createUID(vendorId: number, accountId: string, durationDays: number, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.insert(uids).values({
    vendorId,
    accountId,
    durationDays,
    expiresAt,
  });
}

export async function updateUID(uidId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(uids).set(updates).where(eq(uids.id, uidId));
}

// Admin queries
export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
