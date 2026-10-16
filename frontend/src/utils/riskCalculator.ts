export interface RiskInput {
  attendance: number // 0-100
  performance: number // 0-100
  failedSubjects: number // 0-6
  trend: 'improving' | 'stable' | 'declining'
}

export interface RiskFactor {
  label: string
  weight: number
  direction: 'risk' | 'protective'
}

export interface RiskResult {
  level: 'high' | 'medium' | 'low'
  score: number // 0-100
  factors: RiskFactor[]
  suggestion: string
}

export const RISK_THRESHOLDS = {
  high: 65,
  medium: 35,
}

export function calculateRisk(input: RiskInput): RiskResult {
  const { attendance, performance, failedSubjects, trend } = input

  // Calculate weighted components
  const attendanceComponent = (100 - attendance) * 0.35
  const performanceComponent = (100 - performance) * 0.35
  const failedSubjectsComponent = (failedSubjects / 6) * 100 * 0.2
  const trendComponent = trend === 'declining' ? 10 : trend === 'improving' ? -10 : 0

  // Calculate total score
  const rawScore = attendanceComponent + performanceComponent + failedSubjectsComponent + trendComponent
  const score = Math.max(0, Math.min(100, rawScore))

  // Determine risk level
  const level: 'high' | 'medium' | 'low' =
    score >= RISK_THRESHOLDS.high ? 'high' : score >= RISK_THRESHOLDS.medium ? 'medium' : 'low'

  // Build factors array
  const factors: RiskFactor[] = []

  if (attendance < 85) {
    factors.push({
      label: `Attendance: ${attendance}%`,
      weight: attendanceComponent / 100,
      direction: 'risk',
    })
  }

  if (performance < 65) {
    factors.push({
      label: `Performance: ${performance}%`,
      weight: performanceComponent / 100,
      direction: 'risk',
    })
  }

  if (failedSubjects > 0) {
    factors.push({
      label: `Failed subjects: ${failedSubjects}`,
      weight: failedSubjectsComponent / 100,
      direction: 'risk',
    })
  }

  if (trend === 'improving' && (attendance > 75 || performance > 55)) {
    factors.push({
      label: 'Improving trend',
      weight: 0.1,
      direction: 'protective',
    })
  }

  if (trend === 'declining') {
    factors.push({
      label: 'Declining trend',
      weight: 0.1,
      direction: 'risk',
    })
  }

  // Sort by weight descending, take top 3
  const topFactors = factors.sort((a, b) => b.weight - a.weight).slice(0, 3)

  // Generate suggestion
  const suggestion = generateSuggestion(level, trend)

  return {
    level,
    score: Math.round(score),
    factors: topFactors,
    suggestion,
  }
}

function generateSuggestion(level: 'high' | 'medium' | 'low', trend: 'improving' | 'stable' | 'declining'): string {
  if (level === 'high') {
    if (trend === 'declining') {
      return 'Immediate intervention recommended — assign a counselor.'
    } else if (trend === 'stable') {
      return 'Schedule review meeting and check support needs.'
    } else {
      return 'Keep current interventions — progress is positive.'
    }
  }

  if (level === 'medium') {
    if (trend === 'declining') {
      return 'Monitor closely and consider a check-in.'
    }
    return 'Send a proactive support message.'
  }

  // Low risk
  if (trend === 'improving') {
    return 'Student is on track — maintain current support.'
  }
  return 'Student performing well — no action needed.'
}
