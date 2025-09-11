import { Metadata } from 'next'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export const metadata: Metadata = {
  title: 'Аналитика | FootballZone.bg',
  description: 'Подробна аналитика и статистики за FootballZone.bg платформата',
}

export default function AnalyticsPage() {
  return <AnalyticsDashboard />
}