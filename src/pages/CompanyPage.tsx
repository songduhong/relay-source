import { StaticPage } from "@/components/StaticPage";
import html from "@/content/company.html?raw";

export default function CompanyPage() {
  return (
    <StaticPage
      title="About us — SourcingRelay"
      description="Our story: 15+ years across Shenzhen 3C sourcing, Alibaba mixed orders and Amazon FBA support, now brought directly to global buyers through SourcingRelay."
      html={html}
    />
  );
}
