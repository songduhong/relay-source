export type ApiUser = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  role: "customer" | "admin";
};

export type QuoteRequest = {
  email: string;
  name?: string;
  company?: string;
  destination?: string;
  salesChannel?: string;
  shippingMethod?: string;
  launchDate?: string;
  targetPrice?: string;
  quantityRange?: string;
  notes?: string;
  categoryCount?: number;
};

export type QuoteResponse = {
  code: string;
  status: string;
  message: string;
};

export type TrackRequest = {
  code: string;
  email: string;
};

export type TrackResponse = {
  code: string;
  status: string;
  progress: number;
  destination: string;
  eta: string;
  skuCount: number;
  supplierCount: number;
  units: number;
  timeline: { stage: string; title: string; description?: string; occurredAt: string }[];
};

export async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }
  return data;
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Request failed.");
  }
  return (await response.json()) as T;
}
