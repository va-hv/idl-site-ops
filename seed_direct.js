const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Metric (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    key TEXT,
    value TEXT,
    status TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS Employee (
    id TEXT PRIMARY KEY,
    employeeId TEXT UNIQUE,
    name TEXT,
    department TEXT,
    shift TEXT,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS AndonAlert (
    id TEXT PRIMARY KEY,
    alertId TEXT UNIQUE,
    station TEXT,
    issue TEXT,
    duration TEXT,
    status TEXT,
    createdAt TEXT
  );
`);

db.exec(`DELETE FROM Metric; DELETE FROM Employee; DELETE FROM AndonAlert;`);

const insertMetric = db.prepare('INSERT INTO Metric (id, moduleId, key, value, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
const metrics = [
  ['m1', 'whs', 'TRIR', '0.42', 'NORMAL', new Date().toISOString()],
  ['m2', 'rme', 'Conveyor Uptime', '99.1%', 'NORMAL', new Date().toISOString()],
  ['m3', 'wfm', 'Labor Utilization', '92.4%', 'NORMAL', new Date().toISOString()],
  ['m4', 'ci', 'Andon MTTR', '3.2 mins', 'NORMAL', new Date().toISOString()],
  ['m5', 'quality', 'Outbound Defect Rate', '142 PPM', 'NORMAL', new Date().toISOString()],
  ['m6', 'security', 'Carrier Turnaround', '42 mins', 'NORMAL', new Date().toISOString()],
  ['m7', 'visitors', 'Active Contractors', '12 Personnel', 'NORMAL', new Date().toISOString()],
  ['m8', 'compliance', 'Audit Readiness', '98.5%', 'NORMAL', new Date().toISOString()],
  ['m9', 'documents', 'Active SOP Compliance', '99.4%', 'NORMAL', new Date().toISOString()],
  ['m10', 'it', 'RF Scanners Online', '142 / 145', 'NORMAL', new Date().toISOString()],
  ['m11', 'my-work', 'Pending Approvals', '4 Items', 'NORMAL', new Date().toISOString()],
  ['m12', 'reporting', 'Scheduled Reports', '12 Reports', 'NORMAL', new Date().toISOString()],
  ['m13', 'admin', 'Active RBAC Users', '184 Accounts', 'NORMAL', new Date().toISOString()],
];

for (const m of metrics) {
  insertMetric.run(...m);
}

const insertEmp = db.prepare('INSERT INTO Employee (id, employeeId, name, department, shift, status) VALUES (?, ?, ?, ?, ?, ?)');
insertEmp.run('e1', 'IDL-88201', 'Marcus Brody', 'Inbound RME', 'Shift A (07:00 - 15:30)', 'CLOCK_IN');
insertEmp.run('e2', 'IDL-88204', 'Sarah Jenkins', 'WHS Safety', 'Shift A (07:00 - 15:30)', 'CLOCK_IN');

const insertAndon = db.prepare('INSERT INTO AndonAlert (id, alertId, station, issue, duration, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
insertAndon.run('a1', 'ANDON-402', 'Zone C - Pack Station 12', 'Material Shortage (Boxes)', '4 mins', 'ACKNOWLEDGED', new Date().toISOString());

console.log('✅ SQLite database created and seeded successfully via direct Node.js execution!');
