import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Asset, Verification } from "@shared/schema";

export function useDashboardStats() {
  return useQuery({
    queryKey: [api.dashboard.stats.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.dashboard.stats.responses[200].parse(await res.json());
    },
  });
}

export function useAssets(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: [api.assets.list.path, params],
    queryFn: async () => {
      const url = new URL(api.assets.list.path, window.location.origin);
      if (params?.search) url.searchParams.set("search", params.search);
      if (params?.status) url.searchParams.set("status", params.status);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch assets");
      return api.assets.list.responses[200].parse(await res.json());
    },
  });
}

export function useActiveCampaign() {
  return useQuery({
    queryKey: [api.campaigns.getActive.path],
    queryFn: async () => {
      const res = await fetch(api.campaigns.getActive.path);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return api.campaigns.getActive.responses[200].parse(await res.json());
    },
  });
}

export function useVerifications() {
  return useQuery({
    queryKey: [api.verifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.verifications.list.path);
      if (!res.ok) throw new Error("Failed to fetch verifications");
      return api.verifications.list.responses[200].parse(await res.json());
    },
  });
}

export function useReports(type: string) {
  return useQuery({
    queryKey: [api.reports.get.path, type],
    queryFn: async () => {
      const url = buildUrl(api.reports.get.path, { type });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.reports.get.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.verifications.submit.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit verification");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.verifications.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.stats.path] });
    },
  });
}
