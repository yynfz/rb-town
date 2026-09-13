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
  const [selectedProvinceCode, setSelectedProvinceCode] = React.useState<string | null>(null);

  const data = React.useMemo(() => {
    return latestSubmission
      ? applySubmission(initialState, latestSubmission)
      : initialState;
  }, [initialState, latestSubmission]);

  const selectedProvinceInfo = React.useMemo(() => {
    if (!selectedProvinceCode) return null;
    return BPS_PROVINCES.find((p) => p.code.toString() === selectedProvinceCode) || null;
  }, [selectedProvinceCode]);

  const activeRegionDetail = React.useMemo(() => {
    if (!selectedProvinceCode || !data.byRegionDetail) return null;
    return data.byRegionDetail[selectedProvinceCode] || null;
  }, [selectedProvinceCode, data.byRegionDetail]);

  // 1. Prepare Signal Distribution Data (Donut Chart)
  const signalData = React.useMemo(() => {
    const sourceBySignal = activeRegionDetail
      ? activeRegionDetail.bySignal
      : data.bySignal;

    return [
      { name: "Aligned", value: sourceBySignal.none, color: SIGNAL_COLORS.none, key: "none" },
      { name: "Low", value: sourceBySignal.LOW, color: SIGNAL_COLORS.LOW, key: "LOW" },
      { name: "Medium", value: sourceBySignal.MEDIUM, color: SIGNAL_COLORS.MEDIUM, key: "MEDIUM" },
      { name: "High", value: sourceBySignal.HIGH, color: SIGNAL_COLORS.HIGH, key: "HIGH" },
    ].filter((d) => d.value > 0);
  }, [activeRegionDetail, data.bySignal]);

  // 2. Prepare Category Data (Grouped Bar Chart)
  const categoryData = React.useMemo(() => {
    const sourceByCategory = activeRegionDetail
      ? activeRegionDetail.byCategory
      : data.byCategory;

    return CATEGORIES.map((cat) => ({
      name: formatCategoryName(cat),
      Worsened: sourceByCategory[cat]?.worsened || 0,
      Unchanged: sourceByCategory[cat]?.unchanged || 0,
      Improved: sourceByCategory[cat]?.improved || 0,
    }));
  }, [activeRegionDetail, data.byCategory]);

  // 3. Prepare Regional Data (Bar Chart)
  const regionalData = React.useMemo(() => {
    return Object.entries(data.byRegion)
      .map(([code, count]) => {
        const province = BPS_PROVINCES.find((p) => p.code.toString() === code);
        return {
          code,
          name: province ? province.name : `Code ${code}`,
          Count: count,
        };
      })
      .sort((a, b) => b.Count - a.Count);
  }, [data.byRegion]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Observatory</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Live, aggregated view of socioeconomic realities attested by citizens across provinces in Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              {selectedProvinceInfo ? `${selectedProvinceInfo.name} Submissions` : "Total Submissions"}
            </p>
            <p className="text-3xl font-extrabold text-indigo-600">
              {activeRegionDetail ? activeRegionDetail.totalSubmissions : data.totalSubmissions}
            </p>
          </div>
        </div>
      </div>

      {/* Active Province Drill-down Banner */}
      {selectedProvinceInfo && (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/30 p-6 shadow-sm">
          <div className="absolute -top-10 -right-10 p-6 opacity-[0.03] pointer-events-none">
            <svg className="w-64 h-64 text-indigo-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-600/20 border border-indigo-500">
                {selectedProvinceInfo.code}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {selectedProvinceInfo.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1 text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {activeRegionDetail ? activeRegionDetail.totalSubmissions : 0} Attestations
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    {data.totalSubmissions > 0 && activeRegionDetail
                      ? ((activeRegionDetail.totalSubmissions / data.totalSubmissions) * 100).toFixed(1)
                      : 0}% of National Total
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedProvinceCode(null)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filter
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Signal Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Divergence Severity</h3>
            {selectedProvinceInfo && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {selectedProvinceInfo.name}
              </span>
            )}
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Directional Indicators by Category</h3>
            {selectedProvinceInfo && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {selectedProvinceInfo.name}
              </span>
            )}
          </div>
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

      {/* Regional Distribution Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Submissions by Province</h3>
            <p className="text-xs text-gray-500">
              Click any bar to drill down into that province&apos;s detailed indicators
            </p>
          </div>
          {selectedProvinceCode && (
            <button
              onClick={() => setSelectedProvinceCode(null)}
              className="text-xs text-indigo-600 font-semibold hover:underline self-start sm:self-auto cursor-pointer"
            >
              Clear Province Selection
            </button>
          )}
        </div>

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
              <Bar
                dataKey="Count"
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={(entry: any) => {
                  if (entry && entry.code) {
                    setSelectedProvinceCode(
                      entry.code === selectedProvinceCode ? null : entry.code
                    );
                  }
                }}
              >
                {regionalData.map((entry, index) => {
                  const isSelected = entry.code === selectedProvinceCode;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSelected ? "#4f46e5" : "#818cf8"}
                      stroke={isSelected ? "#312e81" : "none"}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
