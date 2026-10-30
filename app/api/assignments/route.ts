import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateAndAssignWork } from '@/lib/safetyGuard'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        certifications: true,
        department: true,
        assignments: {
          include: { zone: true, jobFunction: true }
        }
      }
    })

    const zones = await prisma.zone.findMany({
      include: {
        assignments: {
          include: { employee: true, jobFunction: true }
        }
      }
    })

    const jobFunctions = await prisma.jobFunction.findMany()

    return NextResponse.json({ employees, zones, jobFunctions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeId, jobFunctionId, zoneId, overrideReason } = body

    const assignment = await validateAndAssignWork({
      employeeId,
      jobFunctionId,
      zoneId,
      overrideReason
    })

    return NextResponse.json({ success: true, assignment })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
