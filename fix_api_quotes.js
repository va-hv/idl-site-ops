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

    const empStmt = db.prepare('SELECT * FROM Employee')
    const employees = empStmt.all()

    const andonStmt = db.prepare('SELECT * FROM AndonAlert')
    const andonAlerts = andonStmt.all()

    const logsStmt = db.prepare("SELECT * FROM ModuleLog WHERE moduleId = ? OR moduleId = 'control-tower'")
    const logs = logsStmt.all(moduleId)

    const specificStmt = db.prepare('SELECT * FROM ModuleSpecificData WHERE moduleId = ?')
    let specifics = specificStmt.all(moduleId)

    if (specifics.length === 0) {
      specifics = [
        { id: 'gen-1', moduleId, primaryField: 'Standard Enterprise Operational Baseline', secondaryField: 'YYZ-01 Hub Node Sync', statusField: 'ACTIVE', metricField: 'Nominal Operations', timestampField: 'Real-time' }
      ]
    }

    return NextResponse.json({
      success: true,
      moduleId,
      metrics,
      employees,
      andonAlerts,
      logs,
      specifics,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}
`;

fs.writeFileSync(targetPath, apiContent, 'utf8');
console.log('✅ Successfully fixed string quotes in API route!');
