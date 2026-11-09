import { StaticPage } from "@/components/StaticPage";
import html from "@/content/blog.html?raw";

export default function BlogPage() {
  return (
    <StaticPage
      title="Sourcing Blog — RelaySource"
      description="Huaqiangbei market guides, product selection frameworks, landed-cost advice and supplier-risk playbooks for global small-B sellers."
      html={html}
    />
  );
}
