// @ts-nocheck
// Drizzle CLI config — no drizzle-kit import to keep Next.js build green
const cfg = {
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_URL || "postgres://user:pass@host:5432/dbname",
  },
};
export default cfg;
