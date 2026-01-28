import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type User, type LoginRequest } from "@shared/schema";
import { createContext, useContext, ReactNode } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  // Allow overriding API base URL via Vite env var VITE_API_BASE (e.g. http://localhost:8080)
  // Default to localhost:8080 so dev requests go to the backend when env isn't set.
  const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? 'http://localhost:8080';

  const { data: user, isLoading } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(API_BASE + api.auth.me.path, { credentials: 'include' });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await fetch(API_BASE + api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const err: any = new Error(body?.message || 'Login failed');
        err.status = res.status;
        err.body = body;
        throw err;
      }
      return body;
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.role}`,
      });
      
      // Redirect based on role
      if (user.role === "finance") setLocation("/finance");
      else if (user.role === "manager") setLocation("/manager");
      else if (user.role === "hr_manager") setLocation("/hr");
      else if (user.role === "admin_manager") setLocation("/admin");
      else if (user.role === "it_manager") setLocation("/it");
      else if (user.role === "network_equipment_manager") setLocation("/network-equipment");
      else if (user.role === "audio_video_manager") setLocation("/audio-video");
      else if (user.role === "furniture_manager") setLocation("/furniture");
      else if (user.role === "employee") setLocation("/employee");
      else setLocation("/employee");
    },
    onError: async (err: any, variables: LoginRequest | undefined) => {
      // Debug: log full error & variables to console for diagnostics
      console.error('login onError:', { err, variables });

      const attemptedRole = variables?.role ?? "unknown";
      // Friendly role label
      const roleLabelMap: Record<string, string> = {
        finance: "Finance",
        manager: "Asset Manager",
        employee: "Employee",
        hr_manager: "HR Manager",
        admin_manager: "Admin",
        it_manager: "IT Manager",
        network_equipment_manager: "Network Equipment Manager",
        audio_video_manager: "Audio / Video Manager",
        furniture_manager: "Furniture Manager",
      };
      const label = roleLabelMap[attemptedRole] ?? attemptedRole;

      // For these specific roles, show a concise friendly message
      const rolesShowGeneric = new Set([
        "manager",
        "network_equipment_manager",
        "audio_video_manager",
        "furniture_manager",
      ]);

      let description = `${label}: ${err?.message ?? "Please try again."}`;

      // If server returned 401, try to fetch health endpoint for extra diagnostics
      if (err?.status === 401) {
        try {
          const h = await fetch(API_BASE + '/api/health', { credentials: 'include' });
          const hb = await h.json().catch(() => null);
          console.warn('Auth failure details:', { error: err, health: hb });
          // Use a friendly message for manager-like roles
          if (rolesShowGeneric.has(attemptedRole)) {
            description = `${label}: Login failed — please try again.`;
          } else {
            description = `${label}: ${err?.message ?? 'Please try again.'} (${h.status}: ${hb?.ok ?? 'no health'})`;
          }
        } catch (fetchErr) {
          console.warn('Auth failure details:', { error: err, healthFetchError: fetchErr });
          description = `${label}: ${err?.message ?? 'Please try again.'}`;
        }
      }

      toast({
        variant: "destructive",
        title: "Login failed",
        description,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch(API_BASE + api.auth.logout.path, { method: "POST", credentials: 'include' });
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      setLocation("/");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}