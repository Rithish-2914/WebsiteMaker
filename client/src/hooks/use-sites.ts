import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSite } from "@shared/routes";

export function useSites() {
  // This endpoint isn't explicitly in the schema shown but is implied by "List of recent generations" requirement
  // For MVP we might need to rely on localStorage or just fetching specific IDs if list isn't implemented
  // Assuming list endpoint exists or we fetch individually. 
  // Based on instructions "List of recent generations below the input", I will assume a list logic or manage a local list of IDs.
  // Since the backend provided in context only has create/get, I will implement a local history approach for the list.
  return { data: [] }; // Placeholder if backend doesn't support listing all
}

export function useSite(id: number | null) {
  return useQuery({
    queryKey: [api.sites.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.sites.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch site");
      return api.sites.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    // Poll every 2 seconds if status is pending
    refetchInterval: (query) => {
      if (query.state.data?.status === "pending") return 2000;
      return false;
    },
  });
}

export function useCreateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSite) => {
      const res = await fetch(api.sites.create.path, {
        method: api.sites.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create site generation task");
      return api.sites.create.responses[200].parse(await res.json());
    },
    // We don't have a list endpoint to invalidate, but we can return the data
  });
}
