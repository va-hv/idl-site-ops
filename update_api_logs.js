const fs = require('fs');
const path = require('path');

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

    // Fetch module specific logs, or fallback to general logs if none specific exist
    const logsStmt = db.prepare('SELECT * FROM ModuleLog WHERE moduleId = ? OR moduleId = \\'control-tower\\'')
    const logs = logsStmt.all(moduleId)

    return NextResponse.json({
      success: true,
      moduleId,
      metrics,
      employees,
      andonAlerts,
      logs,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}
`;

fs.writeFileSync(path.join(__dirname, 'app', 'api', 'modules', '[id]', 'route.ts'), apiContent, 'utf8');
console.log('✅ Updated API route to return module-specific logs!');
