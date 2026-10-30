import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone"),
  shareToken: uuid("share_token").notNull().unique().defaultRandom(),
});

export const deadlines = pgTable("deadlines", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull().default("license"),
  expiresOn: date("expires_on").notNull(),
});

// Users table reference (from auth.users)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  deadlines: many(deadlines),
  owner: many(users),
}));

export const deadlinesRelations = relations(deadlines, ({ one }) => ({
  company: one(companies, {
    fields: [deadlines.companyId],
    references: [companies.id],
  }),
}));

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Deadline = typeof deadlines.$inferSelect;
export type NewDeadline = typeof deadlines.$inferInsert;
