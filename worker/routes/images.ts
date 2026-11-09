import { Hono } from "hono";
import { type Env } from "../types";
import { getSessionUser } from "../lib/session";
import { readSessionId } from "../lib/session";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 5 * 1024 * 1024;

export const imageRoutes = new Hono<{ Bindings: Env }>();

imageRoutes.post("/admin", async (context) => {
  const user = await getSessionUser(context.env, readSessionId(context));
  if (!user || user.role !== "admin") return context.json({ message: "Admin access required." }, 403);
  const form = await context.req.formData();
  const file = form.get("file");
  const entityType = String(form.get("entityType") || "");
  const entityId = String(form.get("entityId") || "");
  if (!(file instanceof File)) return context.json({ message: "A file is required." }, 400);
  if (!allowedTypes.has(file.type)) return context.json({ message: "Only JPEG, PNG or WebP images are supported." }, 400);
  if (file.size > maxSize) return context.json({ message: "Images must be 5 MB or smaller." }, 400);
  if (!["order", "quote", "product"].includes(entityType) || !entityId) return context.json({ message: "A valid image target is required." }, 400);
  const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const imageId = crypto.randomUUID();
  const r2Key = `${entityType}s/${entityId}/${imageId}.${extension}`;
  await context.env.IMAGES.put(r2Key, file.stream(), { httpMetadata: { contentType: file.type } });
  await context.env.DB.prepare(`
    INSERT INTO images (id, r2_key, mime_type, size, entity_type, entity_id, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(imageId, r2Key, file.type, file.size, entityType, entityId, user.id).run();
  return context.json({ id: imageId, url: `/api/images/${imageId}` }, 201);
});

imageRoutes.get("/:id", async (context) => {
  const record = await context.env.DB.prepare("SELECT r2_key, mime_type FROM images WHERE id = ?").bind(context.req.param("id")).first<{ r2_key: string; mime_type: string }>();
  if (!record) return context.json({ message: "Image not found." }, 404);
  const object = await context.env.IMAGES.get(record.r2_key);
  if (!object) return context.json({ message: "Image not found." }, 404);
  const headers = new Headers({
    "Content-Type": record.mime_type,
    "Cache-Control": "public, max-age=31536000, immutable"
  });
  return new Response(object.body, { headers });
});

