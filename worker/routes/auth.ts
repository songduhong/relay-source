import { Hono } from "hono";
import { z } from "zod";
import { type Env, type UserRow } from "../types";
import { clearSessionCookie, createSession, createSessionCookie, deleteSession, getSessionUser, hashPassword, readSessionId, verifyPassword } from "../lib/session";



const registerSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
  company: z.string().max(160).optional(),
  salesChannel: z.string().max(80).optional()
});

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200)
});

export const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.post("/register", async (context) => {
  const parsed = registerSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) return context.json({ message: "Please provide a valid email and password with at least 8 characters." }, 400);
  const { email, password, name, company, salesChannel } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const existing = await context.env.DB.prepare("SELECT id FROM users WHERE lower(email) = lower(?)").bind(normalizedEmail).first();
  if (existing) return context.json({ message: "An account with this email already exists." }, 409);
  const id = `usr_${crypto.randomUUID()}`;
  const passwordHash = await hashPassword(password);
  await context.env.DB.prepare(`
    INSERT INTO users (id, email, password_hash, name, company, sales_channel, role)
    VALUES (?, ?, ?, ?, ?, ?, 'customer')
  `).bind(id, normalizedEmail, passwordHash, name ?? null, company ?? null, salesChannel ?? null).run();
  const sessionId = await createSession(context.env, id);
  createSessionCookie(context, sessionId);
  const user = await context.env.DB.prepare("SELECT id, email, name, company, sales_channel, role, created_at FROM users WHERE id = ?").bind(id).first();
  return context.json({ user }, 201);
});

authRoutes.post("/login", async (context) => {
  const parsed = loginSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) return context.json({ message: "Email and password are required." }, 400);
  const normalizedEmail = parsed.data.email.toLowerCase();
  const user = await context.env.DB.prepare("SELECT * FROM users WHERE lower(email) = lower(?)").bind(normalizedEmail).first<UserRow>();
  const valid = user?.password_hash ? await verifyPassword(parsed.data.password, user.password_hash) : false;
  if (!user || !valid) return context.json({ message: "Email or password is incorrect." }, 401);
  const sessionId = await createSession(context.env, user.id);
  createSessionCookie(context, sessionId);
  const { password_hash: _ignored, ...safeUser } = user;
  return context.json({ user: safeUser });
});

authRoutes.post("/logout", async (context) => {
  const sessionId = readSessionId(context);
  await deleteSession(context.env, sessionId);
  clearSessionCookie(context);
  return context.json({ ok: true });
});

authRoutes.get("/me", async (context) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  return context.json({ user });
});


