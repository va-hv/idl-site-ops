const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS SimulationEvent (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    eventType TEXT,
    payload TEXT,
    severity TEXT,
    createdAt TEXT
  );
`);

const insertEvent = db.prepare('INSERT OR REPLACE INTO SimulationEvent (id, moduleId, eventType, payload, severity, createdAt) VALUES (?, ?, ?, ?, ?, ?)');

console.log('🚀 Ambari Simulation Sink Active. Pumping live telemetry into SQLite...');

const modules = ['operations-overview', 'whs', 'rme', 'procurement', 'quality', 'visitors', 'security', 'it', 'facilities'];

function tickSimulation() {
  const now = new Date().toISOString();
  modules.forEach(mod => {
    let eventType = 'ACC_TELEMETRY_PULSE';
    let payload = 'Ambari secure node sync operational for ' + mod + '. State nominal.';
    let severity = 'INFO';

    if (mod === 'whs') {
      eventType = 'PIT_CHECKLIST_SYNC';
      payload = 'Forklift Unit #' + (Math.floor(Math.random() * 15) + 1) + ' pre-shift sensor check passed.';
    } else if (mod === 'rme') {
      eventType = 'PLC_CONVEYOR_TELEMETRY';
      payload = 'Sortation Loop motor amp draw: ' + (12 + Math.random() * 3).toFixed(2) + 'A.';
    } else if (mod === 'procurement') {
      eventType = 'SKU_INVENTORY_DRAIN';
      payload = 'Consumable SKU BOX-C12 stock cover: ' + (10 + Math.random()).toFixed(1) + ' days.';
    } else if (mod === 'visitors') {
      eventType = 'CARRIER_DOCK_EVENT';
      payload = 'Freight carrier #TR-' + (Math.floor(Math.random() * 8999) + 1000) + ' checked into Dock Bay.';
    }

    const eventId = 'sim-' + mod + '-' + Date.now();
    try {
      insertEvent.run(eventId, mod, eventType, payload, severity, now);
    } catch (err) {}
  });
}

setInterval(tickSimulation, 4000);
