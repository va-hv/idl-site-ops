'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'erd' | 'principles' | 'stack'>('erd');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/85 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
            A
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg text-white">Ambari Command Center</h1>
            <p className="text-xs text-slate-400">Enterprise Site Operations & Architecture Deck</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            ← Return to Control Tower
          </Link>
        </div>
      </header>

      <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-3 flex space-x-6">
        <button
          onClick={() => setActiveTab('erd')}
          className={`pb-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'erd' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Entity-Relationship Diagram (ERD)
        </button>
        <button
          onClick={() => setActiveTab('principles')}
          className={`pb-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'principles' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Design Principles & Scalability
        </button>
        <button
          onClick={() => setActiveTab('stack')}
          className={`pb-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'stack' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Real-Time Data Pipeline
        </button>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'erd' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2">Normalized 4-Table SQLite Architecture</h2>
              <p className="text-sm text-slate-400 mb-6">
                Optimized polymorphic relational model powering all enterprise facility modules with sub-millisecond query performance.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 overflow-x-auto">
                <svg viewBox="0 0 900 450" className="w-full h-auto min-w-[700px]">
                  <path d="M 220 120 L 400 120" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
                  <path d="M 220 150 L 450 300" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
                  <path d="M 680 120 L 730 120" stroke="#10b981" strokeWidth="2" />
                  <path d="M 680 320 L 730 320" stroke="#f59e0b" strokeWidth="2" />

                  <g transform="translate(40, 60)">
                    <rect width="180" height="140" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <rect width="180" height="36" rx="8" fill="#312e81" />
                    <text x="90" y="23" fill="#cbd5e1" fontSize="13" fontWeight="bold" textAnchor="middle">ModuleMeta</text>
                    <text x="15" y="60" fill="#94a3b8" fontSize="11">🔑 id (PK)</text>
                    <text x="15" y="85" fill="#e2e8f0" fontSize="11">title, category</text>
                    <text x="15" y="110" fill="#e2e8f0" fontSize="11">leadName, sla</text>
                  </g>

                  <g transform="translate(400, 60)">
                    <rect width="280" height="140" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <rect width="280" height="36" rx="8" fill="#065f46" />
                    <text x="140" y="23" fill="#cbd5e1" fontSize="13" fontWeight="bold" textAnchor="middle">ModuleMetric</text>
                    <text x="15" y="60" fill="#94a3b8" fontSize="11">🔑 id (PK)</text>
                    <text x="15" y="85" fill="#34d399" fontSize="11">🔗 moduleId (FK → ModuleMeta)</text>
                    <text x="15" y="110" fill="#e2e8f0" fontSize="11">metricKey, value, status</text>
                  </g>

                  <g transform="translate(400, 240)">
                    <rect width="280" height="140" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <rect width="280" height="36" rx="8" fill="#92400e" />
                    <text x="140" y="23" fill="#cbd5e1" fontSize="13" fontWeight="bold" textAnchor="middle">ModulePanel</text>
                    <text x="15" y="60" fill="#94a3b8" fontSize="11">🔑 id (PK)</text>
                    <text x="15" y="85" fill="#fbbf24" fontSize="11">🔗 moduleId (FK → ModuleMeta)</text>
                    <text x="15" y="110" fill="#e2e8f0" fontSize="11">title, badge, meta</text>
                  </g>

                  <g transform="translate(730, 160)">
                    <rect width="160" height="180" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <rect width="160" height="36" rx="8" fill="#831843" />
                    <text x="80" y="23" fill="#cbd5e1" fontSize="13" fontWeight="bold" textAnchor="middle">SimulationEvent</text>
                    <text x="15" y="60" fill="#94a3b8" fontSize="11">🔑 id (PK)</text>
                    <text x="15" y="85" fill="#f472b6" fontSize="11">moduleId (Indexed)</text>
                    <text x="15" y="110" fill="#e2e8f0" fontSize="11">eventType, payload</text>
                    <text x="15" y="135" fill="#e2e8f0" fontSize="11">severity, createdAt</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'principles' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Design Principles & Scalability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-indigo-400 mb-2">1. Local-First Architecture</h3>
                  <p className="text-sm text-slate-300">
                    Utilizing native Node.js node:sqlite directly interacting with prisma/dev.db eliminates network latency and external database connection overhead.
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-indigo-400 mb-2">2. Autonomous Background Workers</h3>
                  <p className="text-sm text-slate-300">
                    The simulation-sink.js worker operates asynchronously, pumping realistic domain telemetry events into SQLite without blocking API routes.
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-indigo-400 mb-2">3. Zero-Latency UI Polling</h3>
                  <p className="text-sm text-slate-300">
                    Frontend workspaces leverage optimized React hooks polling localized SQLite views for instantaneous status updates.
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <h3 className="font-semibold text-indigo-400 mb-2">4. Enterprise Governance</h3>
                  <p className="text-sm text-slate-300">
                    Modeled after rigorous second-line-of-defense (2LOD) control testing standards to guarantee auditability and high SLA compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stack' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2">Real-Time Data Pipeline</h2>
              <p className="text-sm text-slate-400 mb-6">
                End-to-end data flow from autonomous background producers to localized client dashboards.
              </p>
              <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="px-2 py-1 bg-indigo-900 text-indigo-300 rounded">Producer</span>
                  <span>simulation-sink.js generates telemetry events every 3s</span>
                </div>
                <div className="text-center text-slate-600">↓ writes via node:sqlite</div>
                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="px-2 py-1 bg-emerald-900 text-emerald-300 rounded">Storage</span>
                  <span>Normalized SQLite Database (prisma/dev.db)</span>
                </div>
                <div className="text-center text-slate-600">↓ queried via Next.js API Routes</div>
                <div className="flex items-center space-x-4 p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="px-2 py-1 bg-amber-900 text-amber-300 rounded">Consumer</span>
                  <span>Ambari Command Center Control Tower & Workspace UI</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
