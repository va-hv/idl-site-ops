const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

// Create a dedicated module log table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS ModuleLog (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    timestamp TEXT,
    actor TEXT,
    action TEXT,
    details TEXT,
    severity TEXT
  );
`);

db.exec(`DELETE FROM ModuleLog;`);

const insertLog = db.prepare('INSERT INTO ModuleLog (id, moduleId, timestamp, actor, action, details, severity) VALUES (?, ?, ?, ?, ?, ?, ?)');
const now = new Date().toISOString();

const logs = [
  // Visitors
  ['l1', 'visitors', '10:42 AM', 'Carlos Mendez (IDL-88902)', 'Contractor Badge Issued', 'Visitor badge #402 issued to Atlas Logistics Transport driver J. Miller.', 'INFO'],
  ['l2', 'visitors', '09:15 AM', 'Sarah Jenkins (IDL-88204)', 'Safety Induction Completed', 'Mandatory PPE and high-vis brief completed for 3 third-party electricians.', 'INFO'],
  ['l3', 'visitors', '08:02 AM', 'Marcus Brody (IDL-88201)', 'Loading Dock Sign-in', 'Carrier dock seal inspection passed prior to facility entry.', 'INFO'],

  // Safety (whs)
  ['l4', 'whs', '11:20 AM', 'Sarah Jenkins (IDL-88204)', 'PIT Daily Checklist Audited', 'Forklift fleet pre-shift inspection completed. All 14 units nominal.', 'INFO'],
  ['l5', 'whs', '09:30 AM', 'Ritesh Kumar (IDL-88310)', 'Near Miss Logged', 'Pallet overhang noted in Zone B racking. Corrective restack enforced immediately.', 'WARNING'],

  // Maintenance (rme)
  ['l6', 'rme', '12:05 PM', 'Marcus Brody (IDL-88201)', 'Conveyor Roller Serviced', 'Replaced worn polyurethane roller bearing on Inbound Line 2 divert chute.', 'INFO'],
  ['l7', 'rme', '07:30 AM', 'Marcus Brody (IDL-88201)', 'PM Diagnostic Run', 'Completed morning laser photo-eye alignment check across primary sortation loops.', 'INFO'],

  // Workforce (wfm)
  ['l8', 'wfm', '06:45 AM', 'Chloe Tremblay (IDL-89011)', 'Shift A Attendance Verified', '184 of 190 associates clocked in. 6 approved PTO/sick leaves logged.', 'INFO'],
  ['l9', 'wfm', '08:00 AM', 'Chloe Tremblay (IDL-89011)', 'Cross-Training Assignment', 'Assigned 4 packers to outbound pallet wrapping stations for peak volume surge.', 'INFO'],

  // Quality
  ['l10', 'quality', '11:05 AM', 'Elena Rostova (IDL-88412)', 'Outbound Audit Passed', 'Sample batch #YYZ-9901 inspected. Defect rate recorded at 142 PPM.', 'INFO'],
  ['l11', 'quality', '09:50 AM', 'Elena Rostova (IDL-88412)', 'Quarantine Tag Placed', 'Damaged corrugated master carton quarantined in Bay 4 for vendor return.', 'WARNING'],

  // Security
  ['l12', 'security', '11:40 AM', 'Carlos Mendez (IDL-88902)', 'Trailer Seal Verified', 'Inbound seal #SL-99410 verified intact prior to dock door 14 release.', 'INFO'],

  // Facilities
  ['l13', 'facilities', '08:30 AM', 'Liam O\'Connor (IDL-88719)', 'HVAC Thermal Check', 'Warehouse ambient temperature balanced to 21°C. PUE efficiency at 1.18.', 'INFO'],

  // IT & Device Fleet
  ['l14', 'it', '10:15 AM', 'Carlos Mendez (IDL-88902)', 'RF Scanner MDM Sync', '142 Zebra TC57 scanners synchronized successfully via enterprise Wi-Fi 7.', 'INFO'],

  // Default fallback for other modules
  ['l15', 'control-tower', '13:00 PM', 'System AI', 'Automated Daily Snapshot', 'Enterprise operations telemetry aggregated across all 18 YYZ-01 modules.', 'INFO']
];

for (const l of logs) {
  insertLog.run(...l);
}

console.log('✅ Module-specific operational logs seeded successfully!');
