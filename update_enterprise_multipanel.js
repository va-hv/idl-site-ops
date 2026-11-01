const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

// Create multi-panel operational tables for enterprise views
db.exec(`
  CREATE TABLE IF NOT EXISTS EnterprisePanel (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    panelTitle TEXT,
    cardType TEXT,
    metricName TEXT,
    metricValue TEXT,
    statusText TEXT,
    extraMeta TEXT
  );
  DELETE FROM EnterprisePanel;
`);

const insertPanel = db.prepare('INSERT INTO EnterprisePanel (id, moduleId, panelTitle, cardType, metricName, metricValue, statusText, extraMeta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

const panels = [
  // --- WHS (Safety & Compliance) ---
  ['p-whs-1', 'whs', 'Open Incident & Hazard Queue', 'TABLE', '3 Open Items', 'Action Required', 'High Priority', 'Zone B Racking Overhang'],
  ['p-whs-2', 'whs', 'PIT Forklift Pre-Shift Status', 'METRIC', '14 / 14 Units Passed', '98.2% Compliance', 'Nominal', 'Checked at 06:30 AM'],
  ['p-whs-3', 'whs', 'TRIR Safety Performance (YTD)', 'METRIC', '0.42 Incident Rate', 'Target < 0.50', 'On Track', '184 Associates Covered'],
  ['p-whs-4', 'whs', 'CAPA Corrective Action SLA', 'METRIC', '94.8% Closed on Time', '1.2 Days Avg Resolution', 'Compliant', 'Ministry Audit Ready'],

  // --- RME (Engineering & Maintenance) ---
  ['p-rme-1', 'rme', 'Conveyor & Sorter Uptime', 'METRIC', '99.1% Operational', '164 hrs MTBF', 'Nominal', 'Primary Sortation Loop A'],
  ['p-rme-2', 'rme', 'Active Maintenance Work Orders', 'TABLE', '4 Work Orders', '2 In Progress', 'Action Required', 'Inbound Diverter Motor Overhaul'],
  ['p-rme-3', 'rme', 'Preventative Maintenance SLA', 'METRIC', '96.5% Completed', '2 Overdue PM Tasks', 'Warning', 'High-Speed Gearbox Service'],

  // --- Procurement & Consumables ---
  ['p-proc-1', 'procurement', 'Packaging SKU Stock Cover', 'TABLE', 'Corrugated Boxes (BOX-C12)', '11 Days Cover (Low)', 'Action Required', 'Reorder Threshold: 15 Days'],
  ['p-proc-2', 'procurement', 'Stretch Film Inventory Status', 'METRIC', '1,420 Rolls in Stock', '24 Days Cover', 'Healthy', 'Machine Grade 80 Gauge'],
  ['p-proc-3', 'procurement', 'Active Purchase Orders', 'TABLE', 'PO #9910 - Box Restock', '$14,250 CAD', 'Pending Approval', 'Supplier: Cascades Container'],

  // --- Quality Assurance ---
  ['p-q-1', 'quality', 'Outbound Defect Rate Tracking', 'METRIC', '142 PPM', 'Target < 200 PPM', 'Compliant', 'Batch SKU: ELEC-501'],
  ['p-q-2', 'quality', 'Quarantine & Return Holding', 'TABLE', 'Bay 4 Quarantine Cage', '$14,250 Damaged Stock', 'Action Required', 'Vendor Return Authorization Pending'],

  // --- Visitors & Gatehouse ---
  ['p-v-1', 'visitors', 'Carrier Turnaround & Dock Flow', 'TABLE', 'Atlas Logistics (#TR-9901)', 'Dock 14 Outbound', 'Checked In', 'Driver: J. Miller (10:42 AM)'],
  ['p-v-2', 'visitors', 'Contractor Safety Inductions', 'METRIC', '100% Induction Pass', '14 Active Badges', 'Compliant', 'Speedee Electricians & HVAC']
];

for (const p of panels) {
  insertPanel.run(...p);
}

console.log('✅ Multi-panel enterprise tables seeded successfully!');
