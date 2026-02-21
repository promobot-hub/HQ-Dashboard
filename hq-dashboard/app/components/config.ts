// Clawbot API base: prefer env, fallback to localhost during local dev
export const CLAWBOT_API_BASE =
  process.env.NEXT_PUBLIC_CLAWBOT_API_BASE || "http://localhost:8000";
