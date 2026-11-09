import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="section" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div className="container center" style={{ textAlign: "center" }}>
          <span className="eyebrow">Secure workspace</span>
          <h1 style={{ marginTop: 12 }}>Checking your session...</h1>
        </div>
      </main>
    );
  }

  if (!data?.user) {
    return <Navigate to="/auth" replace state={{ next: location.pathname + location.search + location.hash }} />;
  }

  return <>{children}</>;
}
