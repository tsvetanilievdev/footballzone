'use client'

import { CheckIcon } from '@heroicons/react/24/outline'

interface ZoneAssignmentSelectorProps {
  selectedZones: string[]
  onZonesChange: (zones: string[]) => void
  className?: string
}

const availableZones = [
  {
    id: 'read',
    name: 'Read Zone',
    description: 'Общо четиво и анализи',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📖'
  },
  {
    id: 'coach',
    name: 'Coach Zone',
    description: 'Треньорски материали',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '⚽'
  },
  {
    id: 'player',
    name: 'Player Zone',
    description: 'За футболисти',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🏃‍♂️'
  },
  {
    id: 'parent',
    name: 'Parent Zone',
    description: 'За родители',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'series',
    name: 'Series Zone',
    description: 'Част от поредица',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '📚'
  }
]

export default function ZoneAssignmentSelector({
  selectedZones,
  onZonesChange,
  className = ''
}: ZoneAssignmentSelectorProps) {
  const handleZoneToggle = (zoneId: string) => {
    if (selectedZones.includes(zoneId)) {
      onZonesChange(selectedZones.filter(id => id !== zoneId))
    } else {
      onZonesChange([...selectedZones, zoneId])
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Избери зони за показване
        </h3>
        <p className="text-sm text-gray-600">
          Статията може да се показва в няколко зони едновременно
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableZones.map(zone => {
          const isSelected = selectedZones.includes(zone.id)
          
          return (
            <div
              key={zone.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? `${zone.color} border-opacity-100 shadow-sm` 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => handleZoneToggle(zone.id)}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="text-2xl">{zone.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {zone.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {zone.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected zones summary */}
      {selectedZones.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">
            Избрани зони ({selectedZones.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedZones.map(zoneId => {
              const zone = availableZones.find(z => z.id === zoneId)
              return zone ? (
                <span
                  key={zoneId}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${zone.color}`}
                >
                  <span className="mr-1">{zone.icon}</span>
                  {zone.name}
                </span>
              ) : null
            })}
          </div>
          
          {selectedZones.length > 1 && (
            <p className="text-sm text-gray-600 mt-2">
              💡 Статията ще се показва във всички избрани зони
            </p>
          )}
        </div>
      )}

      {/* Zone-specific settings */}
      {selectedZones.includes('series') && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            📚 Настройки за поредица
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Тази статия ще бъде част от поредица. Допълнителни настройки ще се появят в секцията &quot;Поредица&quot;.
          </p>
        </div>
      )}

      {selectedZones.includes('coach') && selectedZones.includes('player') && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">
            ⚽ Кросзонова статия
          </h4>
          <p className="text-sm text-green-700">
            Статията ще се показва и в Coach Zone, и в Player Zone. Уверете се, че съдържанието е подходящо за двете аудитории.
          </p>
        </div>
      )}
    </div>
  )
}