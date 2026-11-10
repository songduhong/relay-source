import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getDemoOrder, type OrderStatus } from "@/data/demoOrders";

const statusBadge: Record<OrderStatus, string> = {
  active: "badge badge-info",
  action: "badge badge-danger",
  shipped: "badge badge-warning",
  delivered: "badge badge-success"
};

function riskBadge(risk: string) {
  if (risk === "High") return "badge badge-danger";
  if (risk === "Medium") return "badge badge-warning";
  return "badge badge-success";
}

function qcBadge(qc: string) {
  if (qc === "Passed") return "badge badge-success";
  if (qc === "Pending") return "badge badge-warning";
  return "badge badge-danger";
}

function toneBadge(tone: "success" | "warning" | "danger") {
  return `badge badge-${tone}`;
}

export default function OrderPage() {
  const { code } = useParams();
  const order = getDemoOrder(code);

  useEffect(() => {
    document.title = order ? `Order ${order.code} — RelaySource` : "Order not found — RelaySource";
  }, [order]);

  if (!order) {
    return (
      <main className="app-main">
        <section className="app-header">
          <div className="app-title">
            <h1>Order not found</h1>
            <p>We could not find that order in this workspace.</p>
          </div>
          <Link className="btn btn-primary" to="/dashboard">Back to orders</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="app-main">
      <section className="app-header" id="summary">
        <div className="app-title">
          <h1>Order {order.code}</h1>
          <p>{order.skus} SKUs · {order.units.toLocaleString()} units · destination {order.destination}</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-ghost" to="/dashboard">Back to orders</Link>
          <span className={statusBadge[order.status]}>{order.statusLabel}</span>
          <strong>{order.eta}</strong>
        </div>
      </section>

      <section className="card flat">
        <div className="timeline-horizontal">
          {order.milestones.map((milestone) => (
            <div key={milestone.label} className={`timeline-step${milestone.state === "pending" ? "" : ` ${milestone.state}`}`}>
              {milestone.label}
              <br />
              <span className="muted">{milestone.meta}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="kpi-band">
        <article className="mini-card"><span className="kpi-label">SKUs</span><div className="kpi-value">{order.skus}</div><div className="kpi-sub">{order.items.filter((item) => item.qc === "Passed").length} passed in sample</div></article>
        <article className="mini-card"><span className="kpi-label">Units</span><div className="kpi-value">{order.units.toLocaleString()}</div><div className="kpi-sub">Count verified</div></article>
        <article className="mini-card"><span className="kpi-label">Landed</span><div className="kpi-value">{order.landed}</div><div className="kpi-sub">DDP estimate</div></article>
        <article className="mini-card"><span className="kpi-label">Cartons</span><div className="kpi-value">{order.cartons}</div><div className="kpi-sub">Max 21kg each</div></article>
        <article className="mini-card"><span className="kpi-label">Risks</span><div className="kpi-value">{order.risks}</div><div className="kpi-sub">Open risk flags</div></article>
      </section>

      <section className="split-grid">
        <div className="app-main">
          <article className="table-wrap" id="skus">
            <div className="card-title" style={{ padding: 20 }}>
              <h3>SKU procurement list</h3>
              <span className="badge badge-warning">{order.statusLabel}</span>
            </div>
            <div className="table-scroll">
              <table className="table">
                <thead><tr><th>SKU</th><th>Supplier</th><th>Qty</th><th>Landed</th><th>Risk</th><th>QC</th><th>Action</th></tr></thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.sku}>
                      <td>
                        <div className="product-cell">
                          <div className="thumb">📦</div>
                          <div><div className="product-name">{item.sku}</div><div className="product-meta">{item.title}</div></div>
                        </div>
                      </td>
                      <td>{item.supplier}</td>
                      <td>{item.quantity}</td>
                      <td>{item.landed}</td>
                      <td><span className={riskBadge(item.risk)}>{item.risk}</span></td>
                      <td><span className={qcBadge(item.qc)}>{item.qc}</span></td>
                      <td><a className="link" href="#skus">{item.action}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="card flat" id="qc">
            <div className="card-title"><h3>QC gallery</h3><span className="badge badge-info">Updated {order.updated}</span></div>
            <div className="photo-grid">
              {order.items.slice(0, 4).map((item) => (
                <div className="photo" key={item.sku}>{item.sku} · front</div>
              ))}
              {order.items.slice(0, 4).map((item) => (
                <div className="photo" key={`${item.sku}-back`}>{item.sku} · packing</div>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: 16 }}>Each SKU record keeps supplier, purchase price, quantity, dimensions, weight, photos, QC result and risk notes.</p>
          </article>

          <article className="card flat" id="suppliers">
            <div className="card-title"><h3>Suppliers</h3><span className="badge badge-success">{order.suppliers.length} linked</span></div>
            <ul className="panel-list">
              {order.suppliers.map((supplier) => (
                <li key={supplier.name}>
                  <span><strong>{supplier.name}</strong><br /><span className="small muted">{supplier.meta}</span></span>
                  <span className={toneBadge(supplier.tone)}>{supplier.status}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="app-main">
          <article className="card flat summary-card">
            <div className="card-title"><h3>Cost breakdown</h3><span className="badge badge-neutral">Estimate</span></div>
            <ul className="panel-list">
              {order.costs.map((cost) => (
                <li key={cost.label}><span>{cost.label}</span><strong>{cost.value}</strong></li>
              ))}
            </ul>
            <div className="total-row"><span>Total</span><span>{order.landed}</span></div>
          </article>

          <article className="card flat" id="documents">
            <div className="card-title"><h3>Documents</h3><span className={`badge badge-${order.documents.some((document) => document.tone === "danger") ? "danger" : "success"}`}>{order.documents.filter((document) => document.tone === "danger").length} missing</span></div>
            <ul className="panel-list">
              {order.documents.map((document) => (
                <li key={document.label}><span>{document.label}</span><span className={toneBadge(document.tone)}>{document.status}</span></li>
              ))}
            </ul>
            <button className="btn btn-ghost btn-block" style={{ marginTop: 18 }} type="button">Request document</button>
          </article>

          {order.notice && (
            <article className="notice">
              <span>⚠️</span><span>{order.notice}</span>
            </article>
          )}

          <article className="card flat" id="shipping">
            <div className="card-title"><h3>Shipping options</h3></div>
            <ul className="panel-list">
              <li><span><strong>DDP air</strong><br /><span className="small muted">7–10 days · includes duties</span></span><strong>$2,410</strong></li>
              <li><span><strong>UPS express</strong><br /><span className="small muted">3–5 days · fastest</span></span><strong>$3,120</strong></li>
              <li><span><strong>DDP sea</strong><br /><span className="small muted">28–34 days · lowest cost</span></span><strong>$1,540</strong></li>
            </ul>
          </article>
        </aside>
      </section>
    </main>
  );
}
