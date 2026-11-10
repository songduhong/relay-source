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
  launchDate?: string;
  notes?: string;
  attachmentId?: string;
};

export type QuoteUploadResponse = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
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

export type TrackQcRecord = {
  id: string;
  status: string;
  notes: string | null;
  inspector: string | null;
  createdAt: string;
};

export type TrackItem = {
  id: string;
  sku: string | null;
  title: string;
  productType: string | null;
  quantity: number;
  unitCost: number | null;
  qcStatus: string;
  riskLevel: string;
  supplierName: string | null;
  status: string;
  actionRequired: boolean;
  qcRecords: TrackQcRecord[];
};

export type TrackResponse = {
  code: string;
  status: string;
  progress: number;
  destination: string | null;
  eta: string | null;
  skuCount: number;
  supplierCount: number;
  units: number;
  landedValue: number;
  createdAt: string;
  updatedAt: string;
  timeline: { stage: string; title: string; description: string | null; status: string; occurredAt: string }[];
  items: TrackItem[];
  qcRecordCount: number;
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
