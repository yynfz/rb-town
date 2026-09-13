import React from "react";
import Link from "next/link";
import { ObservatoryDashboard } from "@/components/ObservatoryDashboard";
import type { ObservatoryState } from "@/lib/types";
import seedDataRaw from "../../../data/observatory-seed.json";

// Cast imported JSON to the strictly typed state
const seedData = seedDataRaw as ObservatoryState;

export default function ObservatoryPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 text-black">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            Reality Bridge
          </h1>
          <p className="text-xs text-gray-500">Observatory View</p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Submit a Signal &rarr;
        </Link>
      </header>

      <div className="flex-1 w-full pb-12">
        <ObservatoryDashboard initialState={seedData} />
      </div>
    </main>
  );
}
