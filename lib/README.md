# Database Schema & Types

This directory contains MongoDB schema definitions and TypeScript types based on the original Supabase schema.

## Files

### `database.types.ts`

TypeScript type definitions for all MongoDB collections:

- `Tenant` - Company/organization data
- `User` - User accounts with authentication
- `Lead` - Sales leads with AI analysis
- `Message` - Messages between users, leads, and AI

### `database.schema.ts`

MongoDB index definitions for optimal query performance. Run `setupDatabaseSchema()` to create indexes.

### `database.helpers.ts`

Type-safe helper functions for common database operations:

- CRUD operations for all collections
- Query helpers with filtering and pagination
- Type-safe ObjectId conversions

## Setup

1. **Initialize the database schema** (creates indexes):

   ```bash
   npm run setup-db
   ```

   Or programmatically:

   ```typescript
   import { initializeDatabase } from "@/lib/database.schema";
   await initializeDatabase();
   ```

## Usage Examples

### Creating a Lead

```typescript
import { getDatabase } from "@/lib/mongodb";
import { createLead } from "@/lib/database.helpers";

const db = await getDatabase();
const lead = await createLead(db, {
  tenant_id: "your-tenant-id",
  name: "John Doe",
  email: "john@example.com",
  status: "new",
});
```

### Querying Leads

```typescript
import { getLeadsByTenant } from "@/lib/database.helpers";

const leads = await getLeadsByTenant(db, tenantId, {
  status: "new",
  limit: 10,
  skip: 0,
});
```

### Creating Messages

```typescript
import { createMessage } from "@/lib/database.helpers";

const message = await createMessage(db, {
  lead_id: leadId,
  sender_type: "ai",
  content: "Hello, how can I help you?",
});
```

## Collections

- `tenants` - Company/organization information
- `users` - User accounts (with hashed passwords)
- `leads` - Sales leads with AI analysis
- `messages` - Conversation messages

## Indexes

The schema automatically creates optimized indexes for:

- Email lookups (unique)
- Tenant-based queries
- Status filtering
- Date-based sorting
- Compound indexes for common query patterns
