import { StaticPage } from "@/components/StaticPage";
import html from "@/content/order.html?raw";

export default function OrderPage() {
  return <StaticPage title="Order SH-2451 — SourcingRelay" description="Full SourcingRelay order detail with SKU, QC, shipping and payment information." html={html} />;
}
