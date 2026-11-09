import { Hono } from "hono";
import { z } from "zod";
import { type Env } from "../types";
import { getSessionUser } from "../lib/session";
import { readSessionId } from "../lib/session";

const quoteSchema = z.object({
  email: z.string().email().max(200),
  name: z.string().max(120).optional(),
  company: z.string().max(160).optional(),
  destination: z.string().max(120).optional(),
  salesChannel: z.string().max(80).optional(),
  shippingMethod: z.string().max(80).optional(),
  launchDate: z.string().max(40).optional(),
  targetPrice: z.string().max(60).optional(),
  quantityRange: z.string().max(60).optional(),
  notes: z.string().max(4000).optional(),
  categoryCount: z.number().int().min(0).max(20).optional(),
  hasAttachment: z.boolean().optional()
});

export const quoteRoutes = new Hono<{ Bindings: Env }>();

quoteRoutes.post("/", async (context) => {
  const parsed = quoteSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) return context.json({ message: "Please provide a valid work email and buy-list requirement." }, 400);
  const data = parsed.data;
  if (!data.hasAttachment && (!data.notes || data.notes.trim().length < 10)) {
    return context.json({ message: "Please upload a buy list file or describe your sourcing requirement." }, 400);
  }
  const user = await getSessionUser(context.env, readSessionId(context));
  const id = `quote_${crypto.randomUUID()}`;
  const short = crypto.randomUUID().replace(/\D/g, "").slice(0, 6).padEnd(6, "0");
  const code = `RS-${new Date().getFullYear()}-${short}`;
  const result = await context.env.DB.prepare(`
    INSERT INTO quotes (
      id, code, email, name, company, destination, sales_channel, shipping_method,
      launch_date, target_price, quantity_range, notes, category_count, has_attachment, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, code, data.email.toLowerCase(), data.name ?? null, data.company ?? null,
    data.destination ?? null, data.salesChannel ?? null, data.shippingMethod ?? null,
    data.launchDate ?? null, data.targetPrice ?? null, data.quantityRange ?? null,
    data.notes ?? null, data.categoryCount ?? 0, data.hasAttachment ? 1 : 0, user?.id ?? null
  ).run();
  if (!result.success) return context.json({ message: "Could not save your quote. Please try again." }, 500);
  return context.json({
    code,
    status: "submitted",
    message: `Quote ${code} received. Our sourcing team will reply within 48 hours.`
  }, 201);
});

quoteRoutes.get("/", async (context) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  if (!user) return context.json({ message: "Sign in required." }, 401);
  const binds: string[] = [];
  let where = "";
  if (user.role !== "admin") {
    where = "WHERE user_id = ? OR lower(email) = lower(?)";
    binds.push(user.id, user.email);
  }
  const result = await context.env.DB.prepare(`SELECT * FROM quotes ${where} ORDER BY created_at DESC LIMIT 100`).bind(...binds).all();
  return context.json({ quotes: result.results });
});

quoteRoutes.get("/:code", async (context) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  if (!user) return context.json({ message: "Sign in required." }, 401);
  const quote = await context.env.DB.prepare("SELECT * FROM quotes WHERE upper(code) = upper(?)").bind(context.req.param("code")).first();
  if (!quote) return context.json({ message: "Quote not found." }, 404);
  const owned = user.role === "admin" || quote.user_id === user.id || String(quote.email).toLowerCase() === user.email.toLowerCase();
  if (!owned) return context.json({ message: "You do not have access to this quote." }, 403);
  const items = await context.env.DB.prepare("SELECT * FROM quote_items WHERE quote_id = ? ORDER BY created_at").bind(quote.id).all();
  return context.json({ quote, items: items.results });
});

