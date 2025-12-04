"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface RecentLead {
  _id: string;
  name: string;
  email: string;
  status: string;
  created_at: Date;
  summary: string | null;
}

interface RecentLeadsProps {
  leads: RecentLead[];
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  open: "bg-yellow-500",
  in_progress: "bg-purple-500",
  closed: "bg-green-500",
  archived: "bg-gray-500",
};

const statusLabels: Record<string, string> = {
  new: "New",
  open: "Open",
  in_progress: "In Progress",
  closed: "Closed",
  archived: "Archived",
};

export function RecentLeads({ leads }: RecentLeadsProps) {
  if (!leads || leads.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent leads</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {leads.map((lead) => {
            const initials = lead.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={lead._id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {lead.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`${
                        statusColors[lead.status] || statusColors.new
                      } text-white`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                  {lead.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {lead.summary}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lead.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
