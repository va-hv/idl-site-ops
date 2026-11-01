const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

// Create domain telemetry & owner metadata tables
db.exec(`
  CREATE TABLE IF NOT EXISTS ModuleOwner (
    moduleId TEXT PRIMARY KEY,
    ownerName TEXT,
    ownerId TEXT,
    slaTarget TEXT,
    escalationContact TEXT
  );
  DELETE FROM ModuleOwner;
`);

const insertOwner = db.prepare('INSERT INTO ModuleOwner (moduleId, ownerName, ownerId, slaTarget, escalationContact) VALUES (?, ?, ?, ?, ?)');

const owners = [
  ['visitors', 'Carlos Mendez', 'IDL-88902', '< 90 sec check-in SLA', 'Gatehouse Kiosk Alpha'],
  ['whs', 'Sarah Jenkins', 'IDL-88204', 'Zero Lost Time Incidents', 'Safety Command Desk'],
  ['rme', 'Marcus Brody', 'IDL-88201', '99.5% Conveyor Uptime', 'RME Workshop Bay 2'],
  ['procurement', 'Chloe Tremblay', 'IDL-89011', '14 Days Minimum Stock Cover', 'Supply Chain Office'],
  ['quality', 'Elena Rostova', 'IDL-88412', '< 150 PPM Outbound Defect', 'Quality Assurance Lab'],
  ['security', 'Carlos Mendez', 'IDL-88902', '100% Seal Audit Compliance', 'Gatehouse Terminal'],
  ['it', 'Carlos Mendez', 'IDL-88902', '99.9% RF Scanner Uptime', 'IT Server Room / MDM'],
  ['facilities', 'Liam OConnor', 'IDL-88719', 'PUE < 1.20 Target', 'Facilities Plant Room']
];

for (const o of owners) {
  insertOwner.run(...o);
}

console.log('✅ Enterprise module owners and domain metadata updated successfully!');
