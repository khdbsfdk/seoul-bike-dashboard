import { createClient } from "@libsql/client";

export const db = createClient({
  url: "file:local.db", // Force local DB for dev since remote token expired
});
