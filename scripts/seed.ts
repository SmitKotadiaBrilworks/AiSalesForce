// Database seeding script - Run with: npm run seed
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

// Load environment variables
config({ path: ".env.local" });

if (!process.env.NEXT_PUBLIC_MONGO_URL) {
  console.error("Error: NEXT_PUBLIC_MONGO_URL is not defined in .env.local");
  process.exit(1);
}

const uri = process.env.NEXT_PUBLIC_MONGO_URL;
const dbName = uri.split("/").pop()?.split("?")[0] || "ai_sales_force";

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Create collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("tenants")) {
      await db.createCollection("tenants");
    }
    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
    }
    if (!collectionNames.includes("leads")) {
      await db.createCollection("leads");
    }
    if (!collectionNames.includes("messages")) {
      await db.createCollection("messages");
    }

    console.log("Collections created");

    // Create a sample tenant
    const tenantId = new ObjectId("000000000000000000000000");
    await db.collection("tenants").deleteMany({}); // Clear existing
    await db.collection("tenants").insertOne({
      _id: tenantId,
      name: "Demo Company",
      logo_url: null,
      created_at: new Date(),
      ai_config: {
        tone: "professional",
        services: ["web development", "mobile apps", "consulting"],
        faqs: [],
      },
    });

    console.log("Sample tenant created");

    // Create sample leads
    await db.collection("leads").deleteMany({}); // Clear existing

    const leadStatuses = ["new", "open", "in_progress", "closed", "archived"];
    const leadNames = [
      "John Doe",
      "Jane Smith",
      "Bob Johnson",
      "Alice Williams",
      "Mike Brown",
      "Sarah Davis",
      "Tom Wilson",
      "Emily Jones",
      "David Miller",
      "Lisa Anderson",
    ];

    const leads = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const createdAt = new Date(now);
      createdAt.setDate(now.getDate() - daysAgo);

      const lead = {
        _id: new ObjectId(),
        tenant_id: tenantId,
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        source: "website",
        visitor_id: null,
        name: leadNames[i % leadNames.length],
        email: `lead${i + 1}@example.com`,
        phone: `+1-555-${String(i).padStart(4, "0")}`,
        summary: `Interested in ${
          ["web development", "mobile app", "consulting", "UI/UX design"][
            Math.floor(Math.random() * 4)
          ]
        } services. Budget range: $${
          [5000, 10000, 15000, 25000][Math.floor(Math.random() * 4)]
        }. Looking to start within ${
          ["1 month", "2 months", "3 months", "ASAP"][
            Math.floor(Math.random() * 4)
          ]
        }.`,
        ai_analysis: {
          service_type: ["web development", "mobile app", "consulting"][
            Math.floor(Math.random() * 3)
          ],
          budget: [5000, 10000, 15000, 25000][Math.floor(Math.random() * 4)],
          timeline: ["1 month", "2 months", "3 months"][
            Math.floor(Math.random() * 3)
          ],
          priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
        },
        created_at: createdAt,
        updated_at: createdAt,
      };

      leads.push(lead);
    }

    await db.collection("leads").insertMany(leads);
    console.log(`Created ${leads.length} sample leads`);

    // Create sample messages
    await db.collection("messages").deleteMany({}); // Clear existing

    const messages = [];
    for (let i = 0; i < 15; i++) {
      const lead = leads[i % leads.length];
      const daysAgo = Math.floor(Math.random() * 7);
      const createdAt = new Date(now);
      createdAt.setDate(now.getDate() - daysAgo);

      // Lead message
      messages.push({
        _id: new ObjectId(),
        lead_id: lead._id,
        sender_type: "lead",
        sender_id: null,
        content: `Hi, I'm interested in your ${lead.ai_analysis.service_type} services. Can we discuss?`,
        created_at: createdAt,
        read_at: new Date(createdAt.getTime() + 1000 * 60 * 5), // Read 5 minutes later
      });

      // AI/User response
      const responseTime = new Date(createdAt.getTime() + 1000 * 60 * 10); // 10 minutes later
      messages.push({
        _id: new ObjectId(),
        lead_id: lead._id,
        sender_type: Math.random() > 0.5 ? "ai" : "user",
        sender_id: null,
        content: `Thank you for your interest! We'd be happy to discuss your ${lead.ai_analysis.service_type} project. Let's schedule a call.`,
        created_at: responseTime,
        read_at: null,
      });
    }

    await db.collection("messages").insertMany(messages);
    console.log(`Created ${messages.length} sample messages`);

    console.log("\n✅ Database seeded successfully!");
    console.log(`Tenant ID: ${tenantId.toString()}`);
    console.log(`Total Leads: ${leads.length}`);
    console.log(`Total Messages: ${messages.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("\nDisconnected from MongoDB");
  }
}

seed();
