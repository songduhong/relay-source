export type Env = {
  DB: D1Database;
  IMAGES: R2Bucket;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

export type UserRow = {
  id: string;
  email: string;
  password_hash?: string;
  name: string | null;
  company: string | null;
  sales_channel: string | null;
  role: "customer" | "admin";
  created_at: string;
};

