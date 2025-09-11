import { Metadata } from 'next'
import EmailPreferences from '@/components/profile/EmailPreferences'

export const metadata: Metadata = {
  title: 'Имейл настройки | FootballZone.bg',
  description: 'Управлявайте вашите имейл настройки и уведомления',
}

export default function EmailPreferencesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EmailPreferences />
    </div>
  )
}