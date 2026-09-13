"use client";

import React, { useState, useMemo } from "react";
import {
  BPS_PROVINCES,
  CATEGORIES,
  Category,
  DirectionalIndicator,
  DIRECTIONAL,
} from "../lib/constants";
import { computeRealitySignal } from "../lib/heuristic";
import type { Payload } from "../lib/types";

const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; weight: number }
> = {
  employment_income: {
    label: "Employment & Income",
    icon: "💼",
    weight: 3,
  },
  household_composition: {
    label: "Household Composition",
    icon: "🏠",
    weight: 2,
  },
  housing_conditions: {
    label: "Housing Conditions",
    icon: "🏘️",
    weight: 2,
  },
  assets_utilities: {
    label: "Assets & Utilities",
    icon: "⚡",
    weight: 1,
  },
  health: {
    label: "Health",
    icon: "🏥",
    weight: 1,
  },
  education: {
    label: "Education",
    icon: "🎓",
    weight: 1,
  },
};

interface SubmissionFormProps {
  onSubmit: (payload: Payload, regionCode: number) => void;
}

export function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [categories, setCategories] = useState<Record<Category, DirectionalIndicator>>({
    employment_income: DIRECTIONAL.UNCHANGED,
    household_composition: DIRECTIONAL.UNCHANGED,
    housing_conditions: DIRECTIONAL.UNCHANGED,
    assets_utilities: DIRECTIONAL.UNCHANGED,
    health: DIRECTIONAL.UNCHANGED,
    education: DIRECTIONAL.UNCHANGED,
  });

  // Calculate live preview
  const livePreview = useMemo(() => {
    const mockPayload: Payload = {
      schema_version: "1.0",
      timestamp: 0,
      categories,
    };
    return computeRealitySignal(mockPayload);
  }, [categories]);

  // Check if form is ready to submit (province selected)
  const isComplete = provinceCode !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    const payload: Payload = {
      schema_version: "1.0",
      timestamp: Date.now(),
      categories,
    };

    onSubmit(payload, provinceCode);
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "MEDIUM":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30";
      case "LOW":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-6"
    >
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Report Lived Reality
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select your province and rate the socioeconomic indicators matching your lived reality.
        </p>
      </div>

      {/* Province Selection */}
      <div>
        <label htmlFor="province" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Select Province
        </label>
        <div className="relative">
          <select
            id="province"
            name="province"
            className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm p-3.5 font-medium transition-all appearance-none pr-10 cursor-pointer"
            value={provinceCode ?? ""}
            onChange={(e) => setProvinceCode(e.target.value ? Number(e.target.value) : null)}
            required
          >
            <option value="" disabled className="bg-white text-slate-400 dark:bg-slate-900 dark:text-slate-500">
              -- Choose a Province --
            </option>
            {BPS_PROVINCES.map((p) => (
              <option
                key={p.code}
                value={p.code}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-medium py-1.5"
              >
                {p.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Socioeconomic Categories Sliders Grid */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Socioeconomic Categories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust sliders to indicate changes in your lived reality compared to official records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const val = categories[cat];
            const meta = CATEGORY_META[cat];

            return (
              <div
                key={cat}
                className={`p-4 rounded-xl border transition-all ${
                  val === -1
                    ? "bg-rose-500/5 border-rose-500/30"
                    : val === 1
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" role="img" aria-label={meta.label}>
                      {meta.icon}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block leading-tight">
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  {val === -1 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Worsened (-1)
                    </span>
                  )}
                  {val === 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Unchanged (0)
                    </span>
                  )}
                  {val === 1 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Improved (+1)
                    </span>
                  )}
                </div>

                {/* Slider Control */}
                <div className="mt-3 space-y-2">
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="1"
                    value={val}
                    onChange={(e) =>
                      setCategories((prev) => ({
                        ...prev,
                        [cat]: Number(e.target.value) as DirectionalIndicator,
                      }))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />

                  {/* Discrete Clickable Ticks */}
                  <div className="flex justify-between text-[11px] font-medium pt-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCategories((prev) => ({ ...prev, [cat]: DIRECTIONAL.WORSENED }))
                      }
                      className={`transition-colors cursor-pointer ${
                        val === -1
                          ? "text-rose-600 dark:text-rose-400 font-bold"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      🔴 Worsened
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCategories((prev) => ({ ...prev, [cat]: DIRECTIONAL.UNCHANGED }))
                      }
                      className={`transition-colors cursor-pointer ${
                        val === 0
                          ? "text-slate-700 dark:text-slate-200 font-bold"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      ⚪ Unchanged
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCategories((prev) => ({ ...prev, [cat]: DIRECTIONAL.IMPROVED }))
                      }
                      className={`transition-colors cursor-pointer ${
                        val === 1
                          ? "text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      🟢 Improved
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
            Lived Reality Status Preview
          </h4>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
            Score: {livePreview.score} <span className="text-slate-400 text-base font-normal">/ 10</span>
          </p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${getBadgeColor(
              livePreview.signal
            )}`}
          >
            Status: {livePreview.signal === "none" ? "Aligned" : livePreview.signal}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isComplete}
        className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer ${
          isComplete
            ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 active:scale-[0.99]"
            : "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
        }`}
      >
        Review & Submit Attestation
      </button>
    </form>
  );
}
