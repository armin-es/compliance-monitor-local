import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callHuggingFace, mapResult } from "@/lib/huggingface";
import { createAnalysis, updateAnalysis, softDeleteAnalysis } from "@/lib/storage";
import type { Analysis, AnalysisRequest } from "@/types";
import { ANALYSES_KEY } from "./use-analyses";

export function useAnalyze() {
  const queryClient = useQueryClient();

  return useMutation<Analysis, Error, AnalysisRequest>({
    mutationFn: async (data) => {
      const hfResponse = await callHuggingFace(data.action, data.guideline);
      const { result, confidence } = mapResult(hfResponse);
      return createAnalysis({ action: data.action, guideline: data.guideline, result, confidence });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ANALYSES_KEY }),
  });
}

export function useReanalyze(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Analysis, Error, AnalysisRequest>({
    mutationFn: async (data) => {
      const hfResponse = await callHuggingFace(data.action, data.guideline);
      const { result, confidence } = mapResult(hfResponse);
      const updated = updateAnalysis(id, { action: data.action, guideline: data.guideline, result, confidence });
      if (!updated) throw new Error("Entry not found");
      return updated;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ANALYSES_KEY }),
  });
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      softDeleteAnalysis(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ANALYSES_KEY }),
  });
}
