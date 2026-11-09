import { StaticPage } from "@/components/StaticPage";
import html from "@/content/quality-control.html?raw";

export default function QualityControlPage() {
  return (
    <StaticPage
      title="Quality Control — RelaySource"
      description="SKU-level inspection, risk flags, photo verification and pre-shipment checks for electronics, phone cases and mixed-SKU orders."
      html={html}
    />
  );
}
