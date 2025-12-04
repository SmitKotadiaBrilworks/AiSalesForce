/**
 * Database Setup Script
 * Run this script to initialize MongoDB collections and indexes
 *
 * Usage:
 *   - npm run setup-db
 *   - Or import and call initializeDatabase() from your code
 */

import { initializeDatabase } from "../lib/database.schema";

async function main() {
  try {
    console.log("🚀 Setting up database schema...");
    await initializeDatabase();
    console.log("✅ Database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

// Only run if executed directly
if (require.main === module) {
  main();
}

export { main as setupDatabase };
