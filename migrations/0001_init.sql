PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  company TEXT,
  sales_channel TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  destination TEXT,
  sales_channel TEXT,
  shipping_method TEXT,
  launch_date TEXT,
  target_price TEXT,
  quantity_range TEXT,
  notes TEXT,
  category_count INTEGER NOT NULL DEFAULT 0,
  has_attachment INTEGER NOT NULL DEFAULT 0,
  user_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

CREATE TABLE IF NOT EXISTS quote_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  sku TEXT,
  title TEXT NOT NULL,
  category TEXT,
  quantity INTEGER NOT NULL,
  target_price REAL,
  status TEXT NOT NULL DEFAULT 'pending',
  supplier_name TEXT,
  supplier_city TEXT,
  risk_flags TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON quote_items(quote_id);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  quote_id TEXT REFERENCES quotes(id),
  user_id TEXT REFERENCES users(id),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_qc',
  progress INTEGER NOT NULL DEFAULT 0,
  destination TEXT,
  eta TEXT,
  sku_count INTEGER NOT NULL DEFAULT 0,
  supplier_count INTEGER NOT NULL DEFAULT 0,
  unit_count INTEGER NOT NULL DEFAULT 0,
  landed_value REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku TEXT,
  title TEXT NOT NULL,
  product_type TEXT,
  quantity INTEGER NOT NULL,
  unit_cost REAL,
  qc_status TEXT NOT NULL DEFAULT 'pending',
  risk_level TEXT NOT NULL DEFAULT 'low',
  supplier_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  action_required INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS order_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'done',
  occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id, occurred_at);

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  r2_key TEXT UNIQUE NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  uploaded_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS qc_records (
  id TEXT PRIMARY KEY,
  order_item_id TEXT NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  inspector TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_qc_records_item ON qc_records(order_item_id);

INSERT OR IGNORE INTO users (id, email, password_hash, name, company, sales_channel, role)
VALUES ('usr_demo_relay', 'demo@sourcingrelay.com', 'pbkdf2$100000$VsmPoSG/c9FOtCMHmdEZAA==$N72Jk6yWn2taDvztJ64tzla5gTBro2hh74M6ogmByZQ=', 'Jordan Reed', 'Reed Retail LLC', 'TikTok Shop', 'customer');

INSERT OR IGNORE INTO orders (id, code, user_id, email, status, progress, destination, eta, sku_count, supplier_count, unit_count, landed_value)
VALUES ('ord_SH2451', 'SH-2451', 'usr_demo_relay', 'demo@sourcingrelay.com', 'in_qc', 68, 'Los Angeles, US', '2026-12-18', 36, 8, 1520, 6438.72);

INSERT OR IGNORE INTO order_items (id, order_id, sku, title, product_type, quantity, unit_cost, qc_status, risk_level, supplier_name, status, action_required) VALUES
('itm_case001', 'ord_SH2451', 'PC-IP15-MAG-001', 'MagSafe iPhone 15 case', 'Phone case', 120, 3.18, 'passed', 'low', 'Shenzhen Belaga Case Co.', 'ready', 0),
('itm_cable001', 'ord_SH2451', 'CB-USBC-240-100', '240W USB-C cable', 'Cable', 200, 1.61, 'pending', 'medium', 'Huaqiangbei Cable Studio', 'in_qc', 0),
('itm_chg001', 'ord_SH2451', 'CHG-65W-GAN-02', '65W GaN charger', 'Charger', 80, 5.84, 'docs_needed', 'high', 'Shenzhen Powerpath', 'action', 1),
('itm_stand001', 'ord_SH2451', 'STD-MAG-3IN1-01', '3-in-1 magnetic desk stand', 'Magnetic stand', 80, 7.42, 'passed', 'low', 'Shenzhen Belaga Case Co.', 'ready', 0),
('itm_spk001', 'ord_SH2451', 'SPK-MINI-BT-04', 'Mini Bluetooth speaker', 'Audio', 60, 5.20, 'passed', 'medium', 'Baoan Audio Lab', 'ready', 0);

INSERT OR IGNORE INTO order_events (id, order_id, stage, title, description, status, occurred_at) VALUES
('evt_q01', 'ord_SH2451', 'quote', 'Quote approved', '36 SKUs · 8 suppliers', 'done', '2026-11-18T09:30:00Z'),
('evt_p01', 'ord_SH2451', 'payment', 'Payment settled', 'First-order milestone accepted', 'done', '2026-11-19T13:10:00Z'),
('evt_s01', 'ord_SH2451', 'collection', 'Supplier collection', '7 of 8 suppliers received', 'done', '2026-11-26T04:20:00Z'),
('evt_qc1', 'ord_SH2451', 'qc', 'QC & consolidation', '24 SKUs passed · 9 pending', 'current', '2026-11-30T11:00:00Z'),
('evt_d01', 'ord_SH2451', 'dispatch', 'DDP dispatch', 'ETA Dec 18 · Los Angeles, US', 'pending', '2026-12-10T02:00:00Z');

