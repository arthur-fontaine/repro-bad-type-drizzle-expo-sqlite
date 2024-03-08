import type { Config } from "drizzle-kit";

export default {
  driver: "expo",
  out: "./database/migrations1",
  schema: "./database/schema/schema.ts",
} satisfies Config;
