import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export function useAppsQuery() {
  return useQuery({
    queryKey: ["apps"],
    queryFn: apiClient.getApps,
    staleTime: 60_000
  });
}
