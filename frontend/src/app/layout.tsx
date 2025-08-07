import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FootballZone.bg - Образователна футболна платформа',
  description: 'Образователна футболна платформа за играчи, треньори и родители. Безплатни статии, видео уроци и премиум съдържание.',
  keywords: 'футбол, треньор, играч, родител, обучение, тактики, умения',
  authors: [{ name: 'FootballZone.bg' }],
  openGraph: {
    title: 'FootballZone.bg - Образователна футболна платформа',
    description: 'Образователна футболна платформа за играчи, треньори и родители',
    type: 'website',
    locale: 'bg_BG',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
