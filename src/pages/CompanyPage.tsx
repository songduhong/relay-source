import { StaticPage } from "@/components/StaticPage";
import html from "@/content/company.html?raw";

export default function CompanyPage() {
  return (
    <StaticPage
      title="About us — SourcingRelay"
      description="Read a letter from the SourcingRelay founder, our company story and the experience behind our Shenzhen sourcing desk for small, mixed orders."
      html={html}
    />
  );
}
