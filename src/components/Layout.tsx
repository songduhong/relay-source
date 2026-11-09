import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, location.hash]);

  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}
