import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Vendors table for storing vendor accounts
 */
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  uidLimit: int("uid_limit").default(10).notNull(),
  usedUids: int("used_uids").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

/**
 * UIDs table for storing registered UIDs
 */
export const uids = mysqlTable("uids", {
  id: int("id").autoincrement().primaryKey(),
  vendorId: int("vendor_id").notNull(),
  accountId: varchar("account_id", { length: 64 }).notNull(),
  durationDays: int("duration_days").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: mysqlEnum("status", ["ativo", "expirado"]).default("ativo").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UID = typeof uids.$inferSelect;
export type InsertUID = typeof uids.$inferInsert;

/**
 * Admin table for storing admin credentials
 */
export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;