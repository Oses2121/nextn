"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { overviewChartData } from "@/lib/data"
import { useTheme } from "next-themes"

export function OverviewChart() {
  const { resolvedTheme } = useTheme()
  const strokeColor = resolvedTheme === 'dark' ? '#888888' : '#888888';
  const fillColor = 'hsl(var(--primary))';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={overviewChartData}>
        <XAxis
          dataKey="name"
          stroke={strokeColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={strokeColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value/1000}k`}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
          cursor={{ fill: "hsl(var(--accent))", fillOpacity: 0.3 }}
        />
        <Bar dataKey="total" fill={fillColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
