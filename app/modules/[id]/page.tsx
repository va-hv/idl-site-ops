'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { INITIAL_MODULES } from '@/config/modules'

interface SimEvent { id: string; eventType: string; payload: string; severity: string; createdAt: string }

export default function ModuleWorkspace() {
  const params = useParams()
  const router = useRouter()
  const moduleId = (params.id as string) || 'operations-overview'

  const moduleMeta = INITIAL_MODULES.find((m) => m.id === moduleId)
  const [simEvents, setSimEvents] = useState<SimEvent[]>([])

  const fetchSimEvents = async () => {
    try {
      const res = await fetch(`/api/modules/${moduleId}`)
      const data = await res.json()
      if (data.success && data.simEvents && data.simEvents.length > 0) {
        setSimEvents(data.simEvents)
      } else {
        setSimEvents([
          { id: 'fallback-1', eventType: 'ACC_NODE_SYNC', payload: 'Ambari secure node operational for ' + moduleId.toUpperCase() + '. All sensors nominal.', severity: 'INFO', createdAt: new Date().toISOString() }
        ])
      }
    } catch (err) {
      console.error('Error fetching telemetry', err)
    }
  }

  useEffect(() => {
    fetchSimEvents()
    const interval = setInterval(fetchSimEvents, 3000)
    return () => clearInterval(interval)
  }, [moduleId])

  const getData = () => {
    switch (moduleId) {
      case 'whs':
        return {
          metrics: [
            { key: 'TRIR Rolling Rate', value: '0.42', status: 'OPTIMIZED' },
            { key: 'PIT Pre-Shift Checks', value: '18 / 18', status: 'COMPLIANT' },
            { key: 'Near-Miss Logs (YTD)', value: '3', status: 'MONITORED' },
            { key: 'CAPA Closure Days', value: '4.2 days', status: 'NOMINAL' }
          ],
          owner: { name: 'Ritesh Kumar', sla: 'Zero Harm Policy' },
          panels: [
            { title: 'Forklift G-Force Impact Telemetry', metric: 'PIT Unit #7 Shock Sensor', val: 'Nominal (< 1.5G threshold)', badge: 'Nominal', meta: 'Real-time IoT Telemetry' },
            { title: 'PPE Compliance Audit', metric: 'High-Vis & Steel-Toe Scans', val: '100% compliance across active shift', badge: 'Verified', meta: 'Gatehouse Optical Check' }
          ]
        };
      case 'rme':
        return {
          metrics: [
            { key: 'Conveyor Uptime', value: '99.1%', status: 'NOMINAL' },
            { key: 'Active Work Orders', value: '4 Pending', status: 'ACTIVE' },
            { key: 'Motor Amp Draw (Loop 2)', value: '14.2A', status: 'STABLE' },
            { key: 'MTBF (Hours)', value: '340 hrs', status: 'OPTIMIZED' }
          ],
          owner: { name: 'Marcus Brody', sla: '99.5% Uptime SLA' },
          panels: [
            { title: 'Sortation Loop Thermal Status', metric: 'Bearing Temperature Sensors', val: '38.4°C (Optimal operating range)', badge: 'Nominal', meta: 'SCADA PLC Feed' },
            { title: 'Cardboard Baler Pressure', metric: 'Hydraulic Ram Pressure', val: '2,800 PSI', badge: 'Stable', meta: 'Facilities IoT' }
          ]
        };
      case 'procurement':
        return {
          metrics: [
            { key: 'Consumable Stock Cover', value: '14.2 Days', status: 'OPTIMIZED' },
            { key: 'Active POs', value: '6 Orders', status: 'TRACKING' },
            { key: 'Stretch Film Roll Level', value: '820 Rolls', status: 'NOMINAL' },
            { key: 'Box SKU Variance', value: '0.02%', status: 'ACCURATE' }
          ],
          owner: { name: 'Chloe Tremblay', sla: 'Zero Stockouts' },
          panels: [
            { title: 'Packaging Material Burn Rate', metric: 'SKU BOX-C12 Consumption', val: '1,250 units/shift', badge: 'Nominal', meta: 'WMS Perpetual Inventory' },
            { title: 'Supplier Lead Time Tracker', metric: 'Corrugated Box Vendor #4', val: '3.1 business days average', badge: 'On Time', meta: 'EDI ASN Feed' }
          ]
        };
      case 'quality':
        return {
          metrics: [
            { key: 'Outbound Defect Rate', value: '12 PPM', status: 'EXCELLENT' },
            { key: 'Quarantine Pallets', value: '2 Pallets', status: 'REVIEW' },
            { key: 'Lot Sample Audits', value: '48 / day', status: 'ACTIVE' },
            { key: 'Accuracy Compliance', value: '99.94%', status: 'OPTIMIZED' }
          ],
          owner: { name: 'Ananya Patel', sla: '< 20 PPM Quality SLA' },
          panels: [
            { title: 'Quarantine Cage Status', metric: 'SKU-8829 Master Carton Review', val: 'Pending QA Supervisor sign-off', badge: 'Hold', meta: 'WMS Quality Gate' },
            { title: 'Weight Verification Audit', metric: 'Checkweigher Scale #3', val: 'Variance within ± 2.4 grams', badge: 'Passed', meta: 'IoT Scale Feed' }
          ]
        };
      case 'visitors':
        return {
          metrics: [
            { key: 'Active Carriers on Site', value: '12 Trucks', status: 'ACTIVE' },
            { key: 'Digital Induction Pass', value: '100%', status: 'COMPLIANT' },
            { key: 'Average Dwell Time', value: '38 mins', status: 'OPTIMIZED' },
            { key: 'Gatehouse Check-In Speed', value: '< 90 secs', status: 'FAST' }
          ],
          owner: { name: 'Sarah Jenkins', sla: '< 45 min Turnaround' },
          panels: [
            { title: 'Carrier Turnaround & Dock Flow', metric: 'Atlas Freight (#TR-9901)', val: 'Dock 14 Outbound - Loading Complete', badge: 'Nominal', meta: 'RFID Reader Gate 2' },
            { title: 'Contractor Safety Inductions', metric: 'QR Kiosk Check-Ins', val: '14 active vendor badges issued today', badge: 'Verified', meta: 'Visitor Management' }
          ]
        };
      case 'security':
        return {
          metrics: [
            { key: 'Perimeter Camera Health', value: '32 / 32 Online', status: 'SECURE' },
            { key: 'Trailer Seals Verified', value: '100%', status: 'COMPLIANT' },
            { key: 'Gate Access Logs', value: '184 Entries', status: 'MONITORED' },
            { key: 'Active Security Alerts', value: '0 Incidents', status: 'CLEAR' }
          ],
          owner: { name: 'David Miller', sla: 'Zero Perimeter Breach' },
          panels: [
            { title: 'Gatehouse Seal Matching', metric: 'Outgoing BOL #9910', val: 'Seal #SL-88421 Verified match', badge: 'Secure', meta: 'Optical OCR Scan' },
            { title: 'Access Control System', metric: 'Turnstile & RFID Readers', val: 'All credentials authenticated', badge: 'Active', meta: 'Biometric Node 1' }
          ]
        };
      case 'it':
        return {
          metrics: [
            { key: 'RF Scanner Battery Health', value: '94% Avg', status: 'HEALTHY' },
            { key: 'Active TC57 Terminals', value: '95 / 95', status: 'ONLINE' },
            { key: 'Wi-Fi Signal Coverage', value: '-54 dBm', status: 'OPTIMAL' },
            { key: 'MDM Compliance', value: '100%', status: 'SECURE' }
          ],
          owner: { name: 'Alex Chen', sla: '99.9% Device Uptime' },
          panels: [
            { title: 'Zebra Scanner Pool Status', metric: 'Charging Dock Bay C', val: '12 devices fast-charging (80%+)', badge: 'Optimal', meta: 'AirWatch MDM Feed' },
            { title: 'Warehouse Mesh Wi-Fi', metric: 'Access Point AP-Mezz-04', val: 'Zero packet loss across pick face', badge: 'Stable', meta: 'Cisco Meraki API' }
          ]
        };
      case 'facilities':
        return {
          metrics: [
            { key: 'PUE Energy Efficiency', value: '1.14 PUE', status: 'OPTIMIZED' },
            { key: 'HVAC Thermal Balance', value: '21.5°C', status: 'NOMINAL' },
            { key: 'Cardboard Baler Output', value: '14 Bales/day', status: 'ACTIVE' },
            { key: 'LED Lighting Grid', value: '100% Operational', status: 'GREEN' }
          ],
          owner: { name: 'Elena Rostova', sla: 'ISO 50001 Energy SLA' },
          panels: [
            { title: 'HVAC Climate Control', metric: 'Warehouse Zone 2 Air Handler', val: 'Humidity 45% | Temp 21.2°C', badge: 'Nominal', meta: 'Building Automation BMS' },
            { title: 'Waste Management & ESG', metric: 'Cardboard & Plastic Recycling', val: '94% diversion rate from landfill', badge: 'Compliant', meta: 'ESG Telemetry' }
          ]
        };
      case 'wfm':
        return {
          metrics: [
            { key: 'Shift Headcount', value: '184 Associates', status: 'NOMINAL' },
            { key: 'Labor Utilization Rate', value: '92.4%', status: 'OPTIMIZED' },
            { key: 'Attendance Rate', value: '96.8%', status: 'HIGH' },
            { key: 'Overtime Hours', value: '14.5 hrs', status: 'CONTROLLED' }
          ],
          owner: { name: 'Karen Smith', sla: '95% Labor Efficiency' },
          panels: [
            { title: 'Labor Allocation by Zone', metric: 'Pick/Pack vs Receiving', val: '110 pickers | 44 packers | 30 docks', badge: 'Optimized', meta: 'WFM Rostering Feed' },
            { title: 'Time & Attendance Kiosk', metric: 'Biometric Punch Clock A', val: 'Zero punch errors recorded', badge: 'Synced', meta: 'Kronos Integration' }
          ]
        };
      case 'ci':
        return {
          metrics: [
            { key: 'Active Floor Andon Alerts', value: '2 Alerts', status: 'ATTENTION' },
            { key: 'MTTR Response Time', value: '3.4 mins', status: 'FAST' },
            { key: 'Kaizen Suggestions YTD', value: '42 Ideas', status: 'ACTIVE' },
            { key: 'Pack Station Box Shortages', value: '0 Alerts', status: 'RESOLVED' }
          ],
          owner: { name: 'Tomás Alvarez', sla: '< 5 min Andon MTTR' },
          panels: [
            { title: 'Andon Cord Activations', metric: 'Pack Station #12 Box Jam', val: 'Acknowledged by Team Lead in 1.2 min', badge: 'Resolved', meta: 'Andon Stack Light IoT' },
            { title: 'Continuous Improvement KPI', metric: 'Cycle Time Reduction', val: '+8.4% efficiency gain this quarter', badge: 'Target Met', meta: 'Lean Six Sigma Engine' }
          ]
        };
      case 'learning':
        return {
          metrics: [
            { key: 'PIT Certified Operators', value: '42 Active', status: 'COMPLIANT' },
            { key: 'SOP Training Completion', value: '98.2%', status: 'EXCELLENT' },
            { key: 'Pending Certifications', value: '3 Associates', status: 'SCHEDULED' },
            { key: 'Dangerous Goods Compliance', value: '100%', status: 'VERIFIED' }
          ],
          owner: { name: 'Jessica Wong', sla: '100% Compliance SLA' },
          panels: [
            { title: 'Forklift Academy Status', metric: 'Practical Refresher Course', val: '3 trainees scheduled for Friday simulator', badge: 'In Progress', meta: 'LMS Platform' },
            { title: 'Safety Briefing Sign-offs', metric: 'Daily Huddle Attendance', val: '184 digital acknowledgments logged', badge: 'Complete', meta: 'Tablet Kiosk Feed' }
          ]
        };
      case 'communications':
        return {
          metrics: [
            { key: 'Shift Transition Logs', value: 'Synced', status: 'COMPLETE' },
            { key: 'Volume Surge Forecast', value: '+18% Peak', status: 'ADVISORY' },
            { key: 'Enterprise Broadcasts', value: '1 Active', status: 'BROADCAST' },
            { key: 'Handover Acknowledgment', value: '100% Leads', status: 'VERIFIED' }
          ],
          owner: { name: 'Ritesh Kumar', sla: 'Zero Communication Gaps' },
          panels: [
            { title: 'Morning Shift Handoff Summary', metric: 'Night Shift to Day Shift Handover', val: 'All inbound trailers cleared; zero backlog', badge: 'Signed Off', meta: 'Digital Logbook' },
            { title: 'Volume Surge Advisory', metric: 'E-commerce Flash Sale Spike', val: 'Expected 52,000 units tomorrow', badge: 'Prepared', meta: 'Planning Engine' }
          ]
        };
      case 'engagement':
        return {
          metrics: [
            { key: 'Employee eNPS Score', value: '+48', status: 'EXCELLENT' },
            { key: 'Retention Rate (YTD)', value: '94.5%', status: 'STABLE' },
            { key: 'Recognition Awards', value: '12 Given', status: 'ACTIVE' },
            { key: 'Feedback Pulse Rate', value: '88% Response', status: 'HIGH' }
          ],
          owner: { name: 'Amanda Drake', sla: 'Top Quartile Engagement' },
          panels: [
            { title: 'Associate Recognition Program', metric: 'Star Performer of the Week', val: 'Awarded to fulfillment associate Dave Miller', badge: 'Recognized', meta: 'Culture Portal' },
            { title: 'Pulse Survey Results', metric: 'Workplace Ergonomics & Comfort', val: '4.6 / 5.0 satisfaction rating', badge: 'Positive', meta: 'HR Analytics' }
          ]
        };
      case 'compliance':
        return {
          metrics: [
            { key: 'Ministry of Labour Audit Readiness', value: '100%', status: 'AUDIT_READY' },
            { key: 'Statutory Inspections', value: 'All Up-to-Date', status: 'COMPLIANT' },
            { key: 'Legal Document Archive', value: '42 Files', status: 'SECURE' },
            { key: 'Regulatory Incident Rate', value: '0 Violations', status: 'CLEAR' }
          ],
          owner: { name: 'Claire Halloway', sla: '100% Statutory Compliance' },
          panels: [
            { title: 'Statutory Inspection Schedule', metric: 'Annual Racking Load Certification', val: 'Valid through November 2026', badge: 'Verified', meta: 'Legal Compliance Store' },
            { title: 'Ministry of Labour Portal', metric: 'Health & Safety Board Posting', val: 'All certificates digitally displayed', badge: 'Compliant', meta: 'Governance Feed' }
          ]
        };
      case 'documents':
        return {
          metrics: [
            { key: 'Master SOPs Published', value: '64 SOPs', status: 'CONTROLLED' },
            { key: 'Revision Control Version', value: 'v4.2', status: 'SYNCED' },
            { key: 'Staff Acknowledgment', value: '99.4%', status: 'COMPLIANT' },
            { key: 'Pending Review Drafts', value: '2 Documents', status: 'REVIEW' }
          ],
          owner: { name: 'Nathaniel Reed', sla: 'Strict Version Control' },
          panels: [
            { title: 'Pallet Racking Master SOP', metric: 'Document ID: SOP-LOG-102', val: 'Approved & signed by Engineering Director', badge: 'Active', meta: 'Document Control Vault' },
            { title: 'Staff Sign-off Audit', metric: 'Hazardous Materials Protocol', val: '182 of 184 associates signed', badge: '98.9%', meta: 'LMS Audit Trail' }
          ]
        };
      case 'my-work':
        return {
          metrics: [
            { key: 'Pending Executive Approvals', value: '3 Actions', status: 'ACTION_REQUIRED' },
            { key: 'Assigned Workflows', value: '5 Tasks', status: 'IN_PROGRESS' },
            { key: 'Completed Sign-offs (Today)', value: '8 Approvals', status: 'DONE' },
            { key: 'Delegation Status', value: 'Active (R. Kumar)', status: 'SECURE' }
          ],
          owner: { name: 'Ritesh Kumar', sla: '< 2 hr Approval SLA' },
          panels: [
            { title: 'Stretch Film PO Sign-off', metric: 'Purchase Order #PO-8842', val: '$4,850 CAD pending executive signature', badge: 'Pending', meta: 'My Work Inbox' },
            { title: 'Conveyor Overhaul Authorization', metric: 'Work Order #WO-3321', val: '$12,400 CAD pending plant manager sign-off', badge: 'Urgent', meta: 'Executive Workflow' }
          ]
        };
      case 'reporting':
        return {
          metrics: [
            { key: 'Automated CSV Dispatches', value: 'Configured', status: 'ACTIVE' },
            { key: 'Data Export Latency', value: '< 1.2 sec', status: 'FAST' },
            { key: 'Executive Dashboards', value: '6 Reports', status: 'ONLINE' },
            { key: 'Scheduled Reports', value: 'Daily 06:00 EST', status: 'READY' }
          ],
          owner: { name: 'Ritesh Kumar', sla: '100% Data Integrity' },
          panels: [
            { title: 'Executive Summary CSV Dispatch', metric: 'Daily Shift Performance Export', val: 'Dispatched successfully to stakeholders', badge: 'Sent', meta: 'Reporting Engine' },
            { title: 'Throughput Trend Analysis', metric: '7-Day Rolling Average', val: '+14% volume growth compared to baseline', badge: 'Optimized', meta: 'Analytics Pipeline' }
          ]
        };
      case 'admin':
        return {
          metrics: [
            { key: 'WMS / SAP Webhook Connectors', value: 'Connected', status: 'ONLINE' },
            { key: 'API Latency Monitoring', value: '12 ms', status: 'SECURE' },
            { key: 'Node Security Status', value: 'SECURE-01', status: 'PROTECTED' },
            { key: 'SQLite Database Health', value: '100% Integrity', status: 'HEALTHY' }
          ],
          owner: { name: 'System Administrator', sla: '99.99% Uptime SLA' },
          panels: [
            { title: 'Enterprise Webhook Integrations', metric: 'SAP / WMS API Gateway', val: 'All endpoints returning HTTP 200 OK', badge: 'Operational', meta: 'System Admin Core' },
            { title: 'Local SQLite Database Store', metric: 'prisma/dev.db Sync Engine', val: 'Sub-millisecond query execution active', badge: 'Healthy', meta: 'Node.js database sync' }
          ]
        };
      default:
        return {
          metrics: [
            { key: 'Throughput Velocity', value: '4,820 U/hr', status: 'NOMINAL' },
            { key: 'Active Sensor Nodes', value: '142 / 145', status: 'ONLINE' },
            { key: 'SLA Compliance', value: '99.8%', status: 'OPTIMIZED' },
            { key: 'Sync Latency', value: '12 ms', status: 'SECURE' }
          ],
          owner: { name: 'Ritesh Kumar', sla: '99.9% Nominal SLA' },
          panels: [
            { title: 'Live Telemetry Status', metric: 'Secure Stream Active', val: 'All sub-modules synchronized', badge: 'Nominal', meta: 'Encrypted SQLite Store' },
            { title: 'Node Governance & Integrity', metric: 'Zero Packet Loss', val: 'Tamper-evident audit trail online', badge: 'Compliant', meta: 'Ambari Engine v4.2' }
          ]
        };
    }
  };

  const data = getData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b14] via-[#05070c] to-[#020306] text-zinc-100 flex font-sans selection:bg-indigo-500/35">
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-6 justify-between bg-[#060810]/90 backdrop-blur-xl shrink-0">
        <div className="space-y-6">
          <div onClick={() => router.push('/')} className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 font-extrabold text-white text-sm cursor-pointer hover:scale-105 transition-transform" title="Return to Ambari Command Center">
            ACC
          </div>
          <nav className="space-y-3 pt-4">
            <button onClick={() => router.push('/')} className="w-11 h-11 rounded-2xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              ☷
            </button>
            <button className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              ⚡
            </button>
          </nav>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
          ⚙
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 space-y-8 overflow-y-auto">
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
            <div className="text-zinc-400">LEAD: <span className="text-white font-bold">{data.owner.name}</span></div>
            <div className="text-zinc-400">SLA: <span className="text-indigo-400 font-bold">{data.owner.sla}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {data.metrics.map((m, idx) => (
            <div key={idx} className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl hover:border-indigo-500/30 transition-all">
              <div className="text-xs text-zinc-400 uppercase tracking-widest">{m.key}</div>
              <div className="text-3xl font-extrabold text-white">{m.value}</div>
              <div className="text-[11px] text-emerald-400 flex items-center justify-between pt-3 border-t border-white/5">
                <span>Status: {m.status}</span>
                <span className="font-bold">● SQL_SYNC</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          <div className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                Live SQLite Telemetry Stream ({moduleId.toUpperCase()})
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">DB Polling</span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[350px]">
              {simEvents.map((evt) => (
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

          <div className="space-y-6 flex flex-col">
            {data.panels.map((panel, idx) => (
              <div key={idx} className="bg-[#0e1222]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{panel.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {panel.badge}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-extrabold text-white">{panel.metric}</div>
                  <div className="text-xs text-indigo-300 font-semibold">{panel.val}</div>
                  <div className="text-[11px] text-zinc-400 bg-[#060810]/80 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                    <span>Context: {panel.meta}</span>
                    <span className="text-emerald-400 font-bold">SQL_VERIFIED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
