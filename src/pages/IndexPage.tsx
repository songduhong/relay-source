import { StaticPage } from "@/components/StaticPage";
import { BackToTop } from "@/components/BackToTop";
import html from "@/content/index.html?raw";

export default function IndexPage() {
  return (
    <>
      <StaticPage
        title="SourcingRelay — China Sourcing for Global Small-B Sellers"
        description="SourcingRelay helps global small-B sellers buy from Shenzhen with mixed-SKU sourcing, Huaqiangbei market runs, transparent DDP landed costs and SKU-level QC."
        html={html}
      />
      <BackToTop />
    </>
  );
}
