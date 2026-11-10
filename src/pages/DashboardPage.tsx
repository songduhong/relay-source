import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { demoOrders, type OrderStatus } from "@/data/demoOrders";

type FilterKey = "all" | OrderStatus;
const orders = demoOrders;

const statusBadge: Record<OrderStatus, string> = {
  active: "badge badge-info",
  action: "badge badge-danger",
  shipped: "badge badge-warning",
  delivered: "badge badge-success"
};

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All orders" },
  { key: "active", label: "In progress" },
  { key: "action", label: "Needs action" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" }
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data } = useAuth();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const visibleOrders = useMemo(() => {
    const text = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;
      const haystack = `${order.code} ${order.destination} ${order.statusLabel}`.toLowerCase();
      return matchesFilter && (!text || haystack.includes(text));
    });
  }, [filter, query]);

  const openOrder = (code: string) => navigate(`/dashboard/orders/${code}`);

  return (
    <main className="app-main">
      <section className="app-header">
        <div className="app-title">
          <h1>Orders</h1>
          <p>Review every sourcing order — from quote approval to DDP delivery.</p>
        </div>
        <Link className="btn btn-primary" to="/quote">New order</Link>
      </section>

      <section className="kpi-band">
        <article className="mini-card">
          <span className="kpi-label">Total orders</span>
          <div className="kpi-value">{orders.length}</div>
          <div className="kpi-sub">All-time history</div>
        </article>
        <article className="mini-card">
          <span className="kpi-label">In progress</span>
          <div className="kpi-value">{orders.filter((order) => order.status === "active" || order.status === "action").length}</div>
          <div className="kpi-sub">Sourcing to dispatch</div>
        </article>
        <article className="mini-card">
          <span className="kpi-label">Delivered</span>
          <div className="kpi-value">{orders.filter((order) => order.status === "delivered").length}</div>
          <div className="kpi-sub">DDP completed</div>
        </article>
        <article className="mini-card">
          <span className="kpi-label">Total landed</span>
          <div className="kpi-value">$16,808.75</div>
          <div className="kpi-sub">Across all orders</div>
        </article>
        <article className="mini-card">
          <span className="kpi-label">Needs action</span>
          <div className="kpi-value">3</div>
          <div className="kpi-sub">Docs, QC or approval</div>
        </article>
      </section>

      <section className="table-wrap">
        <div style={{ padding: "20px 20px 0" }}>
          <div className="toolbar">
            <div className="chip-row" role="tablist" aria-label="Filter orders">
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`chip${filter === item.key ? " active" : ""}`}
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="search">
              <span aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="Search order, destination or status"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Destination</th>
                <th>SKUs</th>
                <th>Units</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Landed</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr
                  key={order.code}
                  onClick={() => openOrder(order.code)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <Link className="link" to={`/dashboard/orders/${order.code}`} onClick={(event) => event.stopPropagation()}>
                      {order.code}
                    </Link>
                  </td>
                  <td>{order.destination}</td>
                  <td>{order.skus}</td>
                  <td>{order.units.toLocaleString()}</td>
                  <td style={{ minWidth: 140 }}>
                    <div className="progress" style={{ height: 8 }}>
                      <div className="progress-bar" style={{ width: `${order.progress}%` }}></div>
                    </div>
                    <span className="small muted">{order.progress}%</span>
                  </td>
                  <td><span className={statusBadge[order.status]}>{order.statusLabel}</span></td>
                  <td><strong>{order.landed}</strong></td>
                  <td className="small muted">{order.updated}</td>
                  <td>
                    <Link className="btn btn-ghost" to={`/dashboard/orders/${order.code}`} onClick={(event) => event.stopPropagation()}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 32 }}>
                    <span className="small muted">No orders match your search.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {data?.user && (
        <p className="small muted" style={{ margin: 0 }}>
          Signed in as {data.user.name || data.user.email}.
        </p>
      )}
    </main>
  );
}
