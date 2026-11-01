const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

// Create a rich module-specific detail table
db.exec(`
  CREATE TABLE IF NOT EXISTS ModuleSpecificData (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    primaryField TEXT,
    secondaryField TEXT,
    statusField TEXT,
    metricField TEXT,
    timestampField TEXT
  );
  DELETE FROM ModuleSpecificData;
`);

const insert = db.prepare('INSERT INTO ModuleSpecificData (id, moduleId, primaryField, secondaryField, statusField, metricField, timestampField) VALUES (?, ?, ?, ?, ?, ?, ?)');

const authenticData = [
  // 1. Safety & Compliance (whs)
  ['whs-1', 'whs', 'Forklift Pre-Shift Daily Checklist', 'PIT Unit #12 (Zebra)', 'COMPLETED', '14/14 Checks Passed', '06:30 AM'],
  ['whs-2', 'whs', 'Pallet Racking Load Capacity Audit', 'Zone B - Bay 14 Upper', 'WARNING', 'Minor Overhang (Restacked)', '09:15 AM'],
  ['whs-3', 'whs', 'Eyewash Station Flow & Temperature Test', 'Mezzanine South Wing', 'PASSED', 'Water Temp 19.4°C', '07:00 AM'],
  ['whs-4', 'whs', 'PPE Compliance Walkthrough', 'Inbound Dock Doors 1-15', 'ACTIVE', '100% High-Vis & Steel Toe', '10:45 AM'],

  // 2. Engineering & Maintenance / RME (rme)
  ['rme-1', 'rme', 'Inbound Roller Diverter Motor Overhaul', 'Conveyor Line 2 (Divert Chute)', 'RESOLVED', 'Replaced Polyurethane Bearing', '08:15 AM'],
  ['rme-2', 'rme', 'High-Speed Cross-Belt Sorter Drive', 'Primary Sortation Loop A', 'PENDING_PM', 'Scheduled Oil & Seal Flush', '14:00 PM'],
  ['rme-3', 'rme', 'Laser Photo-Eye Alignment Check', 'Mezzanine Merge Point 4', 'COMPLETED', 'Optical Sensitivity Recalibrated', '07:30 AM'],
  ['rme-4', 'rme', 'Automatic Stretch Wrapper Turntable', 'Outbound Dock 6', 'ACTIVE', 'Tension Clutch Calibrated', '11:20 AM'],

  // 3. Procurement & Consumables (procurement)
  ['proc-1', 'procurement', 'Machine-Grade Stretch Film (80 Gauge)', 'SKU: WRAP-80G', 'NORMAL_STOCK', '1,420 Rolls (24 Days Cover)', 'Live Inventory'],
  ['proc-2', 'procurement', 'Corrugated RSC Regular Slotted Cartons', 'SKU: BOX-C12', 'LOW_STOCK_WARNING', '4,500 Units (11 Days Cover)', 'Live Inventory'],
  ['proc-3', 'procurement', 'Fragile Handling Warning Tape Rolls', 'SKU: TAPE-FRAG', 'NORMAL_STOCK', '820 Rolls (32 Days Cover)', 'Live Inventory'],
  ['proc-4', 'procurement', 'Custom ID Logistics Branded Pallet Labels', 'SKU: LBL-YYZ01', 'NORMAL_STOCK', '12 Rolls (45 Days Cover)', 'Live Inventory'],

  // 4. Quality Assurance (quality)
  ['q-1', 'quality', 'Outbound Order Audit Sample #YYZ-9901', 'Batch SKU: ELEC-501', 'PASSED', '142 PPM Defect Rate', '11:05 AM'],
  ['q-2', 'quality', 'Damaged Master Carton Quarantine', 'Bay 4 Quarantine Cage', 'ACTION_REQUIRED', '$14,250 Vendor Return Hold', '09:50 AM'],
  ['q-3', 'quality', 'Inbound Supplier Pallet Accuracy Audit', 'Vendor: Schneider Freight', 'PASSED', '99.4% SKU Match Rate', '08:20 AM'],

  // 5. Visitor & Contractor Management (visitors)
  ['v-1', 'visitors', 'Atlas Logistics Freight Transport', 'Carrier #TR-9901 (Driver: J. Miller)', 'CHECKED_IN', 'Dock 14 - Outbound', '10:42 AM'],
  ['v-2', 'visitors', 'Titan Security Armored Services', 'Vendor #SEC-412 (Guard: S. Vance)', 'BADGED', 'Main Gate Kiosk', '09:15 AM'],
  ['v-3', 'visitors', 'Speedee Industrial Electricians', 'Contractor #CON-102 (Lead: M. ONeill)', 'INDUCTION_PASSED', 'Mezzanine Panel B', '08:02 AM'],

  // 6. Security & Gatehouse (security)
  ['sec-1', 'security', 'Inbound Trailer Seal Verification', 'Trailer #SL-99410', 'SEAL_INTACT', 'Matched Bill of Lading #4491', '11:40 AM'],
  ['sec-2', 'security', 'Active Visitor & Contractor Badge Audit', '14 Active Badges Issued', 'NORMAL', 'All Escort Protocols Followed', 'Live Tracking'],

  // 7. IT & Device Fleet (it)
  ['it-1', 'it', 'Zebra TC57 Enterprise RF Scanners', '142 / 145 Active Online', 'NOMINAL', 'Average Battery Health: 92.1%', 'Live Telemetry'],
  ['it-2', 'it', 'Forklift Mounted Vehicle Terminals', '14 Units Connected', 'MDM_COMPLIANT', 'Wi-Fi 7 Roaming Stable', 'Live Telemetry'],
  ['it-3', 'it', 'Open IT Support & Hardware Tickets', '2 Active Peripherals Tickets', 'WARNING', 'Handheld Laser Scanner Latch Repair', 'Pending Tech'],

  // 8. Facilities & ESG (facilities)
  ['fac-1', 'facilities', 'HVAC Warehouse Climate Control System', 'Ambient Temperature: 21°C', 'NOMINAL', 'PUE Energy Efficiency: 1.18', 'Live HVAC Feed'],
  ['fac-2', 'facilities', 'Industrial Cardboard & Plastic Baler', 'Recycling Dock Bay 1', 'ACTIVE', 'Waste Diversion Rate: 88.5%', 'Daily Shift Log']
];

for (const row of authenticData) {
  insert.run(...row);
}

console.log('✅ Authentic module-specific operational records seeded successfully!');
