#!/bin/bash
set -e

echo "🚀 Starting Ambari Command Center (ACC) end-to-end setup..."

# 1. Clone the fresh repository if not already in it
if [ ! -d "idl-site-ops" ]; then
    echo "📦 Cloning repository..."
    git clone https://github.com/va-hv/idl-site-ops.git idl-site-ops
fi

cd idl-site-ops

# 2. Install dependencies
echo "📥 Installing dependencies..."
npm install

# 3. Create prisma directory and seed script if missing
mkdir -p prisma

echo "⚙️ Creating database initialization script..."
cat << 'EOM' > seed-db.js
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
EOM

# 4. Initialize database
echo "🗄️ Initializing SQLite database..."
node seed-db.js

# 5. Start background simulation worker
echo "🔄 Starting background telemetry simulation sink..."
node simulation-sink.js &

# 6. Start Next.js dev server
echo "✨ Launching Next.js development server..."
npm run dev
