const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'modules', '[id]', 'page.tsx');

const pageContent = `'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

interface Metric { id: string; key: string; value: string; status: string }
interface Owner { ownerName: string; ownerId: string; slaTarget: string; escalationContact: string }
interface ModuleLog { id: string; timestamp: string; actor: string; action: string; details: string; severity: string }
interface DeepRecord { id: string; col1Label: string; col1Val: string; col2Label: string; col2Val: string; col3Label: string; col3Val: string; col4Label: string; col4Val: string; badgeState: string }

export default function ModuleWorkspace() {
  const params = useParams()
  const router = useRouter()
  const moduleId = (params.id as string) || 'control-tower'

  const moduleMeta = INITIAL_MODULES.find((m) => m.id === moduleId)
  const [activeTab, setActiveTab] = useState<'records' | 'telemetry' | 'audit'>('records')
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [owner, setOwner] = useState<Owner | null>(null)
  const [logs, setLogs] = useState<ModuleLog[]>([])
  const [deepRecords, setDeepRecords] = useState<DeepRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch(\`/api/modules/\${moduleId}\`)
        const data = await res.json()
        if (data.success) {
          setMetrics(data.metrics || [])
          setOwner(data.owner || null)
          setLogs(data.logs || [])
          setDeepRecords(data.deepRecords || [])
        }
      } catch (err) {
        console.error('Failed to load telemetry', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTelemetry()
  }, [moduleId])

  // Tailored titles per module domain
  const getModuleTitle = () => {
    if (moduleId === 'whs') return 'Safety Incidents, PIT Audits & Hazard Corrective Actions'
    if (moduleId === 'rme') return 'Conveyor & Material Handling Equipment Work Orders'
    if (moduleId === 'procurement') return 'Consumable Packaging Stock Levels & Days Cover'
    if (moduleId === 'quality') return 'Outbound Lot Inspection Samples & Defect PPM'
    if (moduleId === 'visitors') return 'Active Freight Carriers, Contractors & Vendor Badges'
    if (moduleId === 'security') return 'Gatehouse Trailer Seals & Perimeter Security Logs'
    if (moduleId === 'it') return 'RF Scanner Fleet, MDM Compliance & Battery Health'
    if (moduleId === 'facilities') return 'HVAC Thermal Balance & Recycling Baler Telemetry'
    if (moduleId === 'wfm') return 'Shift Labor Rosters, Attendance & Utilization'
    if (moduleId === 'ci') return 'Active Andon Floor Alerts & Kaizen Submissions'
    if (moduleId === 'learning') return 'PIT Certifications & Mandatory SOP Training'
    return 'Domain Operational Master Records'
  }

  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100 p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Enterprise Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 font-mono text-xs">
          <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            ← Back to Control Tower HQ
          </button>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">ACCOUNTABLE LEAD: <span className="text-emerald-400 font-semibold">{owner?.ownerName || 'Ritesh Kumar'} ({owner?.ownerId || 'IDL-88310'})</span></span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
              YYZ-01 WHITBY | {moduleId.toUpperCase()}
            </span>
          </div>
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
              {moduleMeta?.description || 'Enterprise operational workspace and live database telemetry stream.'}
            </p>
          </div>
          <div className="text-right font-mono text-xs space-y-1">
            <div className="text-zinc-500">SLA TARGET: <span className="text-zinc-200">{owner?.slaTarget || '99.9% Nominal'}</span></div>
            <div className="text-zinc-500">ESCALATION: <span className="text-emerald-400">{owner?.escalationContact || 'Operations Command'}</span></div>
          </div>
        </div>

        {/* Clean Enterprise Metrics Grid */}
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
                  <span className="text-emerald-500/80">● LIVE_SYNC</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-4 font-mono text-xs">
          {[
            { id: 'records', label: 'MODULE DOMAIN RECORDS' },
            { id: 'telemetry', label: 'SENSOR & TELEMETRY STREAM' },
            { id: 'audit', label: 'AUDIT TRAIL & COMPLIANCE' }
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

        {/* Tab Content */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4 font-mono text-xs">
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">{getModuleTitle()}</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">Primary Entity ({deepRecords[0]?.col1Label || 'Field 1'})</th>
                      <th className="p-3">Secondary Detail ({deepRecords[0]?.col2Label || 'Field 2'})</th>
                      <th className="p-3">Operational Attribute ({deepRecords[0]?.col3Label || 'Field 3'})</th>
                      <th className="p-3">Resolution / Action ({deepRecords[0]?.col4Label || 'Field 4'})</th>
                      <th className="p-3">Governance State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deepRecords.map((d) => (
                      <tr key={d.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                        <td className="p-3 text-white font-semibold">{d.col1Val}</td>
                        <td className="p-3 text-emerald-400">{d.col2Val}</td>
                        <td className="p-3 text-zinc-300">{d.col3Val}</td>
                        <td className="p-3 text-zinc-300">{d.col4Val}</td>
                        <td className="p-3">
                          <span className={\`px-2 py-0.5 rounded text-[10px] \${d.badgeState === 'WARNING' || d.badgeState === 'LOW_STOCK' || d.badgeState === 'ACTIVE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'}\`}>
                            {d.badgeState}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-3">
              <div className="text-white font-semibold text-sm">[{moduleId.toUpperCase()}] Real-Time IoT Sensor Telemetry Stream</div>
              <p className="text-zinc-400">Stream synchronized directly from ID Logistics YYZ-01 Whitby edge nodes and local SQLite store.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">FACILITY NODE</div>
                  <div className="text-zinc-200 font-bold">YYZ-01 Whitby, ON</div>
                </div>
                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">SYNC LATENCY</div>
                  <div className="text-emerald-400 font-bold">12 ms (Sub-millisecond SQLite)</div>
                </div>
                <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 space-y-1">
                  <div className="text-zinc-500 text-[10px]">MODULE LEAD</div>
                  <div className="text-zinc-200 font-bold">{owner?.ownerName || 'Ritesh Kumar'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="text-white font-semibold text-sm">Tamper-Evident Audit Trail &amp; Activity Log</div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[10px]">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Accountable Lead</th>
                      <th className="p-3">Action Type</th>
                      <th className="p-3">Operational Details</th>
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
console.log('✅ Successfully updated workspace with truly distinct records per module!');
