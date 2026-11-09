import { useEffect } from "react";
import { StaticPage } from "@/components/StaticPage";
import html from "@/content/dashboard.html?raw";

export default function DashboardPage() {
  useEffect(() => {
    let activeFilter = "all";
    const chips = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter]"));
    const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>("[data-status]"));
    const searchInput = document.querySelector<HTMLInputElement>("[data-search]");

    const applyFilters = () => {
      if (!rows.length) return;
      const query = searchInput?.value.trim().toLowerCase() ?? "";
      rows.forEach((row) => {
        const status = row.dataset.status || "";
        const text = row.textContent?.toLowerCase() || "";
        const matchesFilter = activeFilter === "all" || status === activeFilter;
        const matchesSearch = !query || text.includes(query);
        row.style.display = matchesFilter && matchesSearch ? "" : "none";
      });
    };

    const chipHandlers = chips.map((chip) => {
      const handler = () => {
        chips.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        activeFilter = chip.dataset.filter || "all";
        applyFilters();
      };
      chip.addEventListener("click", handler);
      return { chip, handler };
    });
    searchInput?.addEventListener("input", applyFilters);
    return () => {
      chipHandlers.forEach(({ chip, handler }) => chip.removeEventListener("click", handler));
      searchInput?.removeEventListener("input", applyFilters);
    };
  }, []);

  return <StaticPage title="Dashboard — RelaySource" description="Your RelaySource order dashboard." html={html} />;
}
