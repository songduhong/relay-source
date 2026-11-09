import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJson, type ApiUser } from "@/lib/api";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getJson<{ user: ApiUser | null }>("/api/auth/me"),
    retry: false,
    staleTime: 60_000
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(["auth", "me"], { user: null });
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };
}
