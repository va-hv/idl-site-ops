const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

// Create a robust, flexible table for true module-specific operational records
db.exec(`
  CREATE TABLE IF NOT EXISTS ModuleDeepRecord (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    col1Label TEXT, col1Val TEXT,
    col2Label TEXT, col2Val TEXT,
    col3Label TEXT, col3Val TEXT,
    col4Label TEXT, col4Val TEXT,
    badgeState TEXT
  );
  DELETE FROM ModuleDeepRecord;
`);

const insert = db.prepare('INSERT INTO ModuleDeepRecord (id, moduleId, col1Label, col1Val, col2Label, col2Val, col3Label, col3Val, col4Label, col4Val, badgeState) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

const records = [
  // 1. Safety & Compliance (whs)
  ['r-whs-1', 'whs', 'Incident ID', 'INC-2026-041', 'Type', 'Near Miss (Racking)', 'Location', 'Zone B Bay 12', 'Corrective Action', 'Restacked & Secured', 'WARNING'],
  ['r-whs-2', 'whs', 'Incident ID', 'INC-2026-038', 'Type', 'PIT Pre-Shift Failure', 'Location', 'Inbound Dock 4', 'Corrective Action', 'Harness Replaced', 'RESOLVED'],
  ['r-whs-3', 'whs', 'Incident ID', 'INC-2026-029', 'Type', 'First Aid Minor Cut', 'Location', 'Pack Station 8', 'Corrective Action', 'Bandaged / Released', 'CLOSED'],

  // 2. Engineering & Maintenance (rme)
  ['r-rme-1', 'rme', 'Work Order', 'WO-99102', 'Asset', 'Conveyor Divert Belt 3', 'Technician', 'Marcus Brody', 'Repair Status', 'Bearing Replaced', 'RESOLVED'],
  ['r-rme-2', 'rme', 'Work Order', 'WO-99105', 'Asset', 'High-Speed Sorter Gearbox', 'Technician', 'Ritesh Kumar', 'Repair Status', 'Scheduled Oil Flush', 'PENDING_PM'],
  ['r-rme-3', 'rme', 'Work Order', 'WO-99110', 'Asset', 'Stretch Wrapper Turntable', 'Technician', 'Marcus Brody', 'Repair Status', 'Clutch Calibrated', 'ACTIVE'],

  // 3. Procurement & Consumables (procurement)
  ['r-proc-1', 'procurement', 'Consumable Item', 'Stretch Film 80 Gauge', 'SKU', 'WRAP-80G', 'Stock Level', '1,420 Rolls', 'Days Cover', '24 Days', 'NORMAL'],
  ['r-proc-2', 'procurement', 'Consumable Item', 'Corrugated RSC Boxes', 'SKU', 'BOX-C12', 'Stock Level', '4,500 Units', 'Days Cover', '11 Days', 'LOW_STOCK'],
  ['r-proc-3', 'procurement', 'Consumable Item', 'Fragile Warning Tape', 'SKU', 'TAPE-FRAG', 'Stock Level', '820 Rolls', 'Days Cover', '32 Days', 'NORMAL'],

  // 4. Quality Assurance (quality)
  ['r-q-1', 'quality', 'Lot Sample ID', 'LOT-YYZ-9901', 'SKU Checked', 'ELEC-501', 'Defect Rate', '142 PPM', 'Audit Result', 'PASSED', 'NORMAL'],
  ['r-q-2', 'quality', 'Lot Sample ID', 'LOT-YYZ-8840', 'SKU Checked', 'APP-204', 'Defect Rate', '890 PPM', 'Audit Result', 'QUARANTINE', 'WARNING'],

  // 5. Visitors & Contractors (visitors)
  ['r-v-1', 'visitors', 'Visitor / Company', 'Atlas Logistics Freight', 'Driver', 'J. Miller', 'Purpose', 'Outbound Loading', 'Badge / Dock', 'Dock 14 (#402)', 'CHECKED_IN'],
  ['r-v-2', 'visitors', 'Visitor / Company', 'Titan Security Services', 'Guard', 'S. Vance', 'Purpose', 'Cash Pickup', 'Badge / Dock', 'Main Kiosk (#10)', 'BADGED'],

  // 6. Security & Gatehouse (security)
  ['r-sec-1', 'security', 'Inspection Item', 'Trailer Seal #SL-99410', 'Carrier', 'Schneider Freight', 'BOL Match', 'Verified #4491', 'Status', 'Seal Intact', 'PASSED'],
  ['r-sec-2', 'security', 'Inspection Item', 'Perimeter Gate Camera 4', 'Zone', 'North Fence Line', 'Motion Event', 'None', 'Status', 'Nominal Operational', 'SECURE'],

  // 7. IT & Device Fleet (it)
  ['r-it-1', 'it', 'Hardware Fleet', 'Zebra TC57 RF Scanners', 'Online Count', '142 / 145 Units', 'Battery Health', '92.1% Avg', 'MDM Status', '100% Compliant', 'NORMAL'],
  ['r-it-2', 'it', 'Hardware Fleet', 'Forklift Vehicle Terminals', 'Online Count', '14 / 14 Units', 'Wi-Fi Roaming', 'Sub-18ms', 'MDM Status', 'Synchronized', 'NORMAL'],

  // 8. Facilities & ESG (facilities)
  ['r-fac-1', 'facilities', 'Facility System', 'Warehouse HVAC Climate', 'Setpoint', '21.0°C Ambient', 'PUE Efficiency', '1.18 PUE', 'Status', 'Nominal Thermal', 'OPTIMIZED'],
  ['r-fac-2', 'facilities', 'Facility System', 'Cardboard Baler Dock 1', 'Volume', '4.2 Tons Packed', 'Diversion Rate', '88.5%', 'Status', 'Active Cycle', 'NORMAL'],

  // 9. Workforce & Labor (wfm)
  ['r-wfm-1', 'wfm', 'Shift Group', 'Shift A - Inbound', 'Scheduled', '92 Associates', 'Present', '89 Clocked In', 'Utilization', '94.2%', 'NORMAL'],
  ['r-wfm-2', 'wfm', 'Shift Group', 'Shift B - Outbound', 'Scheduled', '98 Associates', 'Present', '95 Clocked In', 'Utilization', '96.8%', 'NORMAL'],

  // 10. Continuous Improvement / Andon (ci)
  ['r-ci-1', 'ci', 'Active Andon Alert', 'ANDON-402', 'Station', 'Zone C Pack Stn 12', 'Issue', 'Box Shortage', 'MTTR Response', '4 mins (Ack)', 'WARNING'],
  ['r-ci-2', 'ci', 'Active Andon Alert', 'ANDON-405', 'Station', 'Zone A Inbound Line 3', 'Issue', 'Roller Jam', 'MTTR Response', '9 mins (Active)', 'ACTIVE'],

  // 11. Learning & SOP Academy (learning)
  ['r-l-1', 'learning', 'Curriculum', 'PIT Forklift Certification', 'Enrolled', '142 Associates', 'Completed', '139 Certified', 'Compliance', '97.8%', 'PASSED'],
  ['r-l-2', 'learning', 'Curriculum', 'Dangerous Goods Handling', 'Enrolled', '48 Supervisors', 'Completed', '48 Certified', 'Compliance', '100%', 'PASSED'],

  // 12. Communications & Handover (communications)
  ['r-l-3', 'communications', 'Handover Log', 'Morning Shift Transition', 'Lead', 'Ritesh Kumar', 'Notes', 'Peak volume surge expected at 2 PM', 'Broadcast', 'Sent to 184 Staff', 'COMMITTED'],

  // 13. Associate Engagement (engagement)
  ['r-l-4', 'engagement', 'Metric', 'eNPS Employee Score', 'Score', '+42 Net Promoter', 'Participation', '88.2% Rate', 'Health', 'High Retention', 'POSITIVE'],

  // 14. Compliance & Legal (compliance)
  ['r-l-5', 'compliance', 'Statutory Audit', 'Ministry of Labour WHS Review', 'Due Date', 'Nov 14, 2026', 'Readiness', '98.5% Prepared', 'Status', 'All Records Ready', 'PREPARED'],

  // 15. Document Control (documents)
  ['r-l-6', 'documents', 'Master SOP', 'SOP-WH-042: Pallet Racking', 'Version', 'Rev 4.2', 'Acknowledge', '99.1% Staff Signed', 'Status', 'Active Control', 'CONTROLLED'],

  // 16. My Work Inbox (my-work)
  ['r-l-7', 'my-work', 'Assigned Task', 'Approve PO #9910 for Stretch Film', 'Requester', 'Chloe Tremblay', 'Due', 'Today, 5 PM', 'Action', 'Pending Signature', 'ACTION_REQUIRED'],

  // 17. Reporting & Analytics (reporting)
  ['r-l-8', 'reporting', 'Automated Report', 'Daily Executive Summary CSV', 'Schedule', '06:00 AM Daily', 'Recipients', 'Executive Team', 'Status', 'Dispatched OK', 'ACTIVE'],

  // 18. Administration & Integrations (admin)
  ['r-l-9', 'admin', 'System Connector', 'WMS / SAP Enterprise Link', 'Protocol', 'REST / Webhook', 'Latency', '12 ms', 'Health', 'Fully Connected', 'HEALTHY']
];

for (const r of records) {
  insert.run(...r);
}

console.log('✅ Deep distinct records seeded for all 18 modules!');
