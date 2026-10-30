import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.auditLog.deleteMany()
  await prisma.workAssignment.deleteMany()
  await prisma.inspection.deleteMany()
  await prisma.workOrder.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.certification.deleteMany()
  await prisma.jobFunction.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.department.deleteMany()
  await prisma.site.deleteMany()

  const site = await prisma.site.create({
    data: {
      code: 'YYZ-01',
      name: 'ID Logistics Canada - Fulfillment Centre',
      province: 'Ontario'
    }
  })

  const dept = await prisma.department.create({
    data: {
      siteId: site.id,
      name: 'Material Handling & Yard'
    }
  })

  const jobFunction = await prisma.jobFunction.create({
    data: {
      departmentId: dept.id,
      title: 'Reach Truck Operator',
      requiresCert: true
    }
  })

  const zone = await prisma.zone.create({
    data: {
      siteId: site.id,
      name: 'High-Bay Racking Zone A',
      code: 'ZONE-A'
    }
  })

  // Worker 1: Expired Certification (Should trigger Hard Safety Block)
  const expiredWorker = await prisma.employee.create({
    data: {
      departmentId: dept.id,
      employeeNumber: 'EMP-1001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@idlogistics.test'
    }
  })

  await prisma.certification.create({
    data: {
      employeeId: expiredWorker.id,
      type: 'PIT_FORKLIFT',
      issuedDate: new Date('2023-01-01'),
      expiryDate: new Date('2024-01-01'), // Expired
      isValid: false
    }
  })

  // Worker 2: Valid Certification
  const validWorker = await prisma.employee.create({
    data: {
      departmentId: dept.id,
      employeeNumber: 'EMP-1002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@idlogistics.test'
    }
  })

  await prisma.certification.create({
    data: {
      employeeId: validWorker.id,
      type: 'PIT_FORKLIFT',
      issuedDate: new Date('2025-01-01'),
      expiryDate: new Date('2028-01-01'), // Valid
      isValid: true
    }
  })

  console.log('🌱 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
