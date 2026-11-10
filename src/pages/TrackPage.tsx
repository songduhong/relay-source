import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { StaticPage } from "@/components/StaticPage";
import { postJson, type TrackRequest, type TrackResponse } from "@/lib/api";
import html from "@/content/track.html?raw";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function money(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function dateLabel(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function titleCase(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function qcTone(status: string): "success" | "warning" | "danger" | "neutral" {
  const value = status.toLowerCase();
  if (["passed", "complete", "completed", "ready", "ok", "approved"].includes(value)) return "success";
  if (["pending", "in_qc", "awaiting", "in progress", "in_progress"].includes(value)) return "warning";
  if (["failed", "docs_needed", "docs needed", "action", "action_required", "blocked", "rejected"].includes(value)) return "danger";
  return "neutral";
}

function riskTone(risk: string): "success" | "warning" | "danger" {
  const value = risk.toLowerCase();
  if (value === "high") return "danger";
  if (value === "medium") return "warning";
  return "success";
}

function orderTone(status: string): "success" | "warning" | "info" | "neutral" {
  const value = status.toLowerCase();
  if (value === "delivered") return "success";
  if (value === "shipped" || value === "sourcing") return "info";
  if (["in_qc", "packing", "action_required"].includes(value)) return "warning";
  return "neutral";
}

function renderOrderDetail(data: TrackResponse): string {
  const items = data.items;
  const passed = items.filter((item) => qcTone(item.qcStatus) === "success").length;
  const pending = items.filter((item) => qcTone(item.qcStatus) === "warning").length;
  const needsAction = items.filter((item) => qcTone(item.qcStatus) === "danger" || item.actionRequired).length;
  const highRisk = items.filter((item) => item.riskLevel.toLowerCase() === "high").length;
  const mediumRisk = items.filter((item) => item.riskLevel.toLowerCase() === "medium").length;
  const goodsCost = items.reduce((sum, item) => sum + (item.unitCost ?? 0) * item.quantity, 0);
  const otherCost = Math.max((data.landedValue ?? 0) - goodsCost, 0);

  const supplierMap = new Map<string, { skus: number; units: number }>();
  for (const item of items) {
    const name = item.supplierName?.trim() || "Unassigned";
    const entry = supplierMap.get(name) ?? { skus: 0, units: 0 };
    entry.skus += 1;
    entry.units += item.quantity;
    supplierMap.set(name, entry);
  }

  const timeline = data.timeline.length
    ? data.timeline
        .map((event) => {
          const state = event.status === "current" ? "current" : event.status === "done" ? "done" : "";
          return `<li class="${state}"><strong>${escapeHtml(event.title)}</strong>${escapeHtml(event.description ?? "")} <span class="small muted">${escapeHtml(dateLabel(event.occurredAt))}</span></li>`;
        })
        .join("")
    : `<li><strong>No timeline events yet</strong>Order events will appear here as the order progresses.</li>`;

  const rows = items.length
    ? items
        .map(
          (item) => `
        <tr>
          <td><div class="product-cell"><div class="thumb">${escapeHtml((item.sku ?? "SKU").slice(0, 3))}</div><div><div class="product-name">${escapeHtml(item.sku ?? "Unnamed SKU")}</div><div class="product-meta">${escapeHtml(item.title)}</div></div></div></td>
          <td>${escapeHtml(item.supplierName ?? "-")}</td>
          <td>${item.quantity}</td>
          <td>${money(item.unitCost)}</td>
          <td><span class="badge badge-${riskTone(item.riskLevel)}">${escapeHtml(titleCase(item.riskLevel))}</span></td>
          <td><span class="badge badge-${qcTone(item.qcStatus)}">${escapeHtml(titleCase(item.qcStatus))}</span></td>
          <td>${item.actionRequired ? '<span class="badge badge-danger">Required</span>' : '<span class="small muted">None</span>'}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="7" style="text-align:center;padding:28px"><span class="small muted">No SKU records for this order yet.</span></td></tr>`;

  const qcList = items.flatMap((item) => item.qcRecords.map((record) => ({ ...record, sku: item.sku ?? "SKU" })));
  qcList.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  const qcRows = qcList.length
    ? qcList
        .map(
          (record) => `
        <li><span><strong>${escapeHtml(record.sku)}</strong><br><span class="small muted">${escapeHtml(record.notes ?? "No QC notes")}${record.inspector ? ` / ${escapeHtml(record.inspector)}` : ""}</span></span><span><span class="badge badge-${qcTone(record.status)}">${escapeHtml(titleCase(record.status))}</span><br><span class="small muted">${escapeHtml(dateLabel(record.createdAt))}</span></span></li>`
        )
        .join("")
    : `<li><span class="small muted">No QC records yet.</span></li>`;

  const supplierRows = supplierMap.size
    ? Array.from(supplierMap.entries())
        .map(
          ([name, stat]) =>
            `<li><span><strong>${escapeHtml(name)}</strong><br><span class="small muted">${stat.skus} SKUs / ${stat.units.toLocaleString()} units</span></span></li>`
        )
        .join("")
    : `<li><span class="small muted">No suppliers linked yet.</span></li>`;

  return `
  <header class="app-header">
    <div class="app-title">
      <span class="eyebrow" style="margin-bottom:8px">Order detail</span>
      <h1>Order ${escapeHtml(data.code)}</h1>
      <p>${escapeHtml(data.destination ?? "Destination pending")} / ${data.supplierCount} suppliers / ${data.units.toLocaleString()} units</p>
    </div>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <span class="badge badge-${orderTone(data.status)}">${escapeHtml(titleCase(data.status))}</span>
      <strong>ETA ${escapeHtml(dateLabel(data.eta))}</strong>
    </div>
  </header>

  <section class="card flat" style="margin-top:18px">
    <div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:12px">
      <strong>Progress ${Math.max(0, Math.min(100, data.progress))}%</strong>
      <span class="small muted">Updated ${escapeHtml(dateLabel(data.updatedAt))}</span>
    </div>
    <div class="progress" style="height:10px"><div class="progress-bar" style="width:${Math.max(0, Math.min(100, data.progress))}%"></div></div>
  </section>

  <section class="kpi-band" style="margin-top:24px">
    <article class="mini-card"><span class="kpi-label">SKUs</span><div class="kpi-value">${data.skuCount}</div><div class="kpi-sub">${passed} passed</div></article>
    <article class="mini-card"><span class="kpi-label">Units</span><div class="kpi-value">${data.units.toLocaleString()}</div><div class="kpi-sub">${items.length} line items</div></article>
    <article class="mini-card"><span class="kpi-label">Landed cost</span><div class="kpi-value">${money(data.landedValue)}</div><div class="kpi-sub">Order total</div></article>
    <article class="mini-card"><span class="kpi-label">Suppliers</span><div class="kpi-value">${data.supplierCount}</div><div class="kpi-sub">${supplierMap.size} linked</div></article>
    <article class="mini-card"><span class="kpi-label">Risks</span><div class="kpi-value">${highRisk + mediumRisk}</div><div class="kpi-sub">${highRisk} high / ${mediumRisk} medium</div></article>
  </section>

  <section class="split-grid" style="margin-top:24px">
    <div class="app-main">
      <article class="card flat">
        <div class="card-title"><h3>Order status</h3><span class="badge badge-info">Live</span></div>
        <ul class="timeline">${timeline}</ul>
      </article>

      <article class="table-wrap" style="margin-top:24px">
        <div class="card-title" style="padding:20px"><h3>SKU procurement list</h3><span class="badge badge-warning">${passed}/${items.length} passed</span></div>
        <div class="table-scroll">
          <table class="table">
            <thead><tr><th>SKU</th><th>Supplier</th><th>Qty</th><th>Unit</th><th>Risk</th><th>QC</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </article>

      <article class="card flat" style="margin-top:24px">
        <div class="card-title"><h3>QC records</h3><span class="badge badge-info">${data.qcRecordCount} records</span></div>
        <ul class="panel-list">${qcRows}</ul>
      </article>
    </div>

    <aside class="app-main">
      <article class="card flat summary-card">
        <div class="card-title"><h3>Cost breakdown</h3><span class="badge badge-neutral">Order data</span></div>
        <ul class="panel-list">
          <li><span>Goods cost</span><strong>${money(goodsCost)}</strong></li>
          <li><span>Fees, freight and duties</span><strong>${money(otherCost)}</strong></li>
        </ul>
        <div class="total-row"><span>Total landed</span><span>${money(data.landedValue)}</span></div>
      </article>

      <article class="card flat" style="margin-top:24px">
        <div class="card-title"><h3>QC summary</h3></div>
        <ul class="panel-list">
          <li><span>Passed</span><strong>${passed}</strong></li>
          <li><span>Pending</span><strong>${pending}</strong></li>
          <li><span>Needs action</span><strong>${needsAction}</strong></li>
        </ul>
      </article>

      <article class="card flat" style="margin-top:24px">
        <div class="card-title"><h3>Suppliers</h3><span class="badge badge-success">${supplierMap.size} linked</span></div>
        <ul class="panel-list">${supplierRows}</ul>
      </article>

      <article class="notice info" style="margin-top:24px"><span>i</span><span>This view is generated from your live orders, order items and QC records.</span></article>
    </aside>
  </section>`;
}

function resetLookupButton() {
  const button = document.querySelector<HTMLButtonElement>("#guest-lookup-form button[type=submit]");
  if (button) {
    button.disabled = false;
    button.textContent = "View order detail";
  }
}

export default function TrackPage() {
  const lookup = useMutation({
    mutationFn: (payload: TrackRequest) => postJson<TrackResponse>("/api/track", payload),
    onSuccess: (data) => {
      const errorBox = document.getElementById("lookup-error");
      const result = document.getElementById("guest-order-result");
      const root = document.getElementById("order-detail-root");
      if (errorBox) errorBox.classList.add("hidden");
      if (root) root.innerHTML = renderOrderDetail(data);
      if (result) {
        result.classList.remove("hidden");
        result.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      resetLookupButton();
    },
    onError: (error: Error) => {
      const errorBox = document.getElementById("lookup-error");
      const text = document.getElementById("lookup-error-text");
      if (text) text.textContent = error.message;
      if (errorBox) errorBox.classList.remove("hidden");
      document.getElementById("guest-order-result")?.classList.add("hidden");
      resetLookupButton();
    }
  });

  useEffect(() => {
    document.title = "Track order - SourcingRelay";
    const form = document.getElementById("guest-lookup-form") as HTMLFormElement | null;
    const handler = (event: Event) => {
      event.preventDefault();
      const code = (document.getElementById("lookup-order") as HTMLInputElement | null)?.value.trim().toUpperCase() ?? "";
      const email = (document.getElementById("lookup-email") as HTMLInputElement | null)?.value.trim().toLowerCase() ?? "";
      if (!code || !EMAIL_PATTERN.test(email)) {
        const text = document.getElementById("lookup-error-text");
        if (text) text.textContent = "Enter a valid order number and quote email.";
        document.getElementById("lookup-error")?.classList.remove("hidden");
        document.getElementById("guest-order-result")?.classList.add("hidden");
        return;
      }
      const button = form?.querySelector<HTMLButtonElement>("button[type=submit]");
      if (button) {
        button.disabled = true;
        button.textContent = "Searching...";
      }
      lookup.mutate({ code, email });
    };
    form?.addEventListener("submit", handler);
    return () => form?.removeEventListener("submit", handler);
  }, [lookup.mutate]);

  return <StaticPage title="Track order - SourcingRelay" description="Track your SourcingRelay order as a guest using your order number and quote email." html={html} />;
}
