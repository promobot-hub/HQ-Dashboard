// Drizzle ORM schema (prep only; not live yet)
import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("pending"), // pending|progress|done
  priority: text("priority").notNull().default("medium"), // high|medium|low
  labels: jsonb("labels").$type<string[] | null>().default(null),
  url: text("url"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const schedulerJobs = pgTable("scheduler_jobs", {
  id: text("id").primaryKey(),
  spec: jsonb("spec").$type<Record<string, any>>().notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const schedulerHistory = pgTable("scheduler_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: text("job_id").notNull(),
  ts: timestamp("ts", { withTimezone: true }).defaultNow(),
  ok: boolean("ok").notNull().default(true),
  meta: jsonb("meta").$type<Record<string, any> | null>().default(null),
});

export const logs = pgTable("logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  ts: timestamp("ts", { withTimezone: true }).defaultNow(),
  kind: text("kind").notNull(),
  level: text("level").notNull(),
  msg: text("msg").notNull(),
  meta: jsonb("meta").$type<Record<string, any> | null>().default(null),
  taskId: text("task_id"),
});

export const metrics = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  ts: timestamp("ts", { withTimezone: true }).defaultNow(),
  key: text("key").notNull(),
  value: numeric("value"),
  labels: jsonb("labels").$type<Record<string, any> | null>().default(null),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  meta: jsonb("meta").$type<Record<string, any> | null>().default(null),
  lastMessageAt: timestamp("last_message_at", {
    withTimezone: true,
  }).defaultNow(),
  counters: jsonb("counters").$type<Record<string, any> | null>().default(null),
});

export const heartbeat = pgTable("heartbeat", {
  id: integer("id").primaryKey().default(1),
  ts: timestamp("ts", { withTimezone: true }).defaultNow(),
  kpis: jsonb("kpis").$type<Record<string, any> | null>().default(null),
  status: text("status").default("ok"),
});
