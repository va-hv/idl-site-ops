import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AssignmentAttempt {
  employeeId: string
  jobFunctionId: string
  zoneId: string
  overrideReason?: string
}

export async function validateAndAssignWork(attempt: AssignmentAttempt) {
  // 1. Fetch job function requirements
  const jobFunction = await prisma.jobFunction.findUnique({
    where: { id: attempt.jobFunctionId }
  })

  if (!jobFunction) throw new Error('Job function not found.')

  // 2. If the role requires certification, check active valid credentials
  if (jobFunction.requiresCert) {
    const activeCert = await prisma.certification.findFirst({
      where: {
        employeeId: attempt.employeeId,
        expiryDate: { gte: new Date() },
        isValid: true
      }
    })

    if (!activeCert) {
      // Hard Safety Block triggered!
      if (!attempt.overrideReason) {
        throw new Error(
          '🚨 HARD SAFETY BLOCK: Worker lacks a valid required certification for this role. Assignment prohibited under safety compliance rules.'
        )
      }
    }
  }

  // 3. Proceed with assignment if checks pass
  return await prisma.workAssignment.create({
    data: {
      employeeId: attempt.employeeId,
      jobFunctionId: attempt.jobFunctionId,
      zoneId: attempt.zoneId,
      overrideUsed: !!attempt.overrideReason,
      overrideReason: attempt.overrideReason || null
    }
  })
}
