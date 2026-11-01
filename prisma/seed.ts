import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.metric.deleteMany()
  await prisma.operationalLog.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.andonAlert.deleteMany()

  await prisma.metric.createMany({
    data: [
      { moduleId: 'whs', key: 'TRIR', value: '0.42', status: 'NORMAL' },
      { moduleId: 'whs', key: 'DART', value: '0.18', status: 'NORMAL' },
      { moduleId: 'rme', key: 'Conveyor Uptime', value: '99.1%', status: 'NORMAL' },
      { moduleId: 'wfm', key: 'Labor Utilization', value: '92.4%', status: 'NORMAL' },
      { moduleId: 'ci', key: 'Andon MTTR', value: '3.2 mins', status: 'NORMAL' },
      { moduleId: 'quality', key: 'Outbound Defect Rate', value: '142 PPM', status: 'NORMAL' },
      { moduleId: 'security', key: 'Carrier Turnaround', value: '42 mins', status: 'NORMAL' },
      { moduleId: 'facilities', key: 'Energy Efficiency (PUE)', value: '1.18', status: 'NORMAL' },
      { moduleId: 'visitors', key: 'Active Contractors', value: '12 Personnel', status: 'NORMAL' },
      { moduleId: 'compliance', key: 'Audit Readiness', value: '98.5%', status: 'NORMAL' },
      { moduleId: 'documents', key: 'Active SOP Compliance', value: '99.4%', status: 'NORMAL' },
      { moduleId: 'it', key: 'RF Scanners Online', value: '142 / 145', status: 'NORMAL' },
      { moduleId: 'my-work', key: 'Pending Approvals', value: '4 Items', status: 'NORMAL' },
      { moduleId: 'reporting', key: 'Scheduled Reports', value: '12 Reports', status: 'NORMAL' },
      { moduleId: 'admin', key: 'Active RBAC Users', value: '184 Accounts', status: 'NORMAL' },
    ],
  })

  await prisma.employee.createMany({
    data: [
      { employeeId: 'IDL-88201', name: 'Marcus Brody', department: 'Inbound RME', shift: 'Shift A (07:00 - 15:30)', status: 'CLOCK_IN' },
      { employeeId: 'IDL-88204', name: 'Sarah Jenkins', department: 'WHS Safety', shift: 'Shift A (07:00 - 15:30)', status: 'CLOCK_IN' },
      { employeeId: 'IDL-88310', name: 'Ritesh Kumar', department: 'Operations Lead', shift: 'Shift A (07:00 - 15:30)', status: 'CLOCK_IN' },
    ],
  })

  await prisma.andonAlert.create({
    data: {
      alertId: 'ANDON-402',
      station: 'Zone C - Pack Station 12',
      issue: 'Material Shortage (Boxes)',
      duration: '4 mins',
      status: 'ACKNOWLEDGED',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
