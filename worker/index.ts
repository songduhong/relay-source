import { Hono } from "hono";
import { type Env } from "./types";
import { authRoutes } from "./routes/auth";
import { quoteRoutes } from "./routes/quotes";
import { trackRoutes } from "./routes/tracking";
import { orderRoutes, adminOrderRoutes } from "./routes/orders";
import { imageRoutes } from "./routes/images";

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (context, next) => {
  await next();
  context.header("X-Content-Type-Options", "nosniff");
  context.header("Referrer-Policy", "strict-origin-when-cross-origin");
  context.header("X-Frame-Options", "DENY");
});

app.get("/api/health", (context) => context.json({ status: "ok", service: "relaysource", timestamp: new Date().toISOString() }));
app.route("/api/auth", authRoutes);
app.route("/api/quotes", quoteRoutes);
app.route("/api/track", trackRoutes);
app.route("/api/orders", orderRoutes);
app.route("/api/admin/orders", adminOrderRoutes);
app.route("/api/images", imageRoutes);

app.all("/api/*", (context) => context.json({ message: "API endpoint not found." }, 404));
app.all("*", (context) => context.env.ASSETS.fetch(context.req.raw));

export default app;


