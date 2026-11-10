export type OrderStatus = "active" | "action" | "shipped" | "delivered";

export type OrderItem = {
  sku: string;
  title: string;
  supplier: string;
  quantity: number;
  landed: string;
  risk: "Low" | "Medium" | "High";
  qc: string;
  action: string;
};

export type OrderMilestone = {
  label: string;
  meta: string;
  state: "done" | "active" | "pending";
};

export type DemoOrder = {
  code: string;
  destination: string;
  updated: string;
  eta: string;
  status: OrderStatus;
  statusLabel: string;
  progress: number;
  skus: number;
  units: number;
  cartons: number;
  risks: string;
  landed: string;
  items: OrderItem[];
  milestones: OrderMilestone[];
  costs: { label: string; value: string }[];
  documents: { label: string; status: string; tone: "success" | "warning" | "danger" }[];
  suppliers: { name: string; meta: string; status: string; tone: "success" | "warning" | "danger" }[];
  notice?: string;
};

export const demoOrders: DemoOrder[] = [
  {
    code: "SH-2451",
    destination: "Los Angeles, US",
    updated: "Nov 30",
    eta: "Dec 18",
    status: "active",
    statusLabel: "In QC",
    progress: 68,
    skus: 36,
    units: 1520,
    cartons: 4,
    risks: "3",
    landed: "$6,438.72",
    items: [
      { sku: "PC-IP15-MAG-001", title: "MagSafe iPhone 15 Pro case", supplier: "Shenzhen CaseLab", quantity: 120, landed: "$4.68", risk: "Low", qc: "Passed", action: "Photos" },
      { sku: "CB-USBC-240-100", title: "240W USB-C cable", supplier: "HQB Cable Hub", quantity: 200, landed: "$2.43", risk: "Medium", qc: "Pending", action: "Inspect" },
      { sku: "CHG-65W-GAN-02", title: "65W GaN charger", supplier: "PowerLine Tech", quantity: 80, landed: "$10.36", risk: "High", qc: "Action needed", action: "Docs" },
      { sku: "STD-MAG-3IN1-01", title: "3-in-1 magnetic stand", supplier: "AccessPoint", quantity: 80, landed: "$9.92", risk: "Medium", qc: "Passed", action: "Approve" },
      { sku: "SPK-MINI-BT-04", title: "Mini Bluetooth speaker", supplier: "Audio Square", quantity: 60, landed: "$6.67", risk: "Medium", qc: "Passed", action: "Photos" }
    ],
    milestones: [
      { label: "Quote approved", meta: "Nov 24", state: "done" },
      { label: "Payment settled", meta: "Nov 24", state: "done" },
      { label: "Supplier collection", meta: "7/8 complete", state: "done" },
      { label: "QC & consolidation", meta: "24/36 passed", state: "active" },
      { label: "DDP dispatch", meta: "ETA Dec 18", state: "pending" }
    ],
    costs: [
      { label: "Goods cost", value: "$3,120.00" },
      { label: "Service fee", value: "$187.20" },
      { label: "Packaging", value: "$145.00" },
      { label: "Domestic freight", value: "$76.00" },
      { label: "International freight", value: "$2,410.00" },
      { label: "Duties & taxes", value: "$523.52" },
      { label: "FBA prep", value: "$177.00" }
    ],
    documents: [
      { label: "Commercial invoice", status: "Ready", tone: "success" },
      { label: "Packing list", status: "Ready", tone: "success" },
      { label: "HS code sheet", status: "Ready", tone: "success" },
      { label: "Battery statement", status: "Missing", tone: "danger" },
      { label: "Supplier invoices", status: "Ready", tone: "success" }
    ],
    suppliers: [
      { name: "Shenzhen CaseLab", meta: "Phone cases · repeat supplier · QC 98%", status: "Received", tone: "success" },
      { name: "HQB Cable Hub", meta: "Cables · spot purchase · QC pending", status: "In QC", tone: "warning" },
      { name: "PowerLine Tech", meta: "Chargers · compliance docs required", status: "Action", tone: "danger" },
      { name: "AccessPoint Shenzhen", meta: "Magnetic stands · version approved", status: "Received", tone: "success" }
    ],
    notice: "High-risk SKU: CHG-65W-GAN-02 requires plug type, certification and battery documentation before dispatch."
  },
  {
    code: "SH-2390",
    destination: "London, UK",
    updated: "Nov 18",
    eta: "Delivered Nov 18",
    status: "delivered",
    statusLabel: "Delivered",
    progress: 100,
    skus: 22,
    units: 840,
    cartons: 3,
    risks: "0",
    landed: "$4,120.55",
    items: [
      { sku: "PC-IP14-CLR-020", title: "Clear iPhone 14 case", supplier: "Shenzhen CaseLab", quantity: 240, landed: "$2.94", risk: "Low", qc: "Passed", action: "Photos" },
      { sku: "CB-USBC-BRAID-03", title: "Braided USB-C cable", supplier: "HQB Cable Hub", quantity: 320, landed: "$1.88", risk: "Low", qc: "Passed", action: "Photos" },
      { sku: "STD-MAG-TRAVEL-01", title: "Foldable MagSafe stand", supplier: "AccessPoint", quantity: 180, landed: "$6.12", risk: "Low", qc: "Passed", action: "Photos" }
    ],
    milestones: [
      { label: "Quote approved", meta: "Oct 18", state: "done" },
      { label: "Payment settled", meta: "Oct 19", state: "done" },
      { label: "Supplier collection", meta: "All received", state: "done" },
      { label: "QC completed", meta: "22/22 passed", state: "done" },
      { label: "Delivered", meta: "Nov 18", state: "done" }
    ],
    costs: [
      { label: "Goods cost", value: "$2,413.10" },
      { label: "Service fee", value: "$144.79" },
      { label: "Packaging", value: "$112.00" },
      { label: "Domestic freight", value: "$58.00" },
      { label: "International freight", value: "$1,102.66" },
      { label: "Duties & taxes", value: "$290.00" }
    ],
    documents: [
      { label: "Commercial invoice", status: "Ready", tone: "success" },
      { label: "Packing list", status: "Ready", tone: "success" },
      { label: "HS code sheet", status: "Ready", tone: "success" },
      { label: "Customs release", status: "Ready", tone: "success" },
      { label: "Supplier invoices", status: "Ready", tone: "success" }
    ],
    suppliers: [
      { name: "Shenzhen CaseLab", meta: "Phone cases · repeat supplier · QC 98%", status: "Completed", tone: "success" },
      { name: "HQB Cable Hub", meta: "Cables · spot purchase · QC passed", status: "Completed", tone: "success" },
      { name: "AccessPoint Shenzhen", meta: "Magnetic stands · QC passed", status: "Completed", tone: "success" }
    ]
  },
  {
    code: "SH-2348",
    destination: "Berlin, DE",
    updated: "Nov 14",
    eta: "Dec 6",
    status: "shipped",
    statusLabel: "Shipped",
    progress: 92,
    skus: 14,
    units: 520,
    cartons: 2,
    risks: "1",
    landed: "$2,948.30",
    items: [
      { sku: "CHG-30W-MINI-01", title: "30W mini GaN charger", supplier: "PowerLine Tech", quantity: 200, landed: "$5.24", risk: "Medium", qc: "Passed", action: "Track" },
      { sku: "CB-LIGHTNING-02", title: "USB-C to Lightning cable", supplier: "HQB Cable Hub", quantity: 220, landed: "$2.15", risk: "Low", qc: "Passed", action: "Track" },
      { sku: "AUDIO-EARBUD-CASE", title: "Protective earbud case", supplier: "Audio Square", quantity: 100, landed: "$3.66", risk: "Low", qc: "Passed", action: "Track" }
    ],
    milestones: [
      { label: "Quote approved", meta: "Oct 28", state: "done" },
      { label: "Payment settled", meta: "Oct 29", state: "done" },
      { label: "Supplier collection", meta: "All received", state: "done" },
      { label: "QC completed", meta: "14/14 passed", state: "done" },
      { label: "DDP dispatch", meta: "In transit · ETA Dec 6", state: "active" }
    ],
    costs: [
      { label: "Goods cost", value: "$1,802.00" },
      { label: "Service fee", value: "$108.12" },
      { label: "Packaging", value: "$86.00" },
      { label: "Domestic freight", value: "$44.00" },
      { label: "International freight", value: "$712.18" },
      { label: "Duties & taxes", value: "$196.00" }
    ],
    documents: [
      { label: "Commercial invoice", status: "Ready", tone: "success" },
      { label: "Packing list", status: "Ready", tone: "success" },
      { label: "HS code sheet", status: "Ready", tone: "success" },
      { label: "Air waybill", status: "Ready", tone: "success" },
      { label: "Supplier invoices", status: "Ready", tone: "success" }
    ],
    suppliers: [
      { name: "PowerLine Tech", meta: "Chargers · compliance cleared", status: "Completed", tone: "success" },
      { name: "HQB Cable Hub", meta: "Cables · QC passed", status: "Completed", tone: "success" },
      { name: "Audio Square", meta: "Audio accessories · QC passed", status: "Completed", tone: "success" }
    ],
    notice: "Shipment is in transit. Carrier proof and DDP tracking are available in the documents panel."
  },
  {
    code: "SH-2312",
    destination: "Toronto, CA",
    updated: "Nov 9",
    eta: "Pending",
    status: "action",
    statusLabel: "Action required",
    progress: 55,
    skus: 18,
    units: 610,
    cartons: 3,
    risks: "2",
    landed: "$3,301.18",
    items: [
      { sku: "PC-SAM-S24-MAG", title: "MagSafe Galaxy S24 case", supplier: "Shenzhen CaseLab", quantity: 180, landed: "$4.21", risk: "Low", qc: "Passed", action: "Photos" },
      { sku: "CHG-100W-GAN-01", title: "100W GaN desktop charger", supplier: "PowerLine Tech", quantity: 130, landed: "$12.84", risk: "High", qc: "Action needed", action: "Docs" },
      { sku: "STD-DESK-CHARGE-02", title: "Dual-device charging stand", supplier: "AccessPoint", quantity: 120, landed: "$8.44", risk: "Medium", qc: "Pending", action: "Approve" }
    ],
    milestones: [
      { label: "Quote approved", meta: "Oct 22", state: "done" },
      { label: "Payment settled", meta: "Oct 23", state: "done" },
      { label: "Supplier collection", meta: "5/7 received", state: "active" },
      { label: "QC & consolidation", meta: "Waiting for documents", state: "pending" },
      { label: "DDP dispatch", meta: "ETA pending", state: "pending" }
    ],
    costs: [
      { label: "Goods cost", value: "$2,018.40" },
      { label: "Service fee", value: "$121.10" },
      { label: "Packaging", value: "$92.00" },
      { label: "Domestic freight", value: "$49.00" },
      { label: "International freight", value: "$824.68" },
      { label: "Duties & taxes", value: "$196.00" }
    ],
    documents: [
      { label: "Commercial invoice", status: "Ready", tone: "success" },
      { label: "Packing list", status: "Ready", tone: "success" },
      { label: "Plug certification", status: "Missing", tone: "danger" },
      { label: "Battery statement", status: "Pending", tone: "warning" },
      { label: "Supplier invoices", status: "Ready", tone: "success" }
    ],
    suppliers: [
      { name: "Shenzhen CaseLab", meta: "Phone cases · QC passed", status: "Received", tone: "success" },
      { name: "PowerLine Tech", meta: "Chargers · compliance docs required", status: "Action", tone: "danger" },
      { name: "AccessPoint Shenzhen", meta: "Charging stand · packaging approval", status: "Pending", tone: "warning" }
    ],
    notice: "Two actions are blocking dispatch: upload the 100W charger certification and approve the charging-stand packaging proof."
  }
];

export function getDemoOrder(code: string | undefined) {
  return demoOrders.find((order) => order.code.toUpperCase() === code?.toUpperCase());
}
