import { createClient } from "@libsql/client";

async function seed() {
  // Ensure we have correct environment variables, even though it's a script
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.warn("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.");
  }

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db", // Fallback for local testing if needed
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    console.log("Creating allowed_users table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS allowed_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Seeding initial admin users...");
    const emailsToSeed = ["insung4616@gmail.com", "kts123@kookmin.ac.kr"];
    
    for (const email of emailsToSeed) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO allowed_users (email) VALUES (?)",
        args: [email],
      });
      console.log(`${email} added to allowed_users.`);
    }

    console.log("Seed complete!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
