const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

console.log('🚀 Ambari Simulation Sink Active. Pumping live telemetry into SQLite...');

const modules = [
  'transit-fleet', 'cold-chain', 'yard-ops', 'sorter-hub', 
  'conveyor-line', 'dock-scheduler', 'agv-fleet', 'robo-picker',
  'hazmat-audit', 'solar-grid', 'battery-bms', 'rfid-gate',
  'perimeter-sec', 'water-flow', 'hvac-climate', 'fire-suppression',
  'edge-cluster', 'network-mesh'
];

const eventTypes = ['METRIC_UPDATE', 'WARNING_THRESHOLD', 'HEARTBEAT', 'TELEMETRY_SYNC'];
const severities = ['INFO', 'INFO', 'WARNING', 'CRITICAL'];

function pumpSimulation() {
  try {
    const mod = modules[Math.floor(Math.random() * modules.length)];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const sev = severities[Math.floor(Math.random() * severities.length)];
    const id = 'sim-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO SimulationEvent (id, moduleId, eventType, payload, severity, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, 
      mod, 
      type, 
      JSON.stringify({ cpuLoad: (Math.random() * 40 + 30).toFixed(1) + '%', temp: (Math.random() * 15 + 20).toFixed(1) + '°C', status: 'nominal' }), 
      sev, 
      now
    );
  } catch (err) {
    // Silent catch during table initialization
  }
}

setInterval(pumpSimulation, 3000);
