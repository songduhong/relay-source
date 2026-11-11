import { StaticPage } from "@/components/StaticPage";
import html from "@/content/reviews.html?raw";

export default function ReviewsPage() {
  return (
    <StaticPage
      title="Customer Reviews — SourcingRelay"
      description="Read SourcingRelay customer stories with buyer context, order evidence, honest tradeoffs and clear correction paths for small mixed China sourcing orders."
      html={html}
    />
  );
}
