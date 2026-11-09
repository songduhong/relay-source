import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { StaticPage } from "@/components/StaticPage";
import { postJson, type TrackResponse } from "@/lib/api";
import html from "@/content/track.html?raw";

export default function TrackPage() {
  const lookup = useMutation({
    mutationFn: (payload: { code: string; email: string }) => postJson<TrackResponse>("/api/track", payload),
    onSuccess: (data) => {
      const error = document.getElementById("lookup-error");
      const result = document.getElementById("guest-order-result");
      error?.classList.add("hidden");
      result?.classList.remove("hidden");
      const title = result?.querySelector("h1");
      if (title) title.textContent = `Order ${data.code}`;
      result?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    onError: () => {
      document.getElementById("lookup-error")?.classList.remove("hidden");
      document.getElementById("guest-order-result")?.classList.add("hidden");
    }
  });

  useEffect(() => {
    document.title = "Track order — SourcingRelay";
    const form = document.getElementById("guest-lookup-form") as HTMLFormElement | null;
    const button = form?.querySelector("button[type=submit]");
    const handler = (event: Event) => {
      event.preventDefault();
      const code = (document.getElementById("lookup-order") as HTMLInputElement | null)?.value.trim().toUpperCase() ?? "";
      const email = (document.getElementById("lookup-email") as HTMLInputElement | null)?.value.trim().toLowerCase() ?? "";
      if (!code || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        lookup.reset();
        document.getElementById("lookup-error")?.classList.remove("hidden");
        document.getElementById("guest-order-result")?.classList.add("hidden");
        return;
      }
      if (button instanceof HTMLButtonElement) button.textContent = "Searching...";
      lookup.mutate({ code, email });
      if (button instanceof HTMLButtonElement) button.textContent = "View order detail";
    };
    form?.addEventListener("submit", handler);
    return () => form?.removeEventListener("submit", handler);
  }, [lookup]);

  return <StaticPage title="Track order — SourcingRelay" description="Track your SourcingRelay order as a guest using your order number and quote email." html={html} />;
}
