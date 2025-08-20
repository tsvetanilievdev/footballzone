/**
 * FootballZone.bg Frontend Application
 * Copyright (c) 2024 FootballZone.bg - All Rights Reserved
 * 
 * This software is proprietary and confidential.
 * No part of this software may be reproduced, distributed, or transmitted
 * without the prior written permission of the copyright holder.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryProvider } from '@/providers/QueryProvider'

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
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
