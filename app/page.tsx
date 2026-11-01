'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

export default function AmbariCommandCenter() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [isCmdKOpen, setIsCmdKOpen] = useState(false)

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' EST')
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)

    // Cmd+K or Ctrl+K shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCmdKOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsCmdKOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const filteredModules = INITIAL_MODULES.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b14] via-[#05070c] to-[#020306] text-zinc-100 flex font-sans selection:bg-indigo-500/30 relative">
      
      {/* Left Icon Sidebar Rail */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-6 justify-between bg-[#060810]/90 backdrop-blur-xl shrink-0">
        <div className="space-y-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 font-extrabold text-white text-sm tracking-wider">
            ACC
          </div>
          <nav className="space-y-3 pt-4">
            <button className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              ☷
            </button>
            <button className="w-11 h-11 rounded-2xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              ⚡
            </button>
            <button className="w-11 h-11 rounded-2xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              📊
            </button>
            <button className="w-11 h-11 rounded-2xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              🛡️
            </button>
          </nav>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
          ⚙
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 space-y-8 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                AMBARI COMMAND CENTER (ACC) | NODE: SECURE-01
              </span>
              <span className="text-xs text-zinc-400 font-mono">{currentTime}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Ambari Operations Core</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCmdKOpen(true)}
              className="w-72 bg-[#0e1222]/80 border border-white/10 rounded-full px-5 py-2.5 text-xs text-zinc-400 flex items-center justify-between hover:border-indigo-500/50 transition-all shadow-inner"
            >
              <span>Quick Search modules...</span>
              <kbd className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">⌘K</kbd>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#080b14] rounded-full flex items-center justify-center font-bold text-xs">
                RK
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
          <div className="bg-gradient-to-br from-indigo-950/60 via-[#0e1222]/80 to-[#080b14] border border-indigo-500/30 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-indigo-200 group-hover:scale-110 transition-transform">↗</div>
            <div className="text-xs text-indigo-300 uppercase tracking-widest font-semibold">Throughput Velocity</div>
            <div className="text-4xl font-extrabold text-white tracking-tight">42,850 <span className="text-xs text-indigo-300 font-normal">Units / day</span></div>
            <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 inline-block px-3 py-1 rounded-full border border-emerald-500/20">
              +14% vs last week
            </div>
          </div>

          <div className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">Active Shift Headcount</div>
            <div className="text-4xl font-extrabold text-white">184</div>
            <div className="text-[11px] text-zinc-400">96.8% attendance rate</div>
          </div>

          <div className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">Safety TRIR Rate</div>
            <div className="text-4xl font-extrabold text-white">0.42</div>
            <div className="text-[11px] text-emerald-400">Zero lost-time incidents YTD</div>
          </div>

          <div className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/30 transition-all">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">System Uptime</div>
            <div className="text-4xl font-extrabold text-white">99.9%</div>
            <div className="text-[11px] text-indigo-400">Sub-millisecond sync</div>
          </div>
        </div>

        {/* Modules Bento Grid */}
        <div className="pt-2">
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-4">Ambari Command Center Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => router.push(`/modules/${mod.id}`)}
                className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl hover:border-indigo-500/50 hover:bg-[#131930]/80 transition-all cursor-pointer group relative overflow-hidden"
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
                    ACC LIVE SYNC
                  </span>
                  <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Open Workspace →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Command-K Search Modal */}
      {isCmdKOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-32 p-4 animate-fade-in">
          <div className="bg-[#0e1222] border border-indigo-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden font-mono">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-indigo-400 text-lg">🔍</span>
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                onClick={() => setIsCmdKOpen(false)}
                className="text-xs bg-white/5 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ESC
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider px-3 py-2">Quick Navigation</div>
              {filteredModules.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => {
                    setIsCmdKOpen(false)
                    router.push(`/modules/${mod.id}`)
                  }}
                  className="p-3 rounded-2xl hover:bg-indigo-600/20 hover:border hover:border-indigo-500/30 flex items-center justify-between cursor-pointer transition-all text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {mod.icon || '☷'}
                    </span>
                    <div>
                      <div className="font-bold text-white group-hover:text-indigo-300">{mod.title}</div>
                      <div className="text-[10px] text-zinc-400">{mod.category}</div>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white">Jump →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
