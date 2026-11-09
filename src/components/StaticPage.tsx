import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const routeMap: Record<string, string> = {
  "index.html": "/",
  "services.html": "/services",
  "quote.html": "/quote",
  "track.html": "/track",
  "about.html": "/about",
  "payment-protection.html": "/about/payment-protection",
  "quality-control.html": "/about/quality-control",
  "blog.html": "/blog",
  "blog-post.html": "/blog/shenzhen-sourcing-playbook",
  "auth.html": "/auth",
  "dashboard.html": "/dashboard",
  "order.html": "/dashboard/orders/SH-2451"
};

function resolveRoute(href: string) {
  if (routeMap[href]) return routeMap[href];
  if (href.includes(".html#")) {
    const [page, hash] = href.split(".html#");
    const pathname = routeMap[page] || "/";
    return `${pathname}#${hash}`;
  }
  if (href.startsWith("#")) return href;
  return href;
}

export function StaticPage({ title, description, html }: { title: string; description: string; html: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location, html]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor || anchor.target === "_blank" || anchor.href.startsWith("mailto:") || anchor.href.startsWith("tel:")) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    const route = resolveRoute(href);
    if (!route || route === href) return;
    event.preventDefault();
    if (route.startsWith("#")) {
      document.getElementById(route.slice(1))?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const [pathname, hash] = route.split("#");
    navigate({ pathname, hash: hash ? `#${hash}` : undefined });
  }

  return (
    <div ref={rootRef} onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }}></div>
  );
}



