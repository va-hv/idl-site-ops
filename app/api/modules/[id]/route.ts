import { NextResponse } from 'next/server';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const moduleId = resolvedParams.id;

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new DatabaseSync(dbPath);

    let metaStmt = db.prepare('SELECT * FROM ModuleMeta WHERE id = ?');
    let meta = metaStmt.get(moduleId);

    if (!meta) {
      const title = moduleId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO ModuleMeta (id, title, category, description, leadName, leadSla, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(moduleId, title, 'Enterprise Operations', `Live operational telemetry and automated controls for ${title}.`, 'Operations Lead', '99.9%', 'Activity');
      meta = metaStmt.get(moduleId);
    }

    const metricsStmt = db.prepare('SELECT * FROM ModuleMetric WHERE moduleId = ?');
    const metrics = metricsStmt.all(moduleId);

    const panelsStmt = db.prepare('SELECT * FROM ModulePanel WHERE moduleId = ?');
    const panels = panelsStmt.all(moduleId);

    return NextResponse.json({
      meta,
      metrics,
      panels
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
