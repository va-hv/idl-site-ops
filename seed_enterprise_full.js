const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

// Clear existing tables
db.exec(`DELETE FROM Metric; DELETE FROM Employee; DELETE FROM AndonAlert;`);

const now = new Date().toISOString();

// 1. Seed Metrics Across All 18 Modules
const insertMetric = db.prepare('INSERT INTO Metric (id, moduleId, key, value, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
const allMetrics = [
  // Control Tower HQ
  ['m1', 'control-tower', 'Total Daily Volume', '42,850 Units', 'NORMAL', now],
  ['m2', 'control-tower', 'Backlog Queue', '1,240 Orders', 'NORMAL', now],
  ['m3', 'control-tower', 'Active Staffing', '184 Associates', 'NORMAL', now],
  ['m4', 'control-tower', 'Safety Incident Rate (TRIR)', '0.42', 'NORMAL', now],

  // Safety (WHS)
  ['m5', 'whs', 'TRIR (YTD)', '0.42', 'NORMAL', now],
  ['m6', 'whs', 'DART Rate', '0.18', 'NORMAL', now],
  ['m7', 'whs', 'CAPA Closure SLA', '94.8%', 'NORMAL', now],
  ['m8', 'whs', 'PIT Daily Inspections', '98.2%', 'WARNING', now],

  // Maintenance (RME)
  ['m9', 'rme', 'Conveyor System Uptime', '99.1%', 'NORMAL', now],
  ['m10', 'rme', 'Mean Time Between Failures', '164 hrs', 'NORMAL', now],
  ['m11', 'rme', 'Mean Time To Repair', '24 mins', 'NORMAL', now],
  ['m12', 'rme', 'Preventative Maint SLA', '96.5%', 'NORMAL', now],

  // Workforce (WFM)
  ['m13', 'wfm', 'Labor Utilization', '92.4%', 'NORMAL', now],
  ['m14', 'wfm', 'Shift Attendance Rate', '96.8%', 'NORMAL', now],
  ['m15', 'wfm', 'Active Headcount', '184 / 190', 'NORMAL', now],
  ['m16', 'wfm', 'Cross-Training Coverage', '89.1%', 'NORMAL', now],

  // Continuous Improvement (CI)
  ['m17', 'ci', 'Andon Resolution MTTR', '3.2 mins', 'NORMAL', now],
  ['m18', 'ci', 'Active Floor Alerts', '2 Open', 'WARNING', now],
  ['m19', 'ci', 'Kaizen Submissions', '48 YTD', 'NORMAL', now],
  ['m20', 'ci', '5S Audit Score', '92.6%', 'NORMAL', now],

  // Quality
  ['m21', 'quality', 'Outbound Defect Rate', '142 PPM', 'NORMAL', now],
  ['m22', 'quality', 'Quarantine Inventory', '$14,250', 'WARNING', now],
  ['m23', 'quality', 'RCA Completion SLA', '97.1%', 'NORMAL', now],
  ['m24', 'quality', 'Supplier Accuracy', '99.4%', 'NORMAL', now],

  // Security
  ['m25', 'security', 'Carrier Turnaround Time', '42 mins', 'NORMAL', now],
  ['m26', 'security', 'Active Visitors on Site', '14 Badges', 'NORMAL', now],
  ['m27', 'security', 'Trailer Seal Compliance', '100%', 'NORMAL', now],
  ['m28', 'security', 'Security Breach Incidents', '0 Open', 'NORMAL', now],

  // Visitors & Contractors
  ['m29', 'visitors', 'Active Contractors', '12 Personnel', 'NORMAL', now],
  ['m30', 'visitors', 'Safety Induction Pass', '100%', 'NORMAL', now],
  ['m31', 'visitors', 'NDA Sign-Off Rate', '14 / 14', 'NORMAL', now],
  ['m32', 'visitors', 'Visitor Check-in Speed', '< 90 secs', 'NORMAL', now],

  // Facilities & ESG
  ['m33', 'facilities', 'Energy Efficiency (PUE)', '1.18', 'NORMAL', now],
  ['m34', 'facilities', 'Waste Diversion Rate', '88.5%', 'NORMAL', now],
  ['m35', 'facilities', 'HVAC Thermal Status', 'Nominal (21°C)', 'NORMAL', now],
  ['m36', 'facilities', 'Safety Compliance Audit', '100% Passed', 'NORMAL', now],

  // Learning & SOP Academy
  ['m37', 'learning', 'Training Completion Rate', '97.4%', 'NORMAL', now],
  ['m38', 'learning', 'SOP Digital Sign-off', '99.1%', 'NORMAL', now],
  ['m39', 'learning', 'Active Curriculums', '24 Modules', 'NORMAL', now],
  ['m40', 'learning', 'Pending Recertifications', '2 Users', 'WARNING', now],

  // Communications & Handover
  ['m41', 'communications', 'Shift Handover Compliance', '100%', 'NORMAL', now],
  ['m42', 'communications', 'Safety Broadcast Reach', '98.5%', 'NORMAL', now],
  ['m43', 'communications', 'Active Notice Boards', '6 Feeds', 'NORMAL', now],
  ['m44', 'communications', 'Emergency Broadcast SLA', '< 4 mins', 'NORMAL', now],

  // Associate Engagement
  ['m45', 'engagement', 'eNPS Score', '+42 Score', 'NORMAL', now],
  ['m46', 'engagement', 'Pulse Survey Participation', '88.2%', 'NORMAL', now],
  ['m47', 'engagement', 'Peer Shout-out Badges', '74 Awarded', 'NORMAL', now],
  ['m48', 'engagement', 'Retention Health Index', '94.1%', 'NORMAL', now],

  // Compliance & Legal
  ['m49', 'compliance', 'Regulatory Audit Readiness', '98.5%', 'NORMAL', now],
  ['m50', 'compliance', 'Statutory Certifications', '12 / 12 Active', 'NORMAL', now],
  ['m51', 'compliance', 'Finding Closure SLA', '100%', 'NORMAL', now],
  ['m52', 'compliance', 'Next Scheduled Audit', 'Nov 14, 2026', 'WARNING', now],

  // Procurement & Consumables
  ['m53', 'procurement', 'Stretch Film Inventory', '24 Days Cover', 'NORMAL', now],
  ['m54', 'procurement', 'Corrugated Box Stock', '11 Days Cover', 'WARNING', now],
  ['m55', 'procurement', 'Open Purchase Orders', '4 Active POs', 'NORMAL', now],
  ['m56', 'procurement', 'Packaging Cost / Unit', '$0.18 CAD', 'NORMAL', now],

  // Document Control
  ['m57', 'documents', 'Active SOP Compliance', '99.4%', 'NORMAL', now],
  ['m58', 'documents', 'Pending Approvals', '3 Documents', 'WARNING', now],
  ['m59', 'documents', 'Read & Acknowledge Rate', '98.9%', 'NORMAL', now],
  ['m60', 'documents', 'Master Library Size', '64 Active SOPs', 'NORMAL', now],

  // IT & Device Fleet
  ['m61', 'it', 'RF Scanners Online', '142 / 145 Active', 'NORMAL', now],
  ['m62', 'it', 'Average Battery Health', '92.1%', 'NORMAL', now],
  ['m63', 'it', 'Open IT Support Tickets', '2 Tickets', 'WARNING', now],
  ['m64', 'it', 'MDM Compliance Status', '100% Compliant', 'NORMAL', now],

  // My Work Inbox
  ['m65', 'my-work', 'Pending Approvals', '4 Items', 'NORMAL', now],
  ['m66', 'my-work', 'Expiring Certifications', '1 Item', 'WARNING', now],
  ['m67', 'my-work', 'Assigned Work Orders', '2 Active Tasks', 'NORMAL', now],
  ['m68', 'my-work', 'Task SLA Compliance', '100%', 'NORMAL', now],

  // Reporting & Analytics
  ['m69', 'reporting', 'Scheduled Reports Active', '12 Reports', 'NORMAL', now],
  ['m70', 'reporting', 'Wall-Screen Kiosks', '6 Active Displays', 'NORMAL', now],
  ['m71', 'reporting', 'Data Exports (YTD)', '84 CSV / Excel', 'NORMAL', now],
  ['m72', 'reporting', 'Query Latency', '18 ms', 'NORMAL', now],

  // Administration & Integrations
  ['m73', 'admin', 'Active RBAC Accounts', '184 Accounts', 'NORMAL', now],
  ['m74', 'admin', 'WMS / HRIS Connectors', '4 / 4 Healthy', 'NORMAL', now],
  ['m75', 'admin', 'Audit Trail Log Events', '1,420 Events', 'NORMAL', now],
  ['m76', 'admin', 'API Webhooks Active', '8 Endpoints', 'NORMAL', now],
];

for (const m of allMetrics) {
  insertMetric.run(...m);
}

// 2. Seed Real Logistics Personnel Roster
const insertEmp = db.prepare('INSERT INTO Employee (id, employeeId, name, department, shift, status) VALUES (?, ?, ?, ?, ?, ?)');
const employees = [
  ['e1', 'IDL-88201', 'Marcus Brody', 'Inbound RME', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e2', 'IDL-88204', 'Sarah Jenkins', 'WHS Safety', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e3', 'IDL-88310', 'Ritesh Kumar', 'Operations Lead', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e4', 'IDL-88412', 'Elena Rostova', 'Quality Assurance', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e5', 'IDL-88523', 'David Chen', 'Outbound Shipping', 'Shift B (15:00 - 23:30)', 'BREAK'],
  ['e6', 'IDL-88601', 'Amara Okafor', 'Inventory Control', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e7', 'IDL-88719', 'Liam O\'Connor', 'Facilities & ESG', 'Shift C (23:00 - 07:30)', 'OFFLINE'],
  ['e8', 'IDL-88840', 'Fatima Al-Hassan', 'Continuous Improvement', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e9', 'IDL-88902', 'Carlos Mendez', 'IT & Device Fleet', 'Shift B (15:00 - 23:30)', 'CLOCK_IN'],
  ['e10', 'IDL-89011', 'Chloe Tremblay', 'Workforce Management', 'Shift A (07:00 - 15:30)', 'CLOCK_IN']
];

for (const emp of employees) {
  insertEmp.run(...emp);
}

// 3. Seed Real Warehouse Andon & Operational Floor Alerts
const insertAndon = db.prepare('INSERT INTO AndonAlert (id, alertId, station, issue, duration, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
insertAndon.run('a1', 'ANDON-402', 'Zone C - Pack Station 12', 'Material Shortage (Corrugated Boxes)', '4 mins', 'ACKNOWLEDGED', now);
insertAndon.run('a2', 'ANDON-405', 'Zone A - Inbound Line 3', 'Jam on Roller Diverter Switch', '9 mins', 'ACTIVE', now);
insertAndon.run('a3', 'ANDON-411', 'Mezzanine B - Pick Tower 4', 'RF Scanner Battery Depleted', '2 mins', 'RESOLVED', now);

console.log('✅ ID Logistics YYZ-01 Whitby enterprise dataset fully seeded across all modules!');
