'use client'

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEmp, setSelectedEmp] = useState('')
  const [selectedJob, setSelectedJob] = useState('')
  const [selectedZone, setSelectedZone] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/assignments')
      const json = await res.json()
      setData(json)
      if (json.employees?.length) setSelectedEmp(json.employees[0].id)
      if (json.jobFunctions?.length) setSelectedJob(json.jobFunctions[0].id)
      if (json.zones?.length) setSelectedZone(json.zones[0].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: selectedEmp,
        jobFunctionId: selectedJob,
        zoneId: selectedZone,
        overrideReason: overrideReason || undefined
      })
    })

    const json = await res.json()
    if (json.success) {
      setMessage({ type: 'success', text: '✅ Assignment successful! Safety validation passed.' })
      setOverrideReason('')
      fetchData()
    } else {
      setMessage({ type: 'error', text: json.error })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 flex items-center justify-center font-mono">
        Loading ID Logistics Site Operations...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                SSOT ACTIVE
              </span>
              <span className="text-xs font-mono text-zinc-500">SITE: YYZ-01 WHITBY</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
              Site Operations & Facility Management Platform
            </h1>
          </div>
          <div className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg">
            ENV: <span className="text-emerald-400">LOCAL (MAC AIR)</span> → TARGET: <span className="text-sky-400">AZURE CA-CENTRAL</span>
          </div>
        </div>

        {/* Safety Simulator & Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Assignment Form & Safety Block Tester */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">WFM Safety Guard Test</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Attempting to assign workers to restricted zones will trigger hard-safety certification checks.
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-xs font-mono ${
                message.type === 'success' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/50 text-rose-300 border border-rose-800/50'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Select Worker</label>
                <select
                  value={selectedEmp}
                  onChange={(e) => setSelectedEmp(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                >
                  {data?.employees?.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Job Function</label>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                >
                  {data?.jobFunctions?.map((job: any) => (
                    <option key={job.id} value={job.id}>
                      {job.title} {job.requiresCert ? '🔒 (Cert Required)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Target Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                >
                  {data?.zones?.map((zone: any) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Supervisor Override Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="Required only if safety check fails..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-2.5 rounded-lg text-sm transition-colors shadow-lg"
              >
                Execute Assignment & Safety Guard
              </button>
            </form>
          </div>

          {/* Workforce Roster & Certifications */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-semibold text-white">Active Workforce & Certification Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Certifications</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {data?.employees?.map((emp: any) => {
                    const hasValidCert = emp.certifications.some((c: any) => c.isValid && new Date(c.expiryDate) > new Date())
                    return (
                      <tr key={emp.id} className="hover:bg-zinc-900/80 transition-colors">
                        <td className="py-3 font-medium text-zinc-200">{emp.firstName} {emp.lastName}</td>
                        <td className="py-3 text-zinc-400">{emp.employeeNumber}</td>
                        <td className="py-3">
                          {emp.certifications.length > 0 ? (
                            <span className={`px-2 py-0.5 text-xs rounded-md ${
                              hasValidCert ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                            }`}>
                              {emp.certifications[0].type} ({hasValidCert ? 'Valid' : 'Expired'})
                            </span>
                          ) : (
                            <span className="text-zinc-600 text-xs">None</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-zinc-800 text-zinc-300">
                            {emp.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}
