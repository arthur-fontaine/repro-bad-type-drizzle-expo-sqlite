import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from "./schema/schema";

const db1File = openDatabaseSync("db-01.db");
export const db1 = drizzle(db1File, { schema });

const db2File = openDatabaseSync("db-02.db");
export const db2 = drizzle(db2File, { schema });
