import { StaticPage } from "@/components/StaticPage";
import html from "@/content/services.html?raw";

export default function ServicesPage() {
  return (
    <StaticPage
      title="Sourcing Services — SourcingRelay"
      description="Product sourcing, multi-SKU buying, Shenzhen market runs, SKU-level QC, consolidation and global DDP fulfillment."
      html={html}
    />
  );
}
