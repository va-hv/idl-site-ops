const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'api', 'modules', '[id]', 'route.ts');

const apiContent = `import { NextResponse } from 'next/server'
import { DatabaseSync } from 'node:sqlite'
import path from 'path'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const moduleId = resolvedParams.id

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new DatabaseSync(dbPath)

    const metricsStmt = db.prepare('SELECT * FROM Metric WHERE moduleId = ?')
    const metrics = metricsStmt.all(moduleId)

    const ownerStmt = db.prepare('SELECT * FROM ModuleOwner WHERE moduleId = ?')
    const owner = ownerStmt.get(moduleId) || { ownerName: 'Ritesh Kumar', ownerId: 'IDL-88310', slaTarget: '99.9% Nominal SLA', escalationContact: 'Operations Command' }

    const logsStmt = db.prepare("SELECT * FROM ModuleLog WHERE moduleId = ? OR moduleId = 'control-tower'")
    const logs = logsStmt.all(moduleId)

    const panelsStmt = db.prepare('SELECT * FROM EnterprisePanel WHERE moduleId = ?')
    let panels = panelsStmt.all(moduleId)

    if (panels.length === 0) {
      panels = [
        { id: 'gen-1', moduleId, panelTitle: 'Primary Operational Dashboard', cardType: 'METRIC', metricName: 'Baseline Node Sync', metricValue: 'YYZ-01 Active', statusText: 'Nominal', extraMeta: 'Real-time telemetry synchronized' }
      ]
    }

    // Fetch live simulation events for this module
    const simStmt = db.prepare('SELECT * FROM SimulationEvent WHERE moduleId = ? ORDER BY createdAt DESC LIMIT 10')
    const simEvents = simStmt.all(moduleId)

    return NextResponse.json({
      success: true,
      moduleId,
      metrics,
      owner,
      logs,
      panels,
      simEvents,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}
`;

fs.writeFileSync(targetPath, apiContent, 'utf8');
console.log('✅ Updated API endpoint with live simulation events stream!');
