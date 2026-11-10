import { Hono } from "hono";
import { z } from "zod";
import { type Env } from "../types";

const trackSchema = z.object({
  code: z.string().min(3).max(40),
  email: z.string().email().max(200)
});

type OrderRow = {
  id: string;
  code: string;
  status: string;
  progress: number;
  destination: string | null;
  eta: string | null;
  sku_count: number;
  supplier_count: number;
  unit_count: number;
  landed_value: number;
  created_at: string;
  updated_at: string;
};

type ItemRow = {
  id: string;
  sku: string | null;
  title: string;
  product_type: string | null;
  quantity: number;
  unit_cost: number | null;
  qc_status: string;
  risk_level: string;
  supplier_name: string | null;
  status: string;
  action_required: number;
};

type QcRow = {
  id: string;
  order_item_id: string;
  status: string;
  notes: string | null;
  inspector: string | null;
  created_at: string;
};

type EventRow = {
  stage: string;
  title: string;
  description: string | null;
  status: string;
  occurred_at: string;
};

export const trackRoutes = new Hono<{ Bindings: Env }>();

trackRoutes.post("/", async (context) => {
  const parsed = trackSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) return context.json({ message: "A valid order number and quote email are required." }, 400);
  const { code, email } = parsed.data;

  const order = await context.env.DB.prepare(
    "SELECT id, code, status, progress, destination, eta, sku_count, supplier_count, unit_count, landed_value, created_at, updated_at FROM orders WHERE upper(code) = upper(?) AND lower(email) = lower(?) LIMIT 1"
  ).bind(code.trim(), email.trim()).first<OrderRow>();
  if (!order) return context.json({ message: "No matching order was found for that order number and email." }, 404);

  const [events, items, qcRecords] = await Promise.all([
    context.env.DB.prepare(
      "SELECT stage, title, description, status, occurred_at FROM order_events WHERE order_id = ? ORDER BY occurred_at"
    ).bind(order.id).all<EventRow>(),
    context.env.DB.prepare(
      "SELECT id, sku, title, product_type, quantity, unit_cost, qc_status, risk_level, supplier_name, status, action_required FROM order_items WHERE order_id = ? ORDER BY sku"
    ).bind(order.id).all<ItemRow>(),
    context.env.DB.prepare(
      "SELECT q.id, q.order_item_id, q.status, q.notes, q.inspector, q.created_at FROM qc_records q JOIN order_items i ON i.id = q.order_item_id WHERE i.order_id = ? ORDER BY q.created_at DESC"
    ).bind(order.id).all<QcRow>()
  ]);

  const qcByItem = new Map<string, QcRow[]>();
  for (const record of qcRecords.results) {
    const list = qcByItem.get(record.order_item_id) ?? [];
    list.push(record);
    qcByItem.set(record.order_item_id, list);
  }

  const itemList = items.results.map((item) => ({
    id: item.id,
    sku: item.sku,
    title: item.title,
    productType: item.product_type,
    quantity: item.quantity,
    unitCost: item.unit_cost,
    qcStatus: item.qc_status,
    riskLevel: item.risk_level,
    supplierName: item.supplier_name,
    status: item.status,
    actionRequired: Boolean(item.action_required),
    qcRecords: (qcByItem.get(item.id) ?? []).map((record) => ({
      id: record.id,
      status: record.status,
      notes: record.notes,
      inspector: record.inspector,
      createdAt: record.created_at
    }))
  }));

  return context.json({
    code: order.code,
    status: order.status,
    progress: order.progress,
    destination: order.destination,
    eta: order.eta,
    skuCount: order.sku_count,
    supplierCount: order.supplier_count,
    units: order.unit_count,
    landedValue: order.landed_value,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    timeline: events.results.map((event) => ({
      stage: event.stage,
      title: event.title,
      description: event.description,
      status: event.status,
      occurredAt: event.occurred_at
    })),
    items: itemList,
    qcRecordCount: qcRecords.results.length
  });
});
