const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// 1. Seed Database Table for ModuleDetails
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS ModuleDetail (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    title TEXT,
    col1 TEXT,
    col2 TEXT,
    col3 TEXT,
    col4 TEXT,
    status TEXT
  );
  DELETE FROM ModuleDetail;
`);

const insertDetail = db.prepare('INSERT INTO ModuleDetail (id, moduleId, title, col1, col2, col3, col4, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

const details = [
  // Visitors & Contractors (Vendors & Transport Carriers)
  ['d1', 'visitors', 'Atlas Logistics Transport', 'Carrier #TR-9901', 'Driver: J. Miller', 'Dock 14 - Outbound', 'CHECKED_IN', 'ACTIVE'],
  ['d2', 'visitors', 'Titan Security Services', 'Vendor #SEC-412', 'Guard: S. Vance', 'Main Gate Kiosk', 'BADGED', 'ACTIVE'],
  ['d3', 'visitors', 'Schneider National Freight', 'Carrier #SCH-882', 'Driver: R. Davis', 'Dock 08 - Inbound', 'SEAL_CHECKED', 'COMPLETED'],
  ['d4', 'visitors', 'Speedee Electricians & HVAC', 'Contractor #CON-102', 'Lead: M. ONeill', 'Mezzanine Panel B', 'INDUCTION_PASSED', 'ACTIVE'],

  // Safety (WHS)
  ['d5', 'whs', 'Forklift Daily Pre-Shift Inspection', 'PIT Unit #12', 'Operator: M. Brody', 'Passed all 14 points', 'NORMAL', 'COMPLETED'],
  ['d6', 'whs', 'Pallet Racking Safety Audit', 'Zone B - Bay 14', 'Auditor: S. Jenkins', 'Minor overhang noted - Restacked', 'WARNING', 'ACTION_REQUIRED'],
  ['d7', 'whs', 'Eye-Wash Station Compliance', 'Mezzanine South', 'Auditor: S. Jenkins', 'Weekly flow test verified', 'NORMAL', 'PASSED'],

  // Maintenance (RME)
  ['d8', 'rme', 'Inbound Roller Diverter Motor', 'Asset #CONV-04', 'Tech: M. Brody', 'Replaced worn belt bearing', 'NORMAL', 'RESOLVED'],
  ['d9', 'rme', 'Laser Photo-Eye Alignment', 'Sortation Loop 2', 'Tech: M. Brody', 'Recalibrated optical sensor', 'NORMAL', 'COMPLETED'],
  ['d10', 'rme', 'High-Speed Sorter Gearbox', 'Line 1 Main Drive', 'Tech: R. Kumar', 'Scheduled oil and seal flush', 'WARNING', 'PENDING_PM'],

  // Procurement & Consumables
  ['d11', 'procurement', 'Stretch Film Roll (Machine Grade)', 'SKU: WRAP-80G', 'Stock: 1,420 Rolls', '24 Days Cover', 'NORMAL', 'ACTIVE'],
  ['d12', 'procurement', 'Corrugated RSC Shipping Boxes', 'SKU: BOX-C12', 'Stock: 4,500 Units', '11 Days Cover', 'WARNING', 'ACTIVE'],
  ['d13', 'procurement', 'Fragile Warning Tape Rolls', 'SKU: TAPE-FRAG', 'Stock: 820 Rolls', '32 Days Cover', 'NORMAL', 'ACTIVE'],

  // Quality
  ['d14', 'quality', 'Outbound Lot Sample #YYZ-9901', 'Defect Rate: 142 PPM', 'Inspector: E. Rostova', 'Tolerance Verified', 'NORMAL', 'PASSED'],
  ['d15', 'quality', 'Damaged Master Carton Quarantine', 'Bay 4 Quarantine Area', 'Inspector: E. Rostova', 'Vendor Return Initiated', 'WARNING', 'ACTION_REQUIRED'],

  // Security
  ['d16', 'security', 'Inbound Seal Inspection', 'Trailer #SL-99410', 'Guard: C. Mendez', 'Seal Intact / Verified', 'NORMAL', 'PASSED'],
  ['d17', 'security', 'Visitor Badge Audit', '14 Active Badges', 'Guard: C. Mendez', 'All accounted for', 'NORMAL', 'PASSED'],

  // IT & Device Fleet
  ['d18', 'it', 'Zebra TC57 RF Scanners', '142 / 145 Online', 'Fleet Admin: C. Mendez', 'Battery Health: 92.1%', 'NORMAL', 'ACTIVE'],
  ['d19', 'it', 'Forklift Mounted Terminals', '14 Units Active', 'Fleet Admin: C. Mendez', 'MDM Sync OK', 'NORMAL', 'ACTIVE'],

  // Facilities & ESG
  ['d20', 'facilities', 'HVAC Climate Control System', 'Ambient Temp: 21°C', 'Engineer: L. OConnor', 'PUE Efficiency: 1.18', 'NORMAL', 'ACTIVE'],
  ['d21', 'facilities', 'Cardboard & Plastic Baler', 'Recycling Dock', 'Engineer: L. OConnor', 'Waste Diversion: 88.5%', 'NORMAL', 'ACTIVE']
];

for (const d of details) {
  insertDetail.run(...d);
}

console.log('✅ SQLite ModuleDetail records seeded successfully!');
