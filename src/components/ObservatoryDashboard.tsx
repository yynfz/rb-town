"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSubmission } from "./SubmissionContext";
import { applySubmission } from "../lib/observatory";
import type { ObservatoryState } from "../lib/types";
import { BPS_PROVINCES, CATEGORIES } from "../lib/constants";

// Formatting category names nicely
const formatCategoryName = (cat: string) => {
  return cat
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SIGNAL_COLORS = {
  none: "#9ca3af", // gray-400
  LOW: "#facc15", // yellow-400
  MEDIUM: "#fb923c", // orange-400
  HIGH: "#f87171", // red-400
};

export function ObservatoryDashboard({
  initialState,
}: {
  initialState: ObservatoryState;
}) {
  const { latestSubmission } = useSubmission();

  const data = React.useMemo(() => {
    return latestSubmission
      ? applySubmission(initialState, latestSubmission)
      : initialState;
  }, [initialState, latestSubmission]);

  // 1. Prepare Signal Distribution Data (Donut Chart)
  const signalData = [
    { name: "None", value: data.bySignal.none, color: SIGNAL_COLORS.none, key: "none" },
    { name: "Low", value: data.bySignal.LOW, color: SIGNAL_COLORS.LOW, key: "LOW" },
    { name: "Medium", value: data.bySignal.MEDIUM, color: SIGNAL_COLORS.MEDIUM, key: "MEDIUM" },
    { name: "High", value: data.bySignal.HIGH, color: SIGNAL_COLORS.HIGH, key: "HIGH" },
  ].filter((d) => d.value > 0);

  // 2. Prepare Category Data (Grouped Bar Chart)
  const categoryData = CATEGORIES.map((cat) => ({
    name: formatCategoryName(cat),
    Worsened: data.byCategory[cat]?.worsened || 0,
    Unchanged: data.byCategory[cat]?.unchanged || 0,
    Improved: data.byCategory[cat]?.improved || 0,
  }));

  // 3. Prepare Regional Data (Bar Chart)
  const regionalData = Object.entries(data.byRegion)
    .map(([code, count]) => {
      const province = BPS_PROVINCES.find((p) => p.code.toString() === code);
      return {
        name: province ? province.name : `Code ${code}`,
        Count: count,
      };
    })
    .sort((a, b) => b.Count - a.Count); // sort by highest count

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Observatory</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Live, aggregated view of socioeconomic realities attested by citizens on the Sepolia blockchain.
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Submissions</p>
          <p className="text-4xl font-extrabold text-indigo-600">{data.totalSubmissions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Signal Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Signal Severity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={signalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {signalData.map((entry, index) => {
                    const isMySignal = latestSubmission?.signal === entry.key;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={isMySignal ? "#111827" : "none"}
                        strokeWidth={isMySignal ? 3 : 0}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${value} submissions`, "Count"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Directional Indicators by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend />
                <Bar dataKey="Worsened" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Unchanged" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Improved" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Submissions by Province</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                angle={-45}
                textAnchor="end"
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Bar dataKey="Count" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
