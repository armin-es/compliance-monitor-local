import type { Analysis, ComplianceResult } from "@/types";

const STORAGE_KEY = "compliance_analyses";

function readAll(): Analysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Analysis[]) : [];
  } catch {
    return [];
  }
}

function writeAll(analyses: Analysis[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
}

export function getAnalyses(): Analysis[] {
  return readAll()
    .filter((a) => !a.deletedAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createAnalysis(data: {
  action: string;
  guideline: string;
  result: ComplianceResult;
  confidence: number;
}): Analysis {
  const all = readAll();
  const now = new Date().toISOString();
  const item: Analysis = {
    id: crypto.randomUUID(),
    action: data.action,
    guideline: data.guideline,
    result: data.result,
    confidence: data.confidence,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([item, ...all]);
  return item;
}

export function updateAnalysis(
  id: string,
  data: { action: string; guideline: string; result: ComplianceResult; confidence: number }
): Analysis | null {
  const all = readAll();
  const idx = all.findIndex((a) => a.id === id && !a.deletedAt);
  if (idx === -1) return null;
  const updated: Analysis = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  writeAll(all);
  return updated;
}

export function softDeleteAnalysis(id: string): boolean {
  const all = readAll();
  const idx = all.findIndex((a) => a.id === id && !a.deletedAt);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], deletedAt: new Date().toISOString() };
  writeAll(all);
  return true;
}
