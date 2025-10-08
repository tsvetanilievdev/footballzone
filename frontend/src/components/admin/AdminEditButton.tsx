'use client'

import React from 'react'
import Link from 'next/link'
import { PencilIcon, CogIcon } from '@heroicons/react/24/outline'
import { Article } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface AdminEditButtonProps {
  article: Article
  className?: string
  showAdminControls?: boolean
}

export default function AdminEditButton({
  article,
  className = '',
  showAdminControls = true
}: AdminEditButtonProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  if (!isAdmin || !showAdminControls) {
    return null
  }

  return (
    <div className={`admin-controls ${className}`}>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {/* Edit Article Button */}
        <Link
          href={`/admin?edit=${article.id}`}
          className="group bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Редактирай статията"
        >
          <PencilIcon className="w-5 h-5" />
        </Link>

        {/* Admin Panel Button */}
        <Link
          href="/admin"
          className="group bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Админ панел"
        >
          <CogIcon className="w-5 h-5" />
        </Link>
      </div>

      {/* Admin Info Bar */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-medium z-40 border-b border-yellow-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CogIcon className="w-4 h-4" />
              Режим админ
            </span>
            <span className="text-yellow-700">•</span>
            <span>Статия ID: {article.id}</span>
            <span className="text-yellow-700">•</span>
            <span>Категория: {article.category}</span>
            {article.isPremium && (
              <>
                <span className="text-yellow-700">•</span>
                <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                  PREMIUM
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span>Зони:</span>
            {Object.entries(article.zoneSettings || {})
              .filter(([, settings]) => settings?.visible)
              .map(([zone], index) => (
                <span
                  key={zone}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    zone === 'read' ? 'bg-blue-200 text-blue-800' :
                    zone === 'coach' ? 'bg-green-200 text-green-800' :
                    zone === 'player' ? 'bg-purple-200 text-purple-800' :
                    'bg-orange-200 text-orange-800'
                  }`}
                >
                  {zone}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Spacer for fixed admin bar */}
      <div className="h-12" />
    </div>
  )
}