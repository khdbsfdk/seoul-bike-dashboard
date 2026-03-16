const { createClient } = require("@libsql/client");
const path = require("path");
const fs = require("fs");

// Read from .env.local if exists, or just process.env
// In local node script, we might not have Next.js env loading automatically,
// so a simple fallback or executing via tsx is better.
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function migrate() {
  console.log("Using local database 'local.db' to bypass expired remote credentials...");
  const db = createClient({
    url: "file:local.db",
  });

  try {
    console.log("Creating users table for OAuth...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating guestbook table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        user_name TEXT,
        user_image TEXT,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_email) REFERENCES users(email)
      )
    `);

    console.log("Migration complete! 'users' and 'guestbook' tables are ready.");
  } catch (error) {
    console.error("Error during migration:", error);
  }
}

migrate();
