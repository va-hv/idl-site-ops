modules_content = '''export interface ModuleMeta {
  id: string
  title: string
  category: string
  description: string
  icon: string
}

export const INITIAL_MODULES: ModuleMeta[] = [
  {
    id: 'operations-overview',
    title: 'Ambari Operations Overview',
    category: 'CORE OPERATIONS',
    description: 'Centralized live telemetry, node health, and fulfillment throughput.',
    icon: '☷'
  },
  {
    id: 'whs',
    title: 'Safety & Compliance (WHS)',
    category: 'GOVERNANCE & HR',
    description: 'Incident logs, PIT pre-shift inspections, TRIR safety tracking, and CAPA corrective actions.',
    icon: '🛡️'
  },
  {
    id: 'rme',
    title: 'Maintenance & RME',
    category: 'FACILITY & ASSETS',
    description: 'Conveyor PLC telemetry, sortation uptime, motor amp draws, and maintenance work orders.',
    icon: '⚙️'
  },
  {
    id: 'procurement',
    title: 'Procurement & Consumables',
    category: 'CORE OPERATIONS',
    description: 'Packaging SKU stock levels, stretch film inventory, days cover, and purchase orders.',
    icon: '📦'
  },
  {
    id: 'quality',
    title: 'Quality Assurance',
    category: 'CORE OPERATIONS',
    description: 'Outbound defect rate tracking in PPM, lot sample audits, and quarantine cage management.',
    icon: '🔍'
  },
  {
    id: 'visitors',
    title: 'Visitors & Contractors',
    category: 'GOVERNANCE & HR',
    description: 'Active freight carrier check-ins, dock turnarounds, vendor badges, and digital inductions.',
    icon: '🚛'
  },
  {
    id: 'security',
    title: 'Gatehouse & Security',
    category: 'GOVERNANCE & HR',
    description: 'Trailer seal verification, perimeter camera feeds, BOL matching, and gate access logs.',
    icon: '🔒'
  },
  {
    id: 'it',
    title: 'IT & Device Fleet',
    category: 'FACILITY & ASSETS',
    description: 'Zebra TC57 RF scanner pool online status, battery health averages, and MDM compliance.',
    icon: '📱'
  },
  {
    id: 'facilities',
    title: 'Facilities & ESG',
    category: 'FACILITY & ASSETS',
    description: 'Warehouse HVAC thermal balance, PUE energy efficiency ratio, and cardboard baler telemetry.',
    icon: '⚡'
  },
  {
    id: 'wfm',
    title: 'Workforce & Labor Management',
    category: 'GOVERNANCE & HR',
    description: 'Shift rosters, associate clock-in counts, labor utilization rates, and staffing efficiency.',
    icon: '👥'
  },
  {
    id: 'ci',
    title: 'Continuous Improvement (Andon)',
    category: 'CORE OPERATIONS',
    description: 'Active floor Andon alerts, pack station box shortages, and MTTR response tracking.',
    icon: '🔔'
  },
  {
    id: 'learning',
    title: 'Learning & SOP Academy',
    category: 'GOVERNANCE & HR',
    description: 'PIT forklift certifications, dangerous goods handling compliance, and training records.',
    icon: '🎓'
  },
  {
    id: 'communications',
    title: 'Shift Handover Communications',
    category: 'CORE OPERATIONS',
    description: 'Morning shift transition logs, volume surge forecasts, and enterprise broadcast feeds.',
    icon: '📢'
  },
  {
    id: 'engagement',
    title: 'Associate Engagement',
    category: 'GOVERNANCE & HR',
    description: 'Employee eNPS score tracking, retention metrics, and workplace satisfaction indexes.',
    icon: '⭐'
  },
  {
    id: 'compliance',
    title: 'Statutory Compliance & Legal',
    category: 'GOVERNANCE & HR',
    description: 'Ministry of Labour audit readiness, statutory inspection dates, and compliance records.',
    icon: '📋'
  },
  {
    id: 'documents',
    title: 'Document Control & Master SOPs',
    category: 'GOVERNANCE & HR',
    description: 'Pallet racking master SOPs, revision control history, and staff acknowledgment logs.',
    icon: '📁'
  },
  {
    id: 'my-work',
    title: 'My Work Inbox',
    category: 'CORE OPERATIONS',
    description: 'Pending executive approvals, stretch film PO signatures, and assigned task workflows.',
    icon: '📥'
  },
  {
    id: 'reporting',
    title: 'Reporting & Analytics Suite',
    category: 'CORE OPERATIONS',
    description: 'Automated executive summary CSV dispatches, performance trend graphs, and data exports.',
    icon: '📊'
  },
  {
    id: 'admin',
    title: 'System Administration & Integrations',
    category: 'FACILITY & ASSETS',
    description: 'WMS / SAP enterprise webhook connectors, API latency monitoring, and node security.',
    icon: '🛠️'
  }
]
'''

with open('config/modules.ts', 'w') as f:
    f.write(modules_content)
print("✅ Successfully restored all 18 enterprise modules!")
