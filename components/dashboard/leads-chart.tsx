"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadsChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function LeadsChart({ data }: LeadsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Leads Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const chartHeight = 200;

  return (
    <Card className="col-span-4 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Leads Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="w-full">
          <div className="flex items-end justify-between gap-2 h-[200px] px-2">
            {data.map((item, index) => {
              const barHeight =
                maxCount > 0 ? (item.count / maxCount) * chartHeight : 0;
              const date = new Date(item.date);
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "short",
              });

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 group"
                >
                  <div className="relative w-full flex items-end justify-center h-full">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all hover:from-blue-600 hover:to-blue-500 relative group-hover:shadow-lg"
                      style={{ height: `${barHeight}px` }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 font-medium">
                    {dayName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
