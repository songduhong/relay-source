import { StaticPage } from "@/components/StaticPage";
import html from "@/content/about.html?raw";

export default function AboutPage() {
  return (
    <StaticPage
      title="Brand purpose — SourcingRelay"
      description="Why SourcingRelay exists: operational China sourcing, documented QC and transparent landed costs for small-B sellers."
      html={html}
    />
  );
}
