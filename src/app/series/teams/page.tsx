'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'

// Mock data за отбори
const teams = [
  {
    id: 'manchester-city',
    name: 'Манчестър Сити',
    country: 'Англия',
    description: 'Тактическата еволюция под ръководството на Пеп Гуардиола',
    seriesCount: 4,
    articlesCount: 12,
    color: 'from-sky-400 to-blue-600',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    achievements: ['Premier League x6', 'Champions League x1', 'FA Cup x3'],
    specialties: ['Позиционна игра', 'Висока преса', 'Контрол на топката']
  },
  {
    id: 'barcelona',
    name: 'ФК Барселона',
    country: 'Испания',
    description: 'Tiki-taka философията и каталунското футболно наследство',
    seriesCount: 6,
    articlesCount: 18,
    color: 'from-blue-600 to-red-600',
    flag: '🇪🇸',
    achievements: ['La Liga x26', 'Champions League x5', 'Copa del Rey x31'],
    specialties: ['Tiki-taka', 'Кратки пасове', 'Футболна академия']
  },
  {
    id: 'liverpool',
    name: 'Ливърпул',
    country: 'Англия',
    description: 'Gegenpressing и ментални трансформации с Юрген Клоп',
    seriesCount: 3,
    articlesCount: 9,
    color: 'from-red-500 to-red-700',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    achievements: ['Premier League x1', 'Champions League x1', 'FIFA Club World Cup x1'],
    specialties: ['Gegenpressing', 'Интензитет', 'Ментална сила']
  },
  {
    id: 'real-madrid',
    name: 'Реал Мадрид',
    country: 'Испания',
    description: 'Winning mentality и европейската доминация',
    seriesCount: 5,
    articlesCount: 15,
    color: 'from-white to-purple-600',
    flag: '🇪🇸',
    achievements: ['La Liga x35', 'Champions League x14', 'Copa del Rey x19'],
    specialties: ['Winning mentality', 'Контраатаки', 'Голяма сцена']
  },
  {
    id: 'bayern-munich',
    name: 'Байерн Мюнхен',
    country: 'Германия',
    description: 'Немската прецизност и доминация в Бундеслигата',
    seriesCount: 4,
    articlesCount: 12,
    color: 'from-red-600 to-blue-800',
    flag: '🇩🇪',
    achievements: ['Bundesliga x32', 'Champions League x6', 'DFB-Pokal x20'],
    specialties: ['Прецизност', 'Физическа подготовка', 'Дисциплина']
  },
  {
    id: 'juventus',
    name: 'Ювентус',
    country: 'Италия',
    description: 'Италианската тактическа култура и защитна организация',
    seriesCount: 3,
    articlesCount: 9,
    color: 'from-black to-white',
    flag: '🇮🇹',
    achievements: ['Serie A x36', 'Champions League x2', 'Coppa Italia x14'],
    specialties: ['Тактическа дисциплина', 'Защита', 'Catenaccio']
  }
]

const leagues = [
  { name: 'Premier League', teams: 2, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'La Liga', teams: 2, flag: '🇪🇸' },
  { name: 'Bundesliga', teams: 1, flag: '🇩🇪' },
  { name: 'Serie A', teams: 1, flag: '🇮🇹' }
]

export default function TeamsSeriesPage() {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null)

  const filteredTeams = selectedLeague 
    ? teams.filter(team => {
        if (selectedLeague === 'Premier League') return ['manchester-city', 'liverpool'].includes(team.id)
        if (selectedLeague === 'La Liga') return ['barcelona', 'real-madrid'].includes(team.id)
        if (selectedLeague === 'Bundesliga') return ['bayern-munich'].includes(team.id)
        if (selectedLeague === 'Serie A') return ['juventus'].includes(team.id)
        return false
      })
    : teams

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-60"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-300 rounded-full opacity-20 blur-xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
                🏆 Отбори
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
                Тактики, философии и анализи на световните футболни гиганти
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Разберете какво прави великите отбори толкова специални
              </p>
            </div>

            {/* Quick Stats */}
            <div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto animate-fade-in-up" 
              style={{ animationDelay: '200ms' }}
            >
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-gray-900">{teams.length}</div>
                <div className="text-sm text-gray-600">Отбора</div>
              </div>
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-2xl font-bold text-gray-900">
                  {teams.reduce((sum, team) => sum + team.seriesCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Поредици</div>
              </div>
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">📖</div>
                <div className="text-2xl font-bold text-gray-900">
                  {teams.reduce((sum, team) => sum + team.articlesCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Статии</div>
              </div>
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-2xl font-bold text-gray-900">{leagues.length}</div>
                <div className="text-sm text-gray-600">Лиги</div>
              </div>
            </div>
          </div>
        </section>

        {/* League Filter */}
        <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Филтрирай по лига
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setSelectedLeague(null)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedLeague === null
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  Всички лиги
                </button>
                
                {leagues.map(league => (
                  <button
                    key={league.name}
                    onClick={() => setSelectedLeague(league.name)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                      selectedLeague === league.name
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <span>{league.flag}</span>
                    <span>{league.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {league.teams}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Teams Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeams.map((team, index) => (
                <div
                  key={team.id}
                  className="group animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredTeam(team.id)}
                  onMouseLeave={() => setHoveredTeam(null)}
                >
                  <Link href={`/series/teams/${team.id}`} className="block">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                      {/* Team Header */}
                      <div className={`h-32 bg-gradient-to-r ${team.color} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-4 right-4 text-2xl">{team.flag}</div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                          <p className="text-sm opacity-90">{team.country}</p>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                          hoveredTeam === team.id ? 'opacity-100' : 'opacity-0'
                        }`}></div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {team.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-purple-600">
                              <span className="mr-1">📚</span>
                              <span className="font-medium">{team.seriesCount}</span>
                              <span className="text-gray-500 ml-1">поредици</span>
                            </div>
                            <div className="flex items-center text-indigo-600">
                              <span className="mr-1">📖</span>
                              <span className="font-medium">{team.articlesCount}</span>
                              <span className="text-gray-500 ml-1">статии</span>
                            </div>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Специалности:</p>
                          <div className="flex flex-wrap gap-1">
                            {team.specialties.slice(0, 2).map(specialty => (
                              <span
                                key={specialty}
                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                            {team.specialties.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{team.specialties.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Постижения:</p>
                          <div className="space-y-1">
                            {team.achievements.slice(0, 2).map(achievement => (
                              <div key={achievement} className="text-xs text-gray-600 flex items-center">
                                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                                {achievement}
                              </div>
                            ))}
                            {team.achievements.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{team.achievements.length - 2} още постижения
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Виж поредиците</span>
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <span className="text-purple-600 group-hover:translate-x-1 transition-transform text-sm">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* No results */}
            {filteredTeams.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Няма намерени отбори
                </h3>
                <p className="text-gray-600">
                  Променете филтъра или опитайте отново
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Скоро още отбори
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Работим върху добавяне на още легендарни отбори и техните уникални истории
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['🇫🇷 PSG', '🇳🇱 Ajax', '🇵🇹 Porto', '🇪🇸 Atlético'].map((team, index) => (
                  <div
                    key={team}
                    className="p-4 bg-white rounded-lg border border-gray-200 opacity-60 animate-fade-in-up"
                    style={{ animationDelay: `${1000 + index * 100}ms` }}
                  >
                    <div className="text-2xl mb-2">{team.split(' ')[0]}</div>
                    <div className="text-sm font-medium text-gray-700">{team.split(' ')[1]}</div>
                    <div className="text-xs text-gray-500 mt-1">Скоро</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}