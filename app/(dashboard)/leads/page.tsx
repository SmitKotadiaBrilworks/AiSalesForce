"use client";

import { LeadsTable, Lead } from "@/components/tables/LeadsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data - in real app, fetch from Supabase
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@techcorp.com",
    status: "new",
    source: "Chat Widget",
    createdAt: "2024-12-01T10:30:00Z",
    summary: "Interested in enterprise plan for team of 50+",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@startup.io",
    status: "in_progress",
    source: "Contact Form",
    createdAt: "2024-11-28T14:20:00Z",
    summary: "Looking for pricing on SMB package",
  },
  {
    id: "3",
    name: "Carol White",
    email: "carol@agency.com",
    status: "open",
    source: "Chat Widget",
    createdAt: "2024-11-25T09:15:00Z",
    summary: "Wants demo for entire team",
  },
  {
    id: "4",
    name: "David Lee",
    email: "david@corp.com",
    status: "closed",
    source: "Referral",
    createdAt: "2024-11-20T16:45:00Z",
    summary: "Purchased annual enterprise license",
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@business.net",
    status: "new",
    source: "Chat Widget",
    createdAt: "2024-12-02T11:00:00Z",
    summary: "Asking about API integrations",
  },
];

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-slate-600 mt-1">
            Manage and track all your leads in one place
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <LeadsTable data={mockLeads} />
    </div>
  );
}
