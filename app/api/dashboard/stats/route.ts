import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "@/lib/database.types";

interface LeadDocument {
  _id: ObjectId;
  name: string | null;
  email: string | null;
  status: string;
  created_at: Date;
  summary: string | null;
}

interface MessageDocument {
  _id: ObjectId;
  sender_type: string;
  content: string;
  created_at: Date;
  lead_name?: string;
  lead_email?: string | null;
}

interface StatusGroup {
  _id: string;
  count: number;
}

interface TimeGroup {
  _id: string;
  count: number;
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    // For MVP, we'll use a hardcoded tenant ID
    // In production, this should come from the authenticated user's session
    const searchParams = request.nextUrl.searchParams;
    const tenantIdParam = searchParams.get("tenantId");

    if (!tenantIdParam) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const tenantId = new ObjectId(tenantIdParam);

    // Calculate date ranges
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch total leads
    const totalLeads = await db
      .collection(COLLECTIONS.LEADS)
      .countDocuments({ tenant_id: tenantId });

    // Fetch leads from this month
    const leadsThisMonth = await db
      .collection(COLLECTIONS.LEADS)
      .countDocuments({
        tenant_id: tenantId,
        created_at: { $gte: startOfMonth },
      });

    // Fetch leads from last month
    const leadsLastMonth = await db
      .collection(COLLECTIONS.LEADS)
      .countDocuments({
        tenant_id: tenantId,
        created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      });

    // Calculate percentage change
    const leadsPercentChange =
      leadsLastMonth > 0
        ? Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100)
        : 100;

    // Active conversations (leads with messages in last 24 hours)
    const activeConversations = await db
      .collection(COLLECTIONS.MESSAGES)
      .aggregate([
        {
          $match: {
            created_at: { $gte: startOfDay },
          },
        },
        {
          $lookup: {
            from: COLLECTIONS.LEADS,
            localField: "lead_id",
            foreignField: "_id",
            as: "lead",
          },
        },
        {
          $unwind: "$lead",
        },
        {
          $match: {
            "lead.tenant_id": tenantId,
          },
        },
        {
          $group: {
            _id: "$lead_id",
          },
        },
        {
          $count: "total",
        },
      ])
      .toArray();

    const activeConversationsCount =
      activeConversations.length > 0 ? activeConversations[0].total : 0;

    // New messages today
    const newMessagesToday = await db
      .collection(COLLECTIONS.MESSAGES)
      .aggregate([
        {
          $match: {
            created_at: { $gte: startOfDay },
          },
        },
        {
          $lookup: {
            from: COLLECTIONS.LEADS,
            localField: "lead_id",
            foreignField: "_id",
            as: "lead",
          },
        },
        {
          $unwind: "$lead",
        },
        {
          $match: {
            "lead.tenant_id": tenantId,
          },
        },
        {
          $count: "total",
        },
      ])
      .toArray();

    const newMessagesTodayCount =
      newMessagesToday.length > 0 ? newMessagesToday[0].total : 0;

    // Closed deals
    const closedDeals = await db.collection(COLLECTIONS.LEADS).countDocuments({
      tenant_id: tenantId,
      status: "closed",
    });

    // Closed deals this week
    const closedDealsThisWeek = await db
      .collection(COLLECTIONS.LEADS)
      .countDocuments({
        tenant_id: tenantId,
        status: "closed",
        updated_at: { $gte: startOfWeek },
      });

    // Calculate average response time (simplified - time between lead creation and first message)
    const avgResponseTime = await db
      .collection(COLLECTIONS.MESSAGES)
      .aggregate([
        {
          $match: {
            sender_type: { $in: ["user", "ai"] },
            created_at: { $gte: startOfMonth },
          },
        },
        {
          $lookup: {
            from: COLLECTIONS.LEADS,
            localField: "lead_id",
            foreignField: "_id",
            as: "lead",
          },
        },
        {
          $unwind: "$lead",
        },
        {
          $match: {
            "lead.tenant_id": tenantId,
          },
        },
        {
          $project: {
            responseTime: {
              $subtract: ["$created_at", "$lead.created_at"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: "$responseTime" },
          },
        },
      ])
      .toArray();

    const avgResponseMs =
      avgResponseTime.length > 0 ? avgResponseTime[0].avgTime : 0;
    const avgResponseSeconds = Math.round(avgResponseMs / 1000);

    // Fetch recent leads (last 5)
    const recentLeads = await db
      .collection(COLLECTIONS.LEADS)
      .find({ tenant_id: tenantId })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();

    // Fetch recent activity (messages)
    const recentActivity = await db
      .collection(COLLECTIONS.MESSAGES)
      .aggregate([
        {
          $lookup: {
            from: COLLECTIONS.LEADS,
            localField: "lead_id",
            foreignField: "_id",
            as: "lead",
          },
        },
        {
          $unwind: "$lead",
        },
        {
          $match: {
            "lead.tenant_id": tenantId,
          },
        },
        {
          $sort: { created_at: -1 },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 1,
            sender_type: 1,
            content: 1,
            created_at: 1,
            lead_name: "$lead.name",
            lead_email: "$lead.email",
          },
        },
      ])
      .toArray();

    // Fetch leads by status for chart
    const leadsByStatus = await db
      .collection(COLLECTIONS.LEADS)
      .aggregate([
        {
          $match: { tenant_id: tenantId },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Fetch leads over time (last 7 days)
    const leadsOverTime = await db
      .collection(COLLECTIONS.LEADS)
      .aggregate([
        {
          $match: {
            tenant_id: tenantId,
            created_at: { $gte: startOfWeek },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    return NextResponse.json({
      stats: {
        totalLeads: {
          value: totalLeads,
          change: leadsPercentChange,
          trend: leadsPercentChange >= 0 ? "up" : "down",
        },
        activeConversations: {
          value: activeConversationsCount,
          newToday: newMessagesTodayCount,
        },
        closedDeals: {
          value: closedDeals,
          thisWeek: closedDealsThisWeek,
        },
        avgResponseTime: {
          value: avgResponseSeconds,
          formatted:
            avgResponseSeconds < 60
              ? `${avgResponseSeconds}s`
              : `${Math.floor(avgResponseSeconds / 60)}m ${
                  avgResponseSeconds % 60
                }s`,
        },
      },
      recentLeads: (recentLeads as unknown as LeadDocument[]).map((lead) => ({
        _id: lead._id.toString(),
        name: lead.name || "Unknown",
        email: lead.email || "No email",
        status: lead.status,
        created_at: lead.created_at,
        summary: lead.summary,
      })),
      recentActivity: (recentActivity as unknown as MessageDocument[]).map(
        (activity) => ({
          _id: activity._id.toString(),
          sender_type: activity.sender_type,
          content: activity.content,
          created_at: activity.created_at,
          lead_name: activity.lead_name || "Unknown Lead",
          lead_email: activity.lead_email,
        })
      ),
      charts: {
        leadsByStatus: (leadsByStatus as unknown as StatusGroup[]).map(
          (item) => ({
            status: item._id,
            count: item.count,
          })
        ),
        leadsOverTime: (leadsOverTime as unknown as TimeGroup[]).map(
          (item) => ({
            date: item._id,
            count: item.count,
          })
        ),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
