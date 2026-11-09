import { StaticPage } from "@/components/StaticPage";
import html from "@/content/about.html?raw";

export default function AboutPage() {
  return (
    <StaticPage
      title="About SourcingRelay — Global Small-B Sourcing Team"
      description="Meet the SourcingRelay team and see how we protect global small-B buyers with transparent sourcing, QC, packing and shipping."
      html={html}
    />
  );
}
