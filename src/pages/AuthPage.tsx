import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaticPage } from "@/components/StaticPage";
import { postJson } from "@/lib/api";
import html from "@/content/auth.html?raw";

type AuthMode = "signin" | "register";

export default function AuthPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const authMutation = useMutation({
    mutationFn: ({ mode, payload }: { mode: AuthMode; payload: Record<string, string> }) =>
      postJson<{ user: unknown }>(mode === "signin" ? "/api/auth/login" : "/api/auth/register", payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      window.location.assign("/dashboard");
    },
    onError: (mutationError: Error) => setError(mutationError.message)
  });

  useEffect(() => {
    document.title = "Sign in — SourcingRelay";
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-auth-tab]"));
    const panels = Array.from(document.querySelectorAll<HTMLFormElement>("[data-auth-panel]"));
    const tabHandlers = tabs.map((tab) => {
      const handler = () => {
        const target = tab.dataset.authTab;
        tabs.forEach((item) => {
          const active = item === tab;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => panel.classList.toggle("hidden", panel.dataset.authPanel !== target));
        setError(null);
      };
      tab.addEventListener("click", handler);
      return { tab, handler };
    });

    const handlers: { element: HTMLFormElement; event: string; handler: (event: Event) => void }[] = [];
    const bind = (element: HTMLFormElement | null, event: string, handler: (event: Event) => void) => {
      if (element) {
        element.addEventListener(event, handler);
        handlers.push({ element, event, handler });
      }
    };

    const signIn = document.getElementById("panel-signin") as HTMLFormElement | null;
    const register = document.getElementById("panel-register") as HTMLFormElement | null;
    bind(signIn, "submit", (event) => {
      event.preventDefault();
      const email = (document.getElementById("login-email") as HTMLInputElement).value.trim();
      const password = (document.getElementById("login-password") as HTMLInputElement).value;
      if (!email || !password) { setError("Email and password are required."); return; }
      authMutation.mutate({ mode: "signin", payload: { email, password } });
    });
    bind(register, "submit", (event) => {
      event.preventDefault();
      const payload = {
        name: (document.getElementById("reg-name") as HTMLInputElement).value.trim(),
        company: (document.getElementById("reg-company") as HTMLInputElement).value.trim(),
        email: (document.getElementById("reg-email") as HTMLInputElement).value.trim(),
        password: (document.getElementById("reg-password") as HTMLInputElement).value,
        salesChannel: (document.getElementById("reg-channel") as HTMLSelectElement).value
      };
      if (!payload.email || payload.password.length < 8) { setError("Enter a valid email and at least 8 characters."); return; }
      authMutation.mutate({ mode: "register", payload });
    });

    return () => {
      tabHandlers.forEach(({ tab, handler }) => tab.removeEventListener("click", handler));
      handlers.forEach(({ element, event, handler }) => element.removeEventListener(event, handler));
    };
  }, [authMutation]);

  return (
    <>
      <StaticPage title="Sign in — SourcingRelay" description="Sign in to your SourcingRelay dashboard or create a buyer account." html={html} />
      {error && (
        <div aria-live="polite" style={{ position: "fixed", right: 24, bottom: 24, zIndex: 100 }} className="notice" role="alert">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}
    </>
  );
}
