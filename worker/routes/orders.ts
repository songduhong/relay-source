import { Hono } from "hono";
import { z } from "zod";
import { type Env } from "../types";
import { getSessionUser } from "../lib/session";
import { readSessionId } from "../lib/session";

export const orderRoutes = new Hono<{ Bindings: Env }>();

function requireUser(user: unknown) {
  return Boolean(user);
}

orderRoutes.get("/", async (context) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  if (!requireUser(user)) return context.json({ message: "Sign in required." }, 401);
  const binds = user!.role === "admin" ? [] : [user!.id, user!.email.toLowerCase()];
  const where = user!.role === "admin" ? "" : "WHERE user_id = ? OR lower(email) = lower(?)";
  const result = await context.env.DB.prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 100`).bind(...binds).all();
  return context.json({ orders: result.results });
});

orderRoutes.get("/:code", async (context) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  if (!user) return context.json({ message: "Sign in required." }, 401);
  const order = await context.env.DB.prepare("SELECT * FROM orders WHERE upper(code) = upper(?)").bind(context.req.param("code")).first();
  if (!order) return context.json({ message: "Order not found." }, 404);
  const owned = user.role === "admin" || order.user_id === user.id || String(order.email).toLowerCase() === user.email.toLowerCase();
  if (!owned) return context.json({ message: "You do not have access to this order." }, 403);
  const [items, events, documents] = await Promise.all([
    context.env.DB.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at").bind(order.id).all(),
    context.env.DB.prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY occurred_at").bind(order.id).all(),
    context.env.DB.prepare("SELECT * FROM images WHERE entity_type = 'order' AND entity_id = ? ORDER BY created_at").bind(order.id).all()
  ]);
  return context.json({ order, items: items.results, events: events.results, documents: documents.results });
});

const statusSchema = z.object({
  status: z.enum(["submitted", "sourcing", "in_qc", "packing", "shipped", "delivered", "action_required"]),
  progress: z.number().int().min(0).max(100).optional(),
  eta: z.string().max(40).optional()
});

export const adminOrderRoutes = new Hono<{ Bindings: Env }>();

adminOrderRoutes.use("*", async (context, next) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  if (!user || user.role !== "admin") return context.json({ message: "Admin access required." }, 403);
  await next();
});

adminOrderRoutes.patch("/:code", async (context) => {
  const parsed = statusSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) return context.json({ message: "Invalid order status." }, 400);
  const order = await context.env.DB.prepare("SELECT id FROM orders WHERE upper(code) = upper(?)").bind(context.req.param("code")).first();
  if (!order) return context.json({ message: "Order not found." }, 404);
  await context.env.DB.prepare("UPDATE orders SET status = ?, progress = COALESCE(?, progress), eta = COALESCE(?, eta), updated_at = datetime('now') WHERE id = ?")
    .bind(parsed.data.status, parsed.data.progress ?? null, parsed.data.eta ?? null, order.id).run();
  return context.json({ ok: true });
});

