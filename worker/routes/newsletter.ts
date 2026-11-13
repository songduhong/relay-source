import { Hono } from "hono";
import { z } from "zod";
import { type Env } from "../types";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(80).optional()
});

export const newsletterRoutes = new Hono<{ Bindings: Env }>();

newsletterRoutes.post("/subscribe", async (context) => {
  const parsed = subscribeSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) {
    return context.json({ message: "Please enter a valid email address." }, 400);
  }

  const { email } = parsed.data;
  const source = parsed.data.source || "blog";
  const now = new Date().toISOString();
  const id = `sub_${crypto.randomUUID()}`;

  try {
    await context.env.DB.prepare(`
      INSERT INTO newsletter_subscribers (id, email, source, status, consent_at)
      VALUES (?, ?, ?, 'subscribed', ?)
      ON CONFLICT(email) DO UPDATE SET
        source = excluded.source,
        status = 'subscribed',
        consent_at = excluded.consent_at,
        unsubscribed_at = NULL,
        updated_at = datetime('now')
    `).bind(id, email, source, now).run();
  } catch {
    return context.json({ message: "Could not save your subscription. Please try again." }, 500);
  }

  return context.json({
    subscribed: true,
    message: "You are subscribed. Look out for the next Shenzhen field note."
  }, 201);
});
