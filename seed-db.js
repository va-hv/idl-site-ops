const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Initializing Ambari Command Center (ACC) Relational Database Schema...');

db.exec(`
  CREATE TABLE IF NOT EXISTS ModuleMeta (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT,
    description TEXT,
    leadName TEXT,
    leadSla TEXT,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS ModuleMetric (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    metricKey TEXT,
    metricValue TEXT,
    status TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS ModulePanel (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    title TEXT,
    metricName TEXT,
    metricValue TEXT,
    badge TEXT,
    meta TEXT
  );

  CREATE TABLE IF NOT EXISTS SimulationEvent (
    id TEXT PRIMARY KEY,
    moduleId TEXT,
    eventType TEXT,
    payload TEXT,
    severity TEXT,
    createdAt TEXT
  );
`);

console.log('✅ SQLite Schema tables verified and ready.');
