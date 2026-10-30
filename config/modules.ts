export interface SystemModule {
  id: string
  title: string
  category: string
  description: string
  enabled: boolean
  badge?: string
}

export const INITIAL_MODULES: SystemModule[] = [
  { id: 'control-tower', title: 'Control Tower Headquarters', category: 'Core', description: 'Real-time multi-node overview, volume, backlog, and staffing.', enabled: true, badge: 'HQ' },
  { id: 'whs', title: 'Safety (WHS) & Ergonomics', category: 'Safety & Compliance', description: 'PIT licence register, safety blocks, and ergonomic assessments.', enabled: true },
  { id: 'rme', title: 'Maintenance & Reliability (RME)', category: 'Engineering', description: 'Work orders, preventive maintenance, spare parts, and conveyor uptime.', enabled: true },
  { id: 'wfm', title: 'People & HR Workforce', category: 'Operations', description: 'Rosters, attendance, onboarding, training, and shift schedules.', enabled: true },
  { id: 'ci', title: 'Continuous Improvement & Andon', category: 'Operations', description: 'Kaizen ideas, Gemba walks, 5S audits, and live Andon floor alerts.', enabled: true },
  { id: 'quality', title: 'Quality & Defect Tracking', category: 'Compliance', description: 'Defect logging, root-cause analysis (RCA), and audit results.', enabled: true },
  { id: 'security', title: 'Security & Loss Prevention', category: 'Facility', description: 'Gate logs, visitor management, and high-value item tracking.', enabled: true },
  { id: 'facilities', title: 'Facilities & Sustainability', category: 'Facility', description: 'Energy consumption, waste management, recycling, and building checks.', enabled: false },
  { id: 'learning', title: 'Learning & SOP Academy', category: 'Training', description: 'Role-based training paths, SOP library, short videos, and floor sign-offs.', enabled: false },
  { id: 'communications', title: 'Communications & Handover', category: 'Operations', description: 'Daily start-up meeting notes, site announcements, and digital notice boards.', enabled: false },
  { id: 'engagement', title: 'Associate Engagement', category: 'HR', description: 'Pulse surveys, peer recognition, suggestion follow-ups, and "ask the manager".', enabled: false },
  { id: 'compliance', title: 'Compliance & Legal Audits', category: 'Safety & Compliance', description: 'Internal audit schedules, regulatory inspection records, and statutory certificates.', enabled: true },
  { id: 'procurement', title: 'Procurement & Consumables', category: 'Supply Chain', description: 'Packaging, stretch wrap, labels, PPE stock levels, and purchase requests.', enabled: true },
  { id: 'documents', title: 'Document Control', category: 'Compliance', description: 'Version-controlled SOPs, approval workflows, and read-and-acknowledge tracking.', enabled: false },
  { id: 'it', title: 'IT & Device Fleet', category: 'Infrastructure', description: 'Zebra/Honeywell scanner, printer and tablet inventory, and IT helpdesk tickets.', enabled: true },
  { id: 'my-work', title: 'My Work Inbox', category: 'Personal', description: 'Unified personal inbox for pending tasks, approvals, and expiring certifications.', enabled: true },
  { id: 'reporting', title: 'Reporting & Analytics', category: 'Intelligence', description: 'Custom dashboards, scheduled email reports, data exports, and wall-screen views.', enabled: true },
  { id: 'admin', title: 'Administration & Integrations', category: 'System', description: 'Users, RBAC permissions, site setup, audit trails, and WMS/HRIS connectors.', enabled: true }
]
