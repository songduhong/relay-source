import { type Context } from "hono";
import { type Env, type UserRow } from "../types";

const SESSION_TTL = 30 * 24 * 60 * 60;
const ITERATIONS = 100_000;

function toBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, keyMaterial, 256);
  return `pbkdf2$${ITERATIONS}$${toBase64(salt)}$${toBase64(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsText, saltText, hashText] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterationsText || !saltText || !hashText) return false;
  const iterations = Number(iterationsText);
  if (!Number.isFinite(iterations) || iterations < 50_000) return false;
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromBase64(saltText), iterations, hash: "SHA-256" }, keyMaterial, 256);
  const expected = fromBase64(hashText);
  const actual = new Uint8Array(bits);
  if (expected.length !== actual.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) mismatch |= expected[index] ^ actual[index];
  return mismatch === 0;
}

function isLocal(context: Context<{ Bindings: Env }>) {
  const host = new URL(context.req.raw.url).hostname;
  return host === "127.0.0.1" || host === "localhost";
}

export function createSessionCookie(context: Context<{ Bindings: Env }>, sessionId: string) {
  const secure = isLocal(context) ? "" : "; Secure";
  context.header("Set-Cookie", `relay_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL}${secure}`);
}

export function clearSessionCookie(context: Context<{ Bindings: Env }>) {
  const secure = isLocal(context) ? "" : "; Secure";
  context.header("Set-Cookie", `relay_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

export function readSessionId(context: Context<{ Bindings: Env }>): string | null {
  const cookie = context.req.header("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)relay_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function createSession(env: Env, userId: string): Promise<string> {
  const id = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const expires = new Date(Date.now() + SESSION_TTL * 1000).toISOString();
  await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(id, userId, expires).run();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  return id;
}

export async function getSessionUser(env: Env, sessionId: string | null): Promise<UserRow | null> {
  if (!sessionId) return null;
  const result = await env.DB.prepare(`
    SELECT u.id, u.email, u.name, u.company, u.sales_channel, u.role, u.created_at
    FROM sessions s
    INNER JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND s.expires_at > datetime('now')
    LIMIT 1
  `).bind(sessionId).first<UserRow>();
  return result || null;
}

export async function deleteSession(env: Env, sessionId: string | null): Promise<void> {
  if (!sessionId) return;
  await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

