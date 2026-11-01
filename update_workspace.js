const fs = require('fs');
const path = require('path');

const pageContent = `'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

interface Metric {
  id: string
  key: string
  value: string
  status: string
}

interface Employee {
  id: string
  employeeId: string
  name: string
  department: string
  shift: string
  status: string
}

interface AndonAlert {
  id: string
  alertId: string
  station: string
  issue: string
  duration: string
  status: string
}

export default function ModuleWorkspace() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string

  const moduleMeta = INITIAL_MODULES.find((m) => m.id === moduleId)
  const [activeTab, setActiveTab] = useState<'metrics' | 'roster' | 'alerts' | 'settings'>('metrics')
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [andonAlerts, setAndonAlerts] = useState<AndonAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch(\`/api/modules/\${moduleId}\`)
        const data = await res.json()
        if (data.success) {
          setMetrics(data.metrics || [])
          setEmployees(data.employees || [])
          setAndonAlerts(data.andonAlerts || [])
        }
      } catch (err) {
        console.error('Failed to load telemetry', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTelemetry()
  }, [moduleId])

  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 font-mono text-xs">
          <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            ← Back to Control Tower HQ
          </button>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
            NODE: YYZ-01 WHITBY | {moduleId.toUpperCase()} WORKSPACE
          </span>
        </div>

        {/* Module Banner */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
              {moduleMeta?.category || moduleId}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-2">
              {moduleMeta?.title || moduleId.toUpperCase()}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              {moduleMeta?.description || 'Enterprise operational workspace and live database telemetry stream.'}
            </p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded-lg transition-colors">
            + Log Event / Action
          </button>
        </div>

        {/* Live Metrics Grid from SQLite */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {loading ? (
            <div className="text-xs text-zinc-500 col-span-4 p-6 text-center">Loading live telemetry from SQLite database...</div>
          ) : metrics.length > 0 ? (
            metrics.map((m) => (
              <div key={m.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{m.key}</div>
                <div className="text-2xl font-bold text-emerald-400">{m.value}</div>
                <div className="text-[10px] text-zinc-500">Status: <span className={m.status === 'WARNING' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}>{m.status}</span></div>
              </div>
            ))
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-2 col-span-4">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Module Status</div>
              <div className="text-xl font-bold text-emerald-400">● Fully Operational</div>
            </div>
          )}
        </div>

        {/* Workspace Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-4 font-mono text-xs">
          {['metrics', 'roster', 'alerts', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={\`px-4 py-2 rounded-lg border transition-colors \${
                activeTab === tab
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }\`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Content Stream */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4 font-mono text-xs">
          {activeTab === 'metrics' && (
            <div className="space-y-3">
              <div className="text-white font-semibold text-sm">Live Database Telemetry Stream</div>
              <p className="text-zinc-400">All metrics and telemetry feeds are queried directly in real-time from local SQLite (\`prisma/dev.db\`) for ID Logistics YYZ-01 Whitby.</p>
            </div>
          )}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">Active Personnel &amp; Shift Roster</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Shift</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                        <td className="p-3 text-emerald-400 font-bold">{emp.employeeId}</td>
                        <td className="p-3 text-white">{emp.name}</td>
                        <td className="p-3 text-zinc-300">{emp.department}</td>
                        <td className="p-3 text-zinc-400">{emp.shift}</td>
                        <td className="p-3 text-emerald-400 font-semibold">● {emp.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">Active Floor &amp; Safety Andon Alerts</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">Alert ID</th>
                      <th className="p-3">Station</th>
                      <th className="p-3">Issue Description</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {andonAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                        <td className="p-3 text-amber-400 font-bold">{alert.alertId}</td>
                        <td className="p-3 text-white">{alert.station}</td>
                        <td className="p-3 text-zinc-300">{alert.issue}</td>
                        <td className="p-3 text-zinc-400">{alert.duration}</td>
                        <td className="p-3 text-amber-400 font-semibold">⚠ {alert.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-3">
              <div className="text-white font-semibold text-sm">Module Thresholds &amp; RBAC Control</div>
              <p className="text-zinc-400">Configure automated escalation triggers, safety threshold limits, and supervisor approval permissions for YYZ-01.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
`;

const dir = path.join(__dirname, 'app', 'modules', '[id]');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf8');
console.log('✅ Updated module workspace to dynamically render employee rosters and alerts across all modules!');
