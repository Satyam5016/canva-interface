import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export function useGraphQuery(appId: string) {
  return useQuery({
    queryKey: ["graph", appId],
    queryFn: () => apiClient.getGraph(appId),
    enabled: Boolean(appId),
    staleTime: 20_000
  });
}
