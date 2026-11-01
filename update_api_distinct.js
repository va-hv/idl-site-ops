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

    const andonStmt = db.prepare('SELECT * FROM AndonAlert')
    const andonAlerts = andonStmt.all()

    const logsStmt = db.prepare("SELECT * FROM ModuleLog WHERE moduleId = ? OR moduleId = 'control-tower'")
    const logs = logsStmt.all(moduleId)

    const deepStmt = db.prepare('SELECT * FROM ModuleDeepRecord WHERE moduleId = ?')
    let deepRecords = deepStmt.all(moduleId)

    if (deepRecords.length === 0) {
      deepRecords = [
        { id: 'gen-1', moduleId, col1Label: 'Operational Entity', col1Val: moduleId.toUpperCase() + ' Baseline', col2Label: 'Node Target', col2Val: 'YYZ-01 Whitby', col3Label: 'Governance', col3Val: 'Encrypted SSOT', col4Label: 'Status', col4Val: 'NOMINAL', badgeState: 'ACTIVE' }
      ]
    }

    return NextResponse.json({
      success: true,
      moduleId,
      metrics,
      owner,
      andonAlerts,
      logs,
      deepRecords,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}
`;

fs.writeFileSync(targetPath, apiContent, 'utf8');
console.log('✅ Updated API endpoint for distinct deep records!');
