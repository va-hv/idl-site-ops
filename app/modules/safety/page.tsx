'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SafetyModuleWorkspace() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'certifications' | 'incidents' | 'loto'>('certifications')

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Control Tower HQ
          </button>
          <span className="px-3 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
            NODE: YYZ-01 WHITBY | SAFETY & COMPLIANCE SSOT
          </span>
        </div>

        {/* Title Banner */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 uppercase">
              WHS & Ergonomics
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-2">Safety Compliance & PIT Registry</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage associate licensing, lockout/tagout verifications, and ergonomic risk assessments.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded-lg transition-colors">
              + Log Safety Incident
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-zinc-800 pb-4 font-mono text-xs">
          {[
            { id: 'certifications', label: 'PIT & Certification Register' },
            { id: 'incidents', label: 'Incident & Near-Miss Logs' },
            { id: 'loto', label: 'Lockout/Tagout (LOTO) Status' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4 font-mono text-xs">
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Active Associate Certifications (YYZ-01 Whitby)</span>
                <span className="text-emerald-400">● Database Synchronized</span>
              </div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                      <th className="p-3">Employee ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Certification Type</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">IDL-88201</td>
                      <td className="p-3">Marcus Brody</td>
                      <td className="p-3">PIT Reach Truck & Forklift</td>
                      <td className="p-3">2027-11-14</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">ACTIVE</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-emerald-400">IDL-88204</td>
                      <td className="p-3">Sarah Jenkins</td>
                      <td className="p-3">LOTO Authorized Technician</td>
                      <td className="p-3">2026-09-30</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">EXPIRED (BLOCKED)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="text-zinc-400 space-y-2">
              <div className="text-white font-semibold">Recent Incident Reports</div>
              <p>No active lost-time injuries reported for the current shift. 1 near-miss logged in Zone C conveyor bypass.</p>
            </div>
          )}

          {activeTab === 'loto' && (
            <div className="text-zinc-400 space-y-2">
              <div className="text-white font-semibold">Active Lockout/Tagout Registry</div>
              <p>All conveyor line maintenance lockouts verified and cleared by certified RME supervisors.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
