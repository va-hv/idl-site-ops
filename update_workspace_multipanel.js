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
interface EnterprisePanel { id: string; panelTitle: string; cardType: string; metricName: string; metricValue: string; statusText: string; extraMeta: string }

export default function ModuleWorkspace() {
  const params = useParams()
  const router = useRouter()
  const moduleId = (params.id as string) || 'control-tower'

  const moduleMeta = INITIAL_MODULES.find((m) => m.id === moduleId)
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [owner, setOwner] = useState<Owner | null>(null)
  const [logs, setLogs] = useState<ModuleLog[]>([])
  const [panels, setPanels] = useState<EnterprisePanel[]>([])
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
          setPanels(data.panels || [])
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
              {moduleMeta?.description || 'Enterprise operational command and business intelligence dashboard.'}
            </p>
          </div>
          <div className="text-right font-mono text-xs space-y-1">
            <div className="text-zinc-500">SLA TARGET: <span className="text-zinc-200">{owner?.slaTarget || '99.9% Nominal'}</span></div>
            <div className="text-zinc-500">ESCALATION: <span className="text-emerald-400">{owner?.escalationContact || 'Operations Command'}</span></div>
          </div>
        </div>

        {/* KPI Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {loading ? (
            <div className="text-xs text-zinc-500 col-span-4 p-6 text-center">Loading live metrics...</div>
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

        {/* MULTI-PANEL BUSINESS DASHBOARD (No rigid tabs - all relevant business views rendered cleanly) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {panels.map((panel) => (
            <div key={panel.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{panel.panelTitle}</span>
                <span className={\`px-2 py-0.5 rounded text-[10px] \${panel.statusText === 'Action Required' || panel.statusText === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'}\`}>
                  {panel.statusText}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-emerald-400">{panel.metricName}</div>
                <div className="text-xs text-zinc-300 font-semibold">{panel.metricValue}</div>
                <div className="text-[11px] text-zinc-400 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/60 flex justify-between items-center">
                  <span>Context: {panel.extraMeta}</span>
                  <span className="text-emerald-500/80 font-bold">VERIFIED</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM AUDIT TRAIL & COMPLIANCE FEED */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="text-white font-semibold text-sm">Tamper-Evident Audit Trail &amp; Business Compliance Log</div>
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
      </div>
    </main>
  )
}
`;

fs.writeFileSync(targetPath, pageContent, 'utf8');
console.log('✅ Successfully updated workspace into a multi-panel enterprise command dashboard!');
