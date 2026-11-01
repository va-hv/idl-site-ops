import { NextResponse } from 'next/server'
import { DatabaseSync } from 'node:sqlite'
import path from 'path'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const moduleId = params.id

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new DatabaseSync(dbPath)

    db.exec(`
      CREATE TABLE IF NOT EXISTS SimulationEvent (
        id TEXT PRIMARY KEY,
        moduleId TEXT,
        eventType TEXT,
        payload TEXT,
        severity TEXT,
        createdAt TEXT
      );
    `)

    const stmt = db.prepare('SELECT * FROM SimulationEvent WHERE moduleId = ? ORDER BY createdAt DESC LIMIT 10')
    const simEvents = stmt.all(moduleId)

    return NextResponse.json({ success: true, simEvents })
  } catch (err) {
    return NextResponse.json({ success: true, simEvents: [] })
  }
}
