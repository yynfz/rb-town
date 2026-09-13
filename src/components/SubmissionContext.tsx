"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CompletedSubmission } from "../lib/types";

interface SubmissionContextType {
  latestSubmission: CompletedSubmission | null;
  setLatestSubmission: (submission: CompletedSubmission | null) => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(
  undefined
);

export function SubmissionProvider({ children }: { children: ReactNode }) {
  const [latestSubmission, setLatestSubmission] = useState<CompletedSubmission | null>(null);

  return (
    <SubmissionContext.Provider value={{ latestSubmission, setLatestSubmission }}>
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmission() {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error("useSubmission must be used within a SubmissionProvider");
  }
  return context;
}
