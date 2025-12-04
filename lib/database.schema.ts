import { Db } from "mongodb";
import { COLLECTIONS } from "./database.types";

/**
 * MongoDB Schema Setup
 * Creates indexes for better query performance
 * Run this function once to set up the database schema
 */
export async function setupDatabaseSchema(db: Db) {
  try {
    // ============================================
    // Tenants Collection
    // ============================================
    const tenantsCollection = db.collection(COLLECTIONS.TENANTS);

    await tenantsCollection.createIndexes([
      { key: { name: 1 }, name: "idx_tenants_name" },
      { key: { created_at: -1 }, name: "idx_tenants_created_at" },
    ]);

    // ============================================
    // Users Collection
    // ============================================
    const usersCollection = db.collection(COLLECTIONS.USERS);

    await usersCollection.createIndexes([
      { key: { email: 1 }, unique: true, name: "idx_users_email_unique" },
      { key: { tenant_id: 1 }, name: "idx_users_tenant_id" },
      { key: { role: 1 }, name: "idx_users_role" },
      { key: { created_at: -1 }, name: "idx_users_created_at" },
      // Compound index for tenant + email lookups
      { key: { tenant_id: 1, email: 1 }, name: "idx_users_tenant_email" },
    ]);

    // ============================================
    // Leads Collection
    // ============================================
    const leadsCollection = db.collection(COLLECTIONS.LEADS);

    await leadsCollection.createIndexes([
      { key: { tenant_id: 1 }, name: "idx_leads_tenant_id" },
      { key: { status: 1 }, name: "idx_leads_status" },
      { key: { source: 1 }, name: "idx_leads_source" },
      { key: { email: 1 }, name: "idx_leads_email" },
      { key: { visitor_id: 1 }, name: "idx_leads_visitor_id" },
      { key: { created_at: -1 }, name: "idx_leads_created_at" },
      { key: { updated_at: -1 }, name: "idx_leads_updated_at" },
      // Compound indexes for common queries
      { key: { tenant_id: 1, status: 1 }, name: "idx_leads_tenant_status" },
      {
        key: { tenant_id: 1, created_at: -1 },
        name: "idx_leads_tenant_created",
      },
      { key: { tenant_id: 1, email: 1 }, name: "idx_leads_tenant_email" },
    ]);

    // ============================================
    // Messages Collection
    // ============================================
    const messagesCollection = db.collection(COLLECTIONS.MESSAGES);

    await messagesCollection.createIndexes([
      { key: { lead_id: 1 }, name: "idx_messages_lead_id" },
      { key: { sender_type: 1 }, name: "idx_messages_sender_type" },
      { key: { sender_id: 1 }, name: "idx_messages_sender_id" },
      { key: { created_at: -1 }, name: "idx_messages_created_at" },
      { key: { read_at: 1 }, name: "idx_messages_read_at" },
      // Compound index for lead messages ordered by time
      {
        key: { lead_id: 1, created_at: -1 },
        name: "idx_messages_lead_created",
      },
      // Compound index for unread messages
      { key: { lead_id: 1, read_at: 1 }, name: "idx_messages_lead_read" },
    ]);

    console.log("✅ Database schema indexes created successfully");
    return true;
  } catch (error) {
    console.error("❌ Error setting up database schema:", error);
    throw error;
  }
}

/**
 * Initialize database schema (call this on app startup or manually)
 */
export async function initializeDatabase() {
  const { getDatabase } = await import("./mongodb");
  const db = await getDatabase();
  await setupDatabaseSchema(db);
}
