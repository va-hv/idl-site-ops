const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'modules', '[id]', 'page.tsx');

const pageContent = `'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

interface Metric { id: string; key: string; value: string; status: string }
interface Employee { id: string; employeeId: string; name: string; department: string; shift: string; status: string }
interface AndonAlert { id: string; alertId: string; station: string; issue: string; duration: string; status: string }
interface ModuleLog { id: string; timestamp: string; actor: string; action: string; details: string; severity: string }
interface SpecificData { id: string; primaryField: string; secondaryField: string; statusField: string; metricField: string; timestampField: string }

export default function ModuleWorkspace() {
  const params = useParams()
  const router = useRouter()
  const moduleId = (params.id as string) || 'control-tower'

  const moduleMeta = INITIAL_MODULES.find((m) => m.id === moduleId)
  const [activeTab, setActiveTab] = useState<'operations' | 'metrics' | 'roster' | 'logs'>('operations')
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [andonAlerts, setAndonAlerts] = useState<AndonAlert[]>([])
  const [logs, setLogs] = useState<ModuleLog[]>([])
  const [specifics, setSpecifics] = useState<SpecificData[]>([])
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
          setLogs(data.logs || [])
          setSpecifics(data.specifics || [])
        }
      } catch (err) {
        console.error('Failed to load telemetry', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTelemetry()
  }, [moduleId])

  // Custom table headers & titles per module domain
  const getDomainConfig = () => {
    if (moduleId === 'whs') return { title: 'Safety Compliance Audits, PIT Checklists & Hazard Logs', col1: 'Inspection / Audit Task', col2: 'Asset / Zone Location', col3: 'Verification Status', col4: 'Metrics & Findings' }
    if (moduleId === 'rme') return { title: 'Material Handling Equipment Work Orders & Asset Repairs', col1: 'Maintenance Task / Asset Description', col2: 'Equipment / Line ID', col3: 'Repair Status', col4: 'Action Taken / Parts' }
    if (moduleId === 'procurement') return { title: 'Consumable Packaging SKU Inventory & Stock Levels', col1: 'Consumable Item Description', col2: 'SKU Code', col3: 'Stock Status', col4: 'Inventory Cover Level' }
    if (moduleId === 'quality') return { title: 'Outbound Quality Inspections & Quarantine Logs', col1: 'Inspection Item / Sample Batch', col2: 'Batch SKU / Location', col3: 'Inspection Result', col4: 'Defect Rate / Hold Details' }
    if (moduleId === 'visitors') return { title: 'Third-Party Logistics Carriers, Vendors & Contractors on Site', col1: 'Company / Vendor Name', col2: 'Reference & Personnel', col3: 'Access Status', col4: 'Dock / Gate Location' }
    if (moduleId === 'security') return { title: 'Gatehouse Security Logs & Trailer Seal Compliance', col1: 'Security Inspection Task', col2: 'Trailer / Badge Reference', col3: 'Compliance State', col4: 'Verification Notes' }
    if (moduleId === 'it') return { title: 'RF Scanners, Vehicle Terminals & IT Device Fleet', col1: 'Hardware System Description', col2: 'Fleet Status / Count', col3: 'MDM Compliance', col4: 'Battery & Technical Health' }
    if (moduleId === 'facilities') return { title: 'Facility HVAC Climate Control & Recycling Baler Telemetry', col1: 'Facility System Description', col2: 'Ambient / Operational State', col3: 'Performance Status', col4: 'Efficiency Metrics' }
    return { title: 'Domain-Specific Operational Master Records', col1: 'Record Title', col2: 'Reference ID', col3: 'State', col4: 'Operational Details' }
  }

  const domain = getDomainConfig()

  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100 p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 font-mono text-xs">
          <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            ← Back to Control Tower HQ
          </button>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
            NODE: YYZ-01 WHITBY | {moduleId.toUpperCase()} COMMAND SSOT
          </span>
        </div>

        {/* Module Banner */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 uppercase tracking-wider">
              {moduleMeta?.category || 'Enterprise Logistics'}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-2">
              {moduleMeta?.title || moduleId.toUpperCase()}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              {moduleMeta?.description || 'Real-time operational telemetry and SQLite synchronized database feed.'}
            </p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded-lg transition-colors shadow-lg">
            + Log {moduleMeta?.title || 'Operational'} Event
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {loading ? (
            <div className="text-xs text-zinc-500 col-span-4 p-6 text-center">Loading live telemetry from SQLite database...</div>
          ) : (
            metrics.map((m) => (
              <div key={m.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{m.key}</div>
                <div className="text-2xl font-bold text-emerald-400">{m.value}</div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>Status: <span className={m.status === 'WARNING' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}>{m.status}</span></span>
                  <span className="text-emerald-500/80">● SYNCED</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Workspace Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-4 font-mono text-xs">
          {[
            { id: 'operations', label: 'DOMAIN OPERATIONS & RECORDS' },
            { id: 'metrics', label: 'TELEMETRY STREAM' },
            { id: 'roster', label: 'ASSIGNED PERSONNEL' },
            { id: 'logs', label: 'AUDIT TRAIL & LOGS' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`px-4 py-2 rounded-lg border transition-colors \${
                activeTab === tab.id
                  ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Stream */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4 font-mono text-xs">
          {activeTab === 'operations' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">{domain.title}</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">{domain.col1}</th>
                      <th className="p-3">{domain.col2}</th>
                      <th className="p-3">{domain.col3}</th>
                      <th className="p-3">{domain.col4}</th>
                      <th className="p-3">Timestamp / Logged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specifics.length > 0 ? (
                      specifics.map((d) => (
                        <tr key={d.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                          <td className="p-3 text-white font-semibold">{d.primaryField}</td>
                          <td className="p-3 text-emerald-400">{d.secondaryField}</td>
                          <td className="p-3">
                            <span className={\`px-2 py-0.5 rounded text-[10px] \${d.statusField === 'WARNING' || d.statusField === 'ACTION_REQUIRED' || d.statusField === 'LOW_STOCK_WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'}\`}>
                              {d.statusField}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-300">{d.metricField}</td>
                          <td className="p-3 text-zinc-400">{d.timestampField}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-zinc-500">No active domain records found for this module.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-3">
              <div className="text-white font-semibold text-sm">[{moduleId.toUpperCase()}] Real-Time Telemetry Feed</div>
              <p className="text-zinc-400">Live operational KPI feed queried directly from SQLite database for ID Logistics YYZ-01 Whitby.</p>
            </div>
          )}

          {activeTab === 'roster' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">Assigned Shift Personnel &amp; Supervisors</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">ID</th>
                      <th className="p-3">Associate Name</th>
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

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">Audit Trail &amp; Activity Feed</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">Time</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Action Type</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                        <td className="p-3 text-zinc-400">{log.timestamp}</td>
                        <td className="p-3 text-white font-semibold">{log.actor}</td>
                        <td className="p-3 text-emerald-400">{log.action}</td>
                        <td className="p-3 text-zinc-300">{log.details}</td>
                        <td className="p-3">
                          <span className={\`px-2 py-0.5 rounded text-[10px] \${log.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-300'}\`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
`;

fs.writeFileSync(targetPath, pageContent, 'utf8');
console.log('✅ Successfully updated workspace with authentic module-specific domain tables!');
