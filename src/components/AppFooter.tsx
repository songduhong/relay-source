import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function AppFooter() {
  const { pathname } = useLocation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ color: "white" }}>
            <span className="logo-mark" aria-hidden="true"></span>
            <span className="brand-name">Relay<span className="brand-accent">Source</span></span>
          </div>
          <p style={{ marginTop: 16 }}>China sourcing, Shenzhen market buying, mixed-SKU consolidation and global fulfillment for small-business sellers.</p>
        </div>
        <div>
          <h4>Services</h4>
          <ul className="footer-list">
            <li><Link to="/services">Product sourcing</Link></li>
            <li><Link to="/services">Multi-SKU buying</Link></li>
            <li><Link to="/services">Market runs</Link></li>
            <li><Link to="/services">QC & packing</Link></li>
          </ul>
        </div>
        <div>
          <h4>Platform</h4>
          <ul className="footer-list">
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/track">Track order</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/dashboard/orders/SH-2451">Order demo</Link></li>
            <li><Link to="/quote">Get a quote</Link></li>
            <li><Link to={{ pathname: "/", hash: "#pricing" }} state={{ from: pathname }}>Pricing</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/about/quality-control">Quality control</Link></li>
            <li><Link to="/about/payment-protection">Payment protection</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="footer-list">
            <li><a href="mailto:hello@relaysource.com">hello@relaysource.com</a></li>
            <li>Mon–Fri, 9am–6pm CST</li>
            <li>Shenzhen · Global support</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} RelaySource. Global small-B sourcing, protected.</span>
        <span>Privacy · Terms · DDP shipping notes</span>
      </div>
    </footer>
  );
}
