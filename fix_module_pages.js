const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'modules', '[id]', 'page.tsx');

const dynamicPageContent = `'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

interface Metric { id: string; key: string; value: string; status: string }
interface Owner { ownerName: string; ownerId: string; slaTarget: string; escalationContact: string }
interface ModuleLog { id: string; timestamp: string; actor: string; action: string; details: string; severity: string }
interface EnterprisePanel { id: string; panelTitle: string; cardType: string; metricName: string; metricValue: string; statusText: string; extraMeta: string }
interface SimEvent { id: string; eventType: string; payload: string; severity: string; createdAt: string }

export default function ModuleWorkspace() {
  const params = useParams()
  const router = useRouter()
  const moduleId = (params.id as string) || 'operations-overview'

  const moduleMeta = INITIAL_MODULES.find((m) => m.id === moduleId)

  // Dynamic module-specific data mapping
  const getModuleSpecificData = (id: string) => {
    switch (id) {
      case 'whs':
        return {
          metrics: [
            { id: 'm1', key: 'TRIR Rolling Rate', value: '0.42', status: 'OPTIMIZED' },
            { id: 'm2', key: 'PIT Pre-Shift Checks', value: '18 / 18', status: 'COMPLIANT' },
            { id: 'm3', key: 'Near-Miss Logs (YTD)', value: '3', status: 'MONITORED' },
            { id: 'm4', key: 'CAPA Closure Days', value: '4.2 days', status: 'NOMINAL' }
          ],
          owner: { ownerName: 'Ritesh Kumar', ownerId: 'ACC-WHS-01', slaTarget: 'Zero Harm Policy', escalationContact: 'Safety Director' },
          panels: [
            { id: 'p1', panelTitle: 'Forklift G-Force Impact Telemetry', cardType: 'METRIC', metricName: 'PIT Unit #7 Shock Sensor', metricValue: 'Nominal (< 1.5G threshold)', statusText: 'Nominal', extraMeta: 'Real-time IoT Telemetry' },
            { id: 'p2', panelTitle: 'PPE Compliance Audit', cardType: 'METRIC', metricName: 'High-Vis & Steel-Toe Scans', metricValue: '100% compliance across active shift', statusText: 'Verified', extraMeta: 'Gatehouse Optical Check' }
          ],
          simEvents: [
            { id: 's1', eventType: 'PIT_CHECKLIST_SYNC', payload: 'Forklift Unit #4 pre-shift digital checklist submitted and verified by supervisor.', severity: 'INFO', createdAt: new Date().toISOString() },
            { id: 's2', eventType: 'NEAR_MISS_LOG', payload: 'Near-miss logged in Aisle 12: Pallet overhang corrected before movement.', severity: 'WARNING', createdAt: new Date().toISOString() }
          ],
          logs: [
            { id: 'l1', timestamp: '08:30:12 AM', actor: 'Marcus Brody', action: 'PIT_INSPECTION', details: 'All 18 warehouse trucks passed morning battery and brake safety checks.', severity: 'INFO' },
            { id: 'l2', timestamp: '07:15:00 AM', actor: 'Safety Committee', action: 'WALKTHROUGH', details: 'Completed bi-weekly gemba safety walk through Mezzanine pick modules.', severity: 'INFO' }
          ]
        };
      case 'rme':
        return {
          metrics: [
            { id: 'm1', key: 'Conveyor Uptime', value: '99.1%', status: 'NOMINAL' },
            { id: 'm2', key: 'Active Work Orders', value: '4 Pending', status: 'ACTIVE' },
            { id: 'm3', key: 'Motor Amp Draw (Loop 2)', value: '14.2A', status: 'STABLE' },
            { id: 'm4', key: 'MTBF (Hours)', value: '340 hrs', status: 'OPTIMIZED' }
          ],
          owner: { ownerName: 'Marcus Brody', ownerId: 'ACC-RME-02', slaTarget: '99.5% Uptime SLA', escalationContact: 'Engineering Lead' },
          panels: [
            { id: 'p1', panelTitle: 'Sortation Loop Thermal Status', cardType: 'METRIC', metricName: 'Bearing Temperature Sensors', metricValue: '38.4°C (Optimal operating range)', statusText: 'Nominal', extraMeta: 'SCADA PLC Feed' },
            { id: 'p2', panelTitle: 'Cardboard Baler Pressure', cardType: 'METRIC', metricName: 'Hydraulic Ram Pressure', metricValue: '2,800 PSI', statusText: 'Stable', extraMeta: 'Facilities IoT' }
          ],
          simEvents: [
            { id: 's1', eventType: 'PLC_CONVEYOR_TELEMETRY', payload: 'Sortation Loop 1 motor vibration nominal at 0.8 mm/s velocity.', severity: 'INFO', createdAt: new Date().toISOString() },
            { id: 's2', eventType: 'WORK_ORDER_UPDATE', payload: 'Preventative maintenance scheduled for Diverter Arm #3 during off-peak window.', severity: 'INFO', createdAt: new Date().toISOString() }
          ],
          logs: [
            { id: 'l1', timestamp: '09:20:41 AM', actor: 'PLC Automation', action: 'MOTOR_DIAGNOSTIC', details: 'Conveyor line B optical sensor cleaned and recalibrated.', severity: 'INFO' }
          ]
        };
      case 'procurement':
        return {
          metrics: [
            { id: 'm1', key: 'Consumable Stock Cover', value: '14.2 Days', status: 'OPTIMIZED' },
            { id: 'm2', key: 'Active POs', value: '6 Orders', status: 'TRACKING' },
            { id: 'm3', key: 'Stretch Film Roll Level', value: '820 Rolls', status: 'NOMINAL' },
            { id: 'm4', key: 'Box SKU Variance', value: '0.02%', status: 'ACCURATE' }
          ],
          owner: { ownerName: 'Chloe Tremblay', ownerId: 'ACC-PRC-03', slaTarget: 'Zero Stockouts', escalationContact: 'Supply Chain Director' },
          panels: [
            { id: 'p1', panelTitle: 'Packaging Material Burn Rate', cardType: 'METRIC', metricName: 'SKU BOX-C12 Consumption', metricValue: '1,250 units/shift', statusText: 'Nominal', extraMeta: 'WMS Perpetual Inventory' },
            { id: 'p2', panelTitle: 'Supplier Lead Time Tracker', cardType: 'METRIC', metricName: 'Corrugated Box Vendor #4', metricValue: '3.1 business days average', statusText: 'On Time', extraMeta: 'EDI ASN Feed' }
          ],
          simEvents: [
            { id: 's1', eventType: 'SKU_INVENTORY_DRAIN', payload: 'Wave pick execution consumed 400 units of corrugated carton BOX-C12.', severity: 'INFO', createdAt: new Date().toISOString() }
          ],
          logs: [
            { id: 'l1', timestamp: '10:00:00 AM', actor: 'Chloe Tremblay', action: 'PO_ISSUE', details: 'Issued purchase order for 2,000 rolls of high-performance stretch film.', severity: 'INFO' }
          ]
        };
      case 'visitors':
        return {
          metrics: [
            { id: 'm1', key: 'Active Carriers on Site', value: '12 Trucks', status: 'ACTIVE' },
            { id: 'm2', key: 'Digital Induction Pass', value: '100%', status: 'COMPLIANT' },
            { id: 'm3', key: 'Average Dwell Time', value: '38 mins', status: 'OPTIMIZED' },
            { id: 'm4', key: 'Gatehouse Check-In Speed', value: '< 90 secs', status: 'FAST' }
          ],
          owner: { ownerName: 'Sarah Jenkins', ownerId: 'ACC-SEC-04', slaTarget: '< 45 min Turnaround', escalationContact: 'Yard Master' },
          panels: [
            { id: 'p1', panelTitle: 'Carrier Turnaround & Dock Flow', cardType: 'METRIC', metricName: 'Atlas Freight (#TR-9901)', metricValue: 'Dock 14 Outbound - Loading Complete', statusText: 'Nominal', extraMeta: 'RFID Reader Gate 2' },
            { id: 'p2', panelTitle: 'Contractor Safety Inductions', cardType: 'METRIC', metricName: 'QR Kiosk Check-Ins', metricValue: '14 active vendor badges issued today', statusText: 'Verified', extraMeta: 'Visitor Management' }
          ],
          simEvents: [
            { id: 's1', eventType: 'CARRIER_DOCK_EVENT', payload: 'Freight carrier #TR-4812 checked into Dock Bay 7 for outbound pallet pickup.', severity: 'INFO', createdAt: new Date().toISOString() }
          ],
          logs: [
            { id: 'l1', timestamp: '08:45:10 AM', actor: 'Gatehouse Guard', action: 'BADGE_ISSUED', details: 'Issued contractor badge and digital safety induction to HVAC technician.', severity: 'INFO' }
          ]
        };
      default:
        return {
          metrics: [
            { id: 'm1', key: 'Throughput Velocity', value: '4,820 U/hr', status: 'NOMINAL' },
            { id: 'm2', key: 'Active Sensor Nodes', value: '142 / 145', status: 'ONLINE' },
            { id: 'm3', key: 'SLA Compliance', value: '99.8%', status: 'OPTIMIZED' },
            { id: 'm4', key: 'Sync Latency', value: '12 ms', status: 'SECURE' }
          ],
          owner: { ownerName: 'Ritesh Kumar', ownerId: 'ACC-001', slaTarget: '99.9% Nominal SLA', escalationContact: 'Ambari Command' },
          panels: [
            { id: 'p1', panelTitle: 'Live Telemetry Status', cardType: 'METRIC', metricName: 'Secure Stream Active', metricValue: 'All sub-modules synchronized', statusText: 'Nominal', extraMeta: 'Encrypted SQLite Store' },
            { id: 'p2', panelTitle: 'Node Governance & Integrity', cardType: 'METRIC', metricName: 'Zero Packet Loss', metricValue: 'Tamper-evident audit trail online', statusText: 'Compliant', extraMeta: 'Ambari Engine v4.2' }
          ],
          simEvents: [
            { id: 's1', eventType: 'TELEMETRY_HEARTBEAT', payload: `Ambari secure node polling active for ${moduleId}. All sensors nominal.`, severity: 'INFO', createdAt: new Date().toISOString() }
          ],
          logs: [
            { id: 'l1', timestamp: '10:42:15 AM', actor: 'Ritesh Kumar', action: 'NODE_SYNC', details: `Ambari telemetry pipeline successfully verified for module [${moduleId}].`, severity: 'INFO' }
          ]
        };
    }
  };

  const currentData = getModuleSpecificData(moduleId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b14] via-[#05070c] to-[#020306] text-zinc-100 flex font-sans selection:bg-indigo-500/35">
      
      {/* Left Icon Sidebar Rail */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-6 justify-between bg-[#060810]/90 backdrop-blur-xl shrink-0">
        <div className="space-y-6">
          <div onClick={() => router.push('/')} className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 font-extrabold text-white text-sm cursor-pointer hover:scale-105 transition-transform" title="Return to Ambari Command Center">
            ACC
          </div>
          <nav className="space-y-3 pt-4">
            <button onClick={() => router.push('/')} className="w-11 h-11 rounded-2xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title="Control Tower">
              ☷
            </button>
            <button className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner" title="Active Module">
              ⚡
            </button>
          </nav>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
          ⚙
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 space-y-8 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <button onClick={() => router.push('/')} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
              ← Back to Ambari Command Center
            </button>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                ACC NODE | {moduleId.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {moduleMeta?.title || moduleId.toUpperCase()}
            </h1>
            <p className="text-xs text-zinc-400 font-mono max-w-2xl">
              {moduleMeta?.description || 'Ambari secure enterprise operational workspace and real-time telemetry sink.'}
            </p>
          </div>

          <div className="bg-[#0e1222]/80 border border-white/10 rounded-2xl p-4 font-mono text-xs space-y-1.5 shadow-xl shrink-0">
            <div className="text-zinc-400">LEAD: <span className="text-white font-bold">{currentData.owner.ownerName}</span></div>
            <div className="text-zinc-400">SLA: <span className="text-indigo-400 font-bold">{currentData.owner.slaTarget}</span></div>
          </div>
        </div>

        {/* Bento Grid Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {currentData.metrics.map((m) => (
            <div key={m.id} className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl hover:border-indigo-500/30 transition-all">
              <div className="text-xs text-zinc-400 uppercase tracking-widest">{m.key}</div>
              <div className="text-3xl font-extrabold text-white">{m.value}</div>
              <div className="text-[11px] text-emerald-400 flex items-center justify-between pt-3 border-t border-white/5">
                <span>Status: {m.status}</span>
                <span className="font-bold">● ACC_SYNC</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Simulation Feed & Bento Business Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          
          {/* Live Sensor Stream */}
          <div className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                Live Ambari Secure Stream ({moduleId.toUpperCase()})
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Active Sink</span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[350px]">
              {currentData.simEvents.map((evt) => (
                <div key={evt.id} className="bg-[#060810]/80 p-4 rounded-2xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span className="text-indigo-400 font-bold">{evt.eventType}</span>
                    <span>{new Date(evt.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-zinc-200 text-xs">{evt.payload}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Intelligence Cards */}
          <div className="space-y-6 flex flex-col">
            {currentData.panels.map((panel) => (
              <div key={panel.id} className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{panel.panelTitle}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {panel.statusText}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-extrabold text-white">{panel.metricName}</div>
                  <div className="text-xs text-indigo-300 font-semibold">{panel.metricValue}</div>
                  <div className="text-[11px] text-zinc-400 bg-[#060810]/80 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                    <span>Context: {panel.extraMeta}</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail & Compliance Log */}
        <div className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 font-mono text-xs shadow-xl">
          <div className="text-white font-bold text-sm">Tamper-Evident Audit Trail &amp; Compliance Log</div>
          <div className="border border-white/5 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#060810]/80 border-b border-white/5 text-zinc-400 text-[10px]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Accountable Lead</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Operational Details</th>
                  <th className="p-4">Severity</th>
                </tr>
              </thead>
              <tbody>
                {currentData.logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-zinc-400">{log.timestamp}</td>
                    <td className="p-4 text-white font-semibold">{log.actor}</td>
                    <td className="p-4 text-indigo-400">{log.action}</td>
                    <td className="p-4 text-zinc-300">{log.details}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 text-zinc-300">
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}
`;

fs.writeFileSync(targetPath, dynamicPageContent, 'utf8');
console.log('✅ Successfully updated module workspace pages to load unique, domain-specific data per module!');
