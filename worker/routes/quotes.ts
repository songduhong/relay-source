import { Hono } from "hono";
import { z } from "zod";
import { type Env } from "../types";
import { getSessionUser } from "../lib/session";
import { readSessionId } from "../lib/session";

const quoteSchema = z.object({
  email: z.string().email().max(200),
  name: z.string().max(120).optional(),
  launchDate: z.string().max(40).optional(),
  notes: z.string().max(4000).optional(),
  attachmentId: z.string().uuid().optional()
});

const allowedExtensions = new Map<string, string>([
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["xls", "application/vnd.ms-excel"],
  ["csv", "text/csv"],
  ["pdf", "application/pdf"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["gif", "image/gif"]
]);
const maxUploadSize = 10 * 1024 * 1024;

export const quoteRoutes = new Hono<{ Bindings: Env }>();

quoteRoutes.post("/upload", async (context) => {
  const form = await context.req.formData().catch(() => null);
  if (!form) return context.json({ message: "A file is required." }, 400);
  const file = form.get("file");
  if (!(file instanceof File)) return context.json({ message: "A file is required." }, 400);
  if (file.size === 0) return context.json({ message: "The uploaded file is empty." }, 400);
  if (file.size > maxUploadSize) return context.json({ message: "Files must be 10 MB or smaller." }, 400);

  const extension = (file.name.split(".").pop() || "").toLowerCase();
  const contentType = allowedExtensions.get(extension);
  if (!contentType) {
    return context.json({ message: "Only XLSX, XLS, CSV, PDF, JPG, PNG, WEBP or GIF files are supported." }, 400);
  }

  const user = await getSessionUser(context.env, readSessionId(context));
  const imageId = crypto.randomUUID();
  const r2Key = `quotes/pending/${imageId}.${extension}`;
  await context.env.IMAGES.put(r2Key, file.stream(), { httpMetadata: { contentType } });
  try {
    await context.env.DB.prepare(`
      INSERT INTO images (id, r2_key, mime_type, size, entity_type, entity_id, uploaded_by)
      VALUES (?, ?, ?, ?, 'quote', 'pending', ?)
    `).bind(imageId, r2Key, contentType, file.size, user?.id ?? null).run();
  } catch {
    await context.env.IMAGES.delete(r2Key);
    return context.json({ message: "Could not save the uploaded file. Please try again." }, 500);
  }
  return context.json({ id: imageId, name: file.name, size: file.size, mimeType: contentType }, 201);
});

quoteRoutes.delete("/upload/:id", async (context) => {
  const image = await context.env.DB.prepare(
    "SELECT id, r2_key, entity_type FROM images WHERE id = ?"
  ).bind(context.req.param("id")).first<{ id: string; r2_key: string; entity_type: string }>();
  if (!image || image.entity_type !== "quote") {
    return context.json({ message: "Uploaded file not found." }, 404);
  }
  const attached = await context.env.DB.prepare(
    "SELECT id FROM quotes WHERE attachment_id = ? LIMIT 1"
  ).bind(image.id).first();
  if (attached) {
    return context.json({ message: "This file is already attached to a submitted quote." }, 409);
  }
  await context.env.IMAGES.delete(image.r2_key);
  await context.env.DB.prepare("DELETE FROM images WHERE id = ?").bind(image.id).run();
  return context.json({ ok: true });
});

quoteRoutes.post("/", async (context) => {
  const parsed = quoteSchema.safeParse(await context.req.json().catch(() => ({})));
  if (!parsed.success) {
    return context.json({ message: "Please provide a valid work email and your sourcing requirement." }, 400);
  }
  const data = parsed.data;
  const notes = data.notes?.trim() ?? "";
  const attachmentId = data.attachmentId ?? null;

  if (!attachmentId && notes.length < 10) {
    return context.json({ message: "Please upload a buy list file or describe your sourcing requirement in at least 10 characters." }, 400);
  }

  if (attachmentId) {
    const image = await context.env.DB.prepare(
      "SELECT id, entity_type FROM images WHERE id = ?"
    ).bind(attachmentId).first<{ id: string; entity_type: string }>();
    if (!image || image.entity_type !== "quote") {
      return context.json({ message: "The uploaded file could not be found. Please upload it again." }, 400);
    }
    const existing = await context.env.DB.prepare(
      "SELECT id FROM quotes WHERE attachment_id = ? LIMIT 1"
    ).bind(attachmentId).first();
    if (existing) {
      return context.json({ message: "This file is already attached to another quote." }, 409);
    }
  }

  const user = await getSessionUser(context.env, readSessionId(context));
  const id = `quote_${crypto.randomUUID()}`;
  const short = crypto.randomUUID().replace(/\D/g, "").slice(0, 6).padEnd(6, "0");
  const code = `RS-${new Date().getFullYear()}-${short}`;
  const result = await context.env.DB.prepare(`
    INSERT INTO quotes (id, code, email, name, status, launch_date, attachment_id, notes, user_id)
    VALUES (?, ?, ?, ?, 'submitted', ?, ?, ?, ?)
  `).bind(
    id,
    code,
    data.email.toLowerCase(),
    data.name?.trim() || null,
    data.launchDate?.trim() || null,
    attachmentId,
    notes || null,
    user?.id ?? null
  ).run();
  if (!result.success) {
    return context.json({ message: "Could not save your quote. Please try again." }, 500);
  }

  if (attachmentId) {
    await context.env.DB.prepare("UPDATE images SET entity_id = ? WHERE id = ?").bind(id, attachmentId).run();
  }

  return context.json({
    code,
    status: "submitted",
    message: `Quote ${code} received. Our sourcing team will reply within 48 hours.`,
    attachmentId
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
