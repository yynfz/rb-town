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

const CATEGORY_LABELS: Record<Category, string> = {
  employment_income: "Employment & Income",
  household_composition: "Household Composition",
  housing_conditions: "Housing Conditions",
  assets_utilities: "Assets & Utilities",
  health: "Health",
  education: "Education",
};

interface SubmissionFormProps {
  onSubmit: (payload: Payload, regionCode: number) => void;
}

export function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [categories, setCategories] = useState<Record<Category, DirectionalIndicator | null>>({
    employment_income: null,
    household_composition: null,
    housing_conditions: null,
    assets_utilities: null,
    health: null,
    education: null,
  });

  // Calculate live preview
  const livePreview = useMemo(() => {
    // Treat nulls as 0 (unchanged) purely for live preview computation
    const currentValues = Object.fromEntries(
      Object.entries(categories).map(([k, v]) => [k, v === null ? 0 : v])
    ) as Record<Category, DirectionalIndicator>;
    const mockPayload: Payload = {
      schema_version: "1.0",
      timestamp: 0, // Mock timestamp for preview to maintain purity
      categories: currentValues,
    };
    return computeRealitySignal(mockPayload);
  }, [categories]);

  // Check if form is fully filled
  const isComplete =
    provinceCode !== null && Object.values(categories).every((val) => val !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    const payload: Payload = {
      schema_version: "1.0",
      timestamp: Date.now(),
      categories: categories as Record<Category, DirectionalIndicator>,
    };

    onSubmit(payload, provinceCode);
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "LOW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reality Signal Submission</h2>

      <div className="mb-8">
        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
          Select Province
        </label>
        <select
          id="province"
          name="province"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          value={provinceCode ?? ""}
          onChange={(e) => setProvinceCode(e.target.value ? Number(e.target.value) : null)}
          required
        >
          <option value="" disabled>
            -- Choose a Province --
          </option>
          {BPS_PROVINCES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-8 mb-8">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Socioeconomic Categories</h3>
        {CATEGORIES.map((cat) => (
          <fieldset key={cat} className="p-4 bg-gray-50 rounded border border-gray-100">
            <legend className="text-base font-semibold text-gray-800 mb-4">
              {CATEGORY_LABELS[cat]}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Worsened", value: DIRECTIONAL.WORSENED },
                { label: "Unchanged", value: DIRECTIONAL.UNCHANGED },
                { label: "Improved", value: DIRECTIONAL.IMPROVED },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center p-3 rounded cursor-pointer border hover:bg-white transition-colors ${
                    categories[cat] === opt.value
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={cat}
                    value={opt.value}
                    checked={categories[cat] === opt.value}
                    onChange={() =>
                      setCategories((prev) => ({ ...prev, [cat]: opt.value }))
                    }
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    required
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Live Preview</h4>
          <p className="text-2xl font-bold text-gray-900">
            Score: {livePreview.score} <span className="text-gray-400 text-lg font-normal">/ 10</span>
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getBadgeColor(
              livePreview.signal
            )}`}
          >
            Signal: {livePreview.signal}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isComplete}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
          isComplete
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Review & Submit
      </button>
    </form>
  );
}
