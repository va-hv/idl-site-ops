const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

db.exec(`DELETE FROM Metric;`);

const insertMetric = db.prepare('INSERT INTO Metric (id, moduleId, key, value, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
const now = new Date().toISOString();

const allMetrics = [
  // Control Tower HQ
  ['m1', 'control-tower', 'Total Daily Volume', '42,850 Units', 'NORMAL', now],
  ['m2', 'control-tower', 'Backlog Queue', '1,240 Orders', 'NORMAL', now],
  ['m3', 'control-tower', 'Active Staffing', '184 Associates', 'NORMAL', now],
  ['m4', 'control-tower', 'Safety Incident Rate (TRIR)', '0.42', 'NORMAL', now],

  // Safety (WHS)
  ['m5', 'whs', 'TRIR', '0.42', 'NORMAL', now],
  ['m6', 'whs', 'DART', '0.18', 'NORMAL', now],
  ['m7', 'whs', 'CAPA SLA', '94.8%', 'NORMAL', now],
  ['m8', 'whs', 'PIT Compliance', '98.2%', 'WARNING', now],

  // Maintenance (RME)
  ['m9', 'rme', 'Conveyor Uptime', '99.1%', 'NORMAL', now],
  ['m10', 'rme', 'MTBF', '164 hrs', 'NORMAL', now],
  ['m11', 'rme', 'MTTR', '24 mins', 'NORMAL', now],
  ['m12', 'rme', 'PM Compliance', '96.5%', 'NORMAL', now],

  // Workforce (WFM)
  ['m13', 'wfm', 'Labor Utilization', '92.4%', 'NORMAL', now],
  ['m14', 'wfm', 'Attendance Rate', '96.8%', 'NORMAL', now],
  ['m15', 'wfm', 'Active Headcount', '184 / 190', 'NORMAL', now],
  ['m16', 'wfm', 'Skill Coverage', '89.1%', 'NORMAL', now],

  // Continuous Improvement (CI)
  ['m17', 'ci', 'Andon MTTR', '3.2 mins', 'NORMAL', now],
  ['m18', 'ci', 'Active Alerts', '1 Warning', 'WARNING', now],
  ['m19', 'ci', 'Kaizen Submissions', '48 YTD', 'NORMAL', now],
  ['m20', 'ci', '5S Audit Score', '92.6%', 'NORMAL', now],

  // Quality
  ['m21', 'quality', 'Defect Rate', '142 PPM', 'NORMAL', now],
  ['m22', 'quality', 'Quarantine Value', '$14,250', 'WARNING', now],
  ['m23', 'quality', 'RCA SLA', '97.1%', 'NORMAL', now],
  ['m24', 'quality', 'Vendor Accuracy', '99.4%', 'NORMAL', now],

  // Security
  ['m25', 'security', 'Carrier Turnaround', '42 mins', 'NORMAL', now],
  ['m26', 'security', 'Active Visitors', '14 Badges', 'NORMAL', now],
  ['m27', 'security', 'Seal Compliance', '100%', 'NORMAL', now],
  ['m28', 'security', 'Security Incidents', '0 Open', 'NORMAL', now],

  // Visitors & Contractors
  ['m29', 'visitors', 'Active Contractors', '12 Personnel', 'NORMAL', now],
  ['m30', 'visitors', 'Induction Compliance', '100%', 'NORMAL', now],
  ['m31', 'visitors', 'NDA Sign-Offs', '14 / 14 Signed', 'NORMAL', now],
  ['m32', 'visitors', 'Check-In Speed', '< 90 secs', 'NORMAL', now],

  // Facilities & ESG
  ['m33', 'facilities', 'Energy Efficiency (PUE)', '1.18', 'NORMAL', now],
  ['m34', 'facilities', 'Waste Diversion', '88.5%', 'NORMAL', now],
  ['m35', 'facilities', 'HVAC Thermal Status', 'Nominal (21°C)', 'NORMAL', now],
  ['m36', 'facilities', 'Safety Checks', '100% Passed', 'NORMAL', now],

  // Learning & SOP Academy
  ['m37', 'learning', 'Training Completion', '97.4%', 'NORMAL', now],
  ['m38', 'learning', 'SOP Sign-Offs', '99.1%', 'NORMAL', now],
  ['m39', 'learning', 'Active Courses', '24 Modules', 'NORMAL', now],
  ['m40', 'learning', 'Recertifications', '2 Pending', 'WARNING', now],

  // Communications & Handover
  ['m41', 'communications', 'Handover Compliance', '100%', 'NORMAL', now],
  ['m42', 'communications', 'Safety Broadcasts', '98.5% Reach', 'NORMAL', now],
  ['m43', 'communications', 'Notice Boards', '6 Feeds', 'NORMAL', now],
  ['m44', 'communications', 'Broadcast SLA', '< 4 mins', 'NORMAL', now],

  // Associate Engagement
  ['m45', 'engagement', 'eNPS Score', '+42 Score', 'NORMAL', now],
  ['m46', 'engagement', 'Pulse Participation', '88.2%', 'NORMAL', now],
  ['m47', 'engagement', 'Peer Shout-Outs', '74 Badges', 'NORMAL', now],
  ['m48', 'engagement', 'Retention Health', '94.1%', 'NORMAL', now],

  // Compliance & Legal
  ['m49', 'compliance', 'Audit Readiness', '98.5%', 'NORMAL', now],
  ['m50', 'compliance', 'Statutory Certs', '12 / 12 Active', 'NORMAL', now],
  ['m51', 'compliance', 'Finding Closure SLA', '100%', 'NORMAL', now],
  ['m52', 'compliance', 'Next Inspection', 'Nov 14, 2026', 'WARNING', now],

  // Procurement & Consumables
  ['m53', 'procurement', 'Stretch Wrap Stock', '24 Days Cover', 'NORMAL', now],
  ['m54', 'procurement', 'Corrugated Boxes', '11 Days Cover', 'WARNING', now],
  ['m55', 'procurement', 'Open POs', '4 Active POs', 'NORMAL', now],
  ['m56', 'procurement', 'Cost / Unit', '$0.18 CAD', 'NORMAL', now],

  // Document Control
  ['m57', 'documents', 'Active SOP Compliance', '99.4%', 'NORMAL', now],
  ['m58', 'documents', 'Pending Approvals', '3 Documents', 'WARNING', now],
  ['m59', 'documents', 'Read & Acknowledge', '98.9%', 'NORMAL', now],
  ['m60', 'documents', 'Master Library', '64 Active SOPs', 'NORMAL', now],

  // IT & Device Fleet
  ['m61', 'it', 'RF Scanners Online', '142 / 145 Active', 'NORMAL', now],
  ['m62', 'it', 'Average Battery Health', '92.1%', 'NORMAL', now],
  ['m63', 'it', 'Open IT Tickets', '2 Tickets', 'WARNING', now],
  ['m64', 'it', 'MDM Sync Status', '100% Compliant', 'NORMAL', now],

  // My Work Inbox
  ['m65', 'my-work', 'Pending Approvals', '4 Items', 'NORMAL', now],
  ['m66', 'my-work', 'Expiring Certs', '1 Item', 'WARNING', now],
  ['m67', 'my-work', 'Assigned Work Orders', '2 Active Tasks', 'NORMAL', now],
  ['m68', 'my-work', 'Task SLA Compliance', '100%', 'NORMAL', now],

  // Reporting & Analytics
  ['m69', 'reporting', 'Scheduled Reports', '12 Reports', 'NORMAL', now],
  ['m70', 'reporting', 'Wall-Screen Displays', '6 Active Kiosks', 'NORMAL', now],
  ['m71', 'reporting', 'Data Exports', '84 CSV / Excel', 'NORMAL', now],
  ['m72', 'reporting', 'Query Latency', '18 ms', 'NORMAL', now],

  // Administration & Integrations
  ['m73', 'admin', 'Active RBAC Users', '184 Accounts', 'NORMAL', now],
  ['m74', 'admin', 'WMS / HRIS Connectors', '4 / 4 Healthy', 'NORMAL', now],
  ['m75', 'admin', 'Audit Trail Logging', '1,420 Events', 'NORMAL', now],
  ['m76', 'admin', 'API Webhooks Active', '8 Endpoints', 'NORMAL', now],
];

for (const m of allMetrics) {
  insertMetric.run(...m);
}

console.log('✅ All 18 modules successfully populated with rich dummy telemetry!');
