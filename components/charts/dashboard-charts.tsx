"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS_STYLE = { fontSize: 12, fill: "var(--color-muted-foreground)" };

export function CompletionByTeamChart({ data }: { data: { team: string; completionRate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 8, right: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="team" tick={AXIS_STYLE} axisLine={false} tickLine={false} reversed />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="%" width={40} orientation="right" />
        <Tooltip
          cursor={{ fill: "var(--color-muted)" }}
          contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 13 }}
          formatter={(value) => [`${value}%`, "השלמה"]}
        />
        <Bar dataKey="completionRate" fill="var(--color-accent)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AdherenceTrendChart({ data }: { data: { label: string; completionRate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: 8, right: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} reversed />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="%" width={40} orientation="right" />
        <Tooltip
          contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 13 }}
          formatter={(value) => [`${value}%`, "השלמה"]}
        />
        <Line
          type="monotone"
          dataKey="completionRate"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "var(--color-primary)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryDistributionChart({ data }: { data: { category: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ right: 16, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} allowDecimals={false} reversed />
        <YAxis
          dataKey="category"
          type="category"
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
          width={110}
          orientation="right"
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)" }}
          contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 13 }}
        />
        <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 0, 0, 6]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
