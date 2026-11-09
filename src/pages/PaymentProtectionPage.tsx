import { StaticPage } from "@/components/StaticPage";
import html from "@/content/payment-protection.html?raw";

export default function PaymentProtectionPage() {
  return (
    <StaticPage
      title="Payment Protection — RelaySource"
      description="Milestone payments, escrow-style controls, order approvals and transparent invoices for global small-B sourcing orders."
      html={html}
    />
  );
}
