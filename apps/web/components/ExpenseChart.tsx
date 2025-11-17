"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { getCurrencySymbol } from "@/lib/currency";

interface ExpenseChartProps {
  baseCurrency: string;
  totalSpent: number;
  totalPlanned: number;
  actualRemaining: number;
  entries: Array<{
    id: number;
    name: string;
    total: number;
    currency: string;
    category: string;
    isPlanned?: boolean;
  }>;
  convertToBaseCurrency: (amount: number, fromCurrency: string) => number;
  getCategoryLabel: (category: string) => string;
}

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-2))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ExpenseChart({
  baseCurrency,
  totalSpent,
  totalPlanned,
  actualRemaining,
  entries,
  convertToBaseCurrency,
  getCategoryLabel,
}: ExpenseChartProps) {
  // Budget overview data
  const budgetData = [
    { name: "Spent", value: totalSpent, fill: "#ef4444" },
    { name: "Planned", value: totalPlanned, fill: "#f97316" },
    { name: "Remaining", value: Math.max(0, actualRemaining), fill: "#22c55e" },
  ];

  // Category breakdown data
  const categoryMap = new Map<string, { spent: number; planned: number }>();

  entries.forEach((entry) => {
    const converted = convertToBaseCurrency(entry.total, entry.currency);
    const current = categoryMap.get(entry.category) || { spent: 0, planned: 0 };

    if (entry.isPlanned) {
      current.planned += converted;
    } else {
      current.spent += converted;
    }

    categoryMap.set(entry.category, current);
  });

  const categoryData = Array.from(categoryMap.entries())
    .map(([category, values]) => ({
      category: getCategoryLabel(category),
      spent: values.spent,
      planned: values.planned,
      total: values.spent + values.planned,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="grid gap-6 lg:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>How your budget is distributed</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) =>
                        `${name}: ${getCurrencySymbol(baseCurrency)}${Number(
                          value
                        ).toFixed(2)}`
                      }
                    />
                  }
                />
                <Pie
                  data={budgetData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, value }) =>
                    `${name}: ${getCurrencySymbol(baseCurrency)}${value.toFixed(
                      0
                    )}`
                  }
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) =>
                        `${name}: ${getCurrencySymbol(baseCurrency)}${Number(
                          value
                        ).toFixed(2)}`
                      }
                    />
                  }
                />
                <Legend />
                <Bar
                  dataKey="spent"
                  stackId="a"
                  fill="#ef4444"
                  radius={[0, 0, 4, 4]}
                  name="Spent"
                />
                <Bar
                  dataKey="planned"
                  stackId="a"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  name="Planned"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
