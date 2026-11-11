import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import IndexPage from "@/pages/IndexPage";

const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const QuotePage = lazy(() => import("@/pages/QuotePage"));
const TrackPage = lazy(() => import("@/pages/TrackPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const CompanyPage = lazy(() => import("@/pages/CompanyPage"));
const ReviewsPage = lazy(() => import("@/pages/ReviewsPage"));
const PaymentProtectionPage = lazy(() => import("@/pages/PaymentProtectionPage"));
const QualityControlPage = lazy(() => import("@/pages/QualityControlPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const OrderPage = lazy(() => import("@/pages/OrderPage"));

function PageFallback() {
  return (
    <main className="section" style={{ minHeight: "52vh", display: "grid", placeItems: "center" }}>
      <div className="container center" style={{ textAlign: "center" }}>
        <span className="eyebrow">SourcingRelay</span>
        <h1 style={{ marginTop: 10 }}>Loading...</h1>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/company" element={<CompanyPage />} />
          <Route path="/about/reviews" element={<ReviewsPage />} />
          <Route path="/about/payment-protection" element={<PaymentProtectionPage />} />
          <Route path="/about/quality-control" element={<QualityControlPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/orders/:code" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path="*" element={<PageFallback />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
