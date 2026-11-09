import { Hono } from "hono";
import { z } from "zod";
import { type Env } from "../types";

const trackSchema = z.object({
  code: z.string().min(3).max(40),
  email: z.string().email().max(200)
});

export const trackRoutes = new Hono<{ Bindings: Env }>();

trackRoutes.post("/", async (context) => {
  const parsed = trackSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) return context.json({ message: "A valid order number and quote email are required." }, 400);
  const { code, email } = parsed.data;
  const order = await context.env.DB.prepare(
    "SELECT id, code, status, progress, destination, eta, sku_count, supplier_count, unit_count FROM orders WHERE upper(code) = upper(?) AND lower(email) = lower(?) LIMIT 1"
  ).bind(code.trim(), email.trim()).first();
  if (!order) return context.json({ message: "No matching order was found." }, 404);
  const events = await context.env.DB.prepare(
    "SELECT stage, title, description, status, occurred_at FROM order_events WHERE order_id = ? ORDER BY occurred_at"
  ).bind(order.id).all();
  return context.json({
    code: order.code,
    status: order.status,
    progress: order.progress,
    destination: order.destination,
    eta: order.eta,
    skuCount: order.sku_count,
    supplierCount: order.supplier_count,
    units: order.unit_count,
    timeline: events.results
  });
});

