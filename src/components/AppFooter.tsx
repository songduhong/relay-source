import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BrandLockup } from "@/components/BrandLockup";

export function AppFooter() {
  const { pathname } = useLocation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ color: "white" }}>
            <BrandLockup />
          </div>
          <p style={{ marginTop: 16 }}>China sourcing, Shenzhen market buying, mixed-SKU consolidation and global fulfillment for small-business sellers.</p>
        </div>
        <div>
          <h4>Services</h4>
          <ul className="footer-list">
            <li><Link to="/services">Product Discovery</Link></li>
            <li><Link to="/services">Multi-SKU Buy & Consolidate</Link></li>
            <li><Link to="/services">Sample Sprint</Link></li>
            <li><Link to="/services">Huaqiangbei Market Run</Link></li>
            <li><Link to="/services">QC & Market-Ready Prep</Link></li>
            <li><Link to="/services">Private Supplier Desk</Link></li>
          </ul>
        </div>
        <div>
          <h4>Platform</h4>
          <ul className="footer-list">
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/track">Track order</Link></li>
            <li><Link to="/quote">Get a quote</Link></li>
            <li><Link to={{ pathname: "/", hash: "#pricing" }} state={{ from: pathname }}>Pricing</Link></li>
            <li><Link to="/about">Brand purpose</Link></li>
            <li><Link to="/about/company">About us</Link></li>
            <li><Link to="/about/reviews">Customer reviews</Link></li>
            <li><Link to="/about/quality-control">Quality control</Link></li>
            <li><Link to="/about/payment-protection">Payment protection</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="footer-list">
            <li><a href="tel:+8618682351575">Phone: +86 186-8235-1575</a></li>
            <li>WeChat: same number</li>
            <li><a href="mailto:lucy@sourcingrelay.com">lucy@sourcingrelay.com</a></li>
            <li>China address: North side of the third floor, Building B, Banwei Park Industrial Zone, No. 2 Yongxiang Road, Bantian Street, Longgang District, Shenzhen</li>
            <li>Mon–Sat, 9am–6pm CST</li>
            <li>Shenzhen · Global support</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} SourcingRelay. Global small-B sourcing, protected.</span>
        <span>Privacy · Terms · DDP shipping notes</span>
      </div>
    </footer>
  );
}
