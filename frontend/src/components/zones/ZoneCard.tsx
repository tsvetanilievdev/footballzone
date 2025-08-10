import Link from 'next/link'
import { Zone } from '@/types'
import { Button } from '@/components/ui/Button'
import { LockIcon, UnlockIcon } from 'lucide-react'

interface ZoneCardProps {
  zone: Zone
}

export default function ZoneCard({ zone }: ZoneCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${zone.color}`}>
            <span className="text-white text-xl font-bold">{zone.icon}</span>
          </div>
          {zone.isPremium ? (
            <LockIcon className="w-5 h-5 text-amber-500" />
          ) : (
            <UnlockIcon className="w-5 h-5 text-green-500" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{zone.name}</h3>
        <p className="text-gray-700 mb-4">{zone.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>{zone.articleCount} статии</span>
            <span>{zone.videoCount} видео</span>
          </div>
          {zone.isPremium && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Премиум
            </span>
          )}
        </div>
        
        <Link href={`/${zone.id.toLowerCase()}`}>
          <Button 
            variant={zone.isPremium ? "default" : "outline"} 
            className="w-full"
          >
            {zone.isPremium ? 'Абонирай се' : 'Разгледай'}
          </Button>
        </Link>
      </div>
    </div>
  )
} 