import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      settingsRecords,
      services,
      portfolio,
      testimonials,
      team,
      stats,
      offices,
      highlights,
      footerLinks,
    ] = await Promise.all([
      db.siteSetting.findMany(),
      db.service.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.portfolioProject.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.teamMember.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.stat.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.office.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.aboutHighlight.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.footerLink.findMany({ orderBy: { order: 'asc' } }),
    ])

    const settings: Record<string, string> = {}
    for (const s of settingsRecords) {
      settings[s.key] = s.value
    }

    return NextResponse.json(
      {
        settings,
        services,
        portfolio,
        testimonials,
        team,
        stats,
        offices,
        highlights,
        footerLinks,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('SiteContent GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}