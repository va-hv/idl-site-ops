const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'page.tsx');

const dashboardContent = `'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

export default function ControlTowerHQ() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { timeZone: 'America/Toronto', hour12: false }) + ' EST')
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  const categories = ['ALL', 'CORE OPERATIONS', 'FACILITY & ASSETS', 'GOVERNANCE & HR']

  const filteredModules = INITIAL_MODULES.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategory === 'ALL') return matchesSearch
    return matchesSearch && m.category.toUpperCase().includes(selectedCategory.includes('CORE') ? 'CORE' : selectedCategory.includes('FACILITY') ? 'FACILITY' : 'GOVERNANCE')
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] via-[#070913] to-[#04050a] text-zinc-100 flex font-sans selection:bg-indigo-500/30">
      
      {/* Left Icon Sidebar Rail */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-6 justify-between bg-[#080b14]/80 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 font-bold text-white text-sm">
            IDL
          </div>
          <nav className="space-y-3 pt-4">
            <button className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              ☷
            </button>
            <button className="w-11 h-11 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              ⚡
            </button>
            <button className="w-11 h-11 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              📊
            </button>
            <button className="w-11 h-11 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              🛡️
            </button>
          </nav>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
          ⚙
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono tracking-wider">
                NODE: YYZ-01 WHITBY
              </span>
              <span className="text-xs text-zinc-400 font-mono">{currentTime}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Enterprise Control Tower</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search modules, KPIs, or assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 bg-[#121629]/80 border border-white/10 rounded-full px-5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 shadow-inner"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#0c0f1d] rounded-full flex items-center justify-center font-bold text-xs">
                RK
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
          {/* Gradient Hero Card */}
          <div className="bg-gradient-to-br from-indigo-900/50 via-[#121629]/80 to-[#0c0f1d] border border-indigo-500/30 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-indigo-200 group-hover:scale-110 transition-transform">↗</div>
            <div className="text-xs text-indigo-300 uppercase tracking-widest font-semibold">Fulfillment Throughput</div>
            <div className="text-4xl font-extrabold text-white tracking-tight">42,850 <span className="text-xs text-indigo-300 font-normal">Units / day</span></div>
            <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 inline-block px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              +14% vs last week
            </div>
          </div>

          <div className="bg-[#121629]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">Active Shift Headcount</div>
            <div className="text-4xl font-extrabold text-white">184</div>
            <div className="text-[11px] text-zinc-400">96.8% attendance rate</div>
          </div>

          <div className="bg-[#121629]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">Safety TRIR Rate</div>
            <div className="text-4xl font-extrabold text-white">0.42</div>
            <div className="text-[11px] text-emerald-400">Zero lost-time incidents YTD</div>
          </div>

          <div className="bg-[#121629]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">Conveyor System Uptime</div>
            <div className="text-4xl font-extrabold text-white">99.1%</div>
            <div className="text-[11px] text-indigo-400">PLC telemetry nominal</div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'bg-[#121629]/60 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-zinc-400">Showing {filteredModules.length} Enterprise Modules</span>
        </div>

        {/* Modules Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => router.push(\`/modules/\${mod.id}\`)}
              className="bg-[#121629]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/50 hover:bg-[#151a33]/80 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/5 text-indigo-300 border border-white/10 uppercase tracking-wider">
                  {mod.category}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  ↗
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{mod.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{mod.description}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE SQL SYNC
                </span>
                <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Open Workspace →</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
`;

fs.writeFileSync(targetPath, dashboardContent, 'utf8');
console.log('✅ Successfully applied reference UI bento-grid theme to Control Tower HQ!');
