import { useQuery } from "@tanstack/react-query";
import { getAnalyses } from "@/lib/storage";
import type { Analysis } from "@/types";

export const ANALYSES_KEY = ["analyses"] as const;

export function useAnalyses() {
  return useQuery<Analysis[]>({
    queryKey: ANALYSES_KEY,
    queryFn: () => getAnalyses(),
  });
}
