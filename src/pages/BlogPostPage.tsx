import { StaticPage } from "@/components/StaticPage";
import html from "@/content/blog-post.html?raw";

export default function BlogPostPage() {
  return (
    <StaticPage
      title="Shenzhen Sourcing Playbook — SourcingRelay Blog"
      description="A practical Shenzhen sourcing playbook for global small-B sellers buying mixed-SKU electronics and accessories from China."
      html={html}
    />
  );
}
