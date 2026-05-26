export type ComplianceResult = "COMPLIES" | "DEVIATES" | "UNCLEAR";

export interface AnalysisRequest {
  action: string;
  guideline: string;
}

export interface Analysis {
  id: string;
  action: string;
  guideline: string;
  result: ComplianceResult;
  confidence: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
