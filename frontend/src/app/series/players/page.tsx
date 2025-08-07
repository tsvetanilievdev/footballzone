'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, UserIcon, DocumentTextIcon, RectangleStackIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline'

// Players data from documentation
const players = [
  {
    name: 'Lionel Messi',
    slug: 'lionel-messi',
    avatar: 'https://images.unsplash.com/photo-1594736797933-d0d6ac4e5ded?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Inter Miami',
    position: 'Forward',
    specialties: ['Dribbling', 'Free Kicks', 'Playmaking'],
    articlesCount: 15,
    seriesCount: 6,
    description: 'Най-великият играч в историята на футбола',
    rating: 5,
    achievements: ['8x Ballon d\'Or', 'World Cup Winner', 'Champions League Winner']
  },
  {
    name: 'Lamine Yamal',
    slug: 'lamine-yamal',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'FC Barcelona',
    position: 'Right Winger',
    specialties: ['Youth Development', 'Wing Play', 'Technical Skills'],
    articlesCount: 5,
    seriesCount: 2,
    description: 'Новата звезда на световния футбол',
    rating: 4,
    achievements: ['Youngest Barca Debutant', 'Euro 2024 Winner', 'La Liga Champion']
  },
  {
    name: 'Rodri',
    slug: 'rodri',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Manchester City',
    position: 'Defensive Midfielder',
    specialties: ['Ball Distribution', 'Defensive Positioning', 'Leadership'],
    articlesCount: 7,
    seriesCount: 3,
    description: 'Майстор на дефанзивната полузащита',
    rating: 4,
    achievements: ['Champions League Winner', 'Premier League Champion', 'Ballon d\'Or Winner']
  },
  {
    name: 'Mohamed Salah',
    slug: 'mohamed-salah',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Liverpool',
    position: 'Right Winger',
    specialties: ['Pace', 'Finishing', 'Counter-Attacking'],
    articlesCount: 9,
    seriesCount: 4,
    description: 'Египетският крал на Анфийлд',
    rating: 5,
    achievements: ['Premier League Golden Boot', 'Champions League Winner', 'PFA Player of the Year']
  },
  {
    name: 'Други играчи',
    slug: 'other-players',
    avatar: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Различни отбори',
    position: 'Various',
    specialties: ['Diverse Skills', 'Multiple Positions', 'Various Techniques'],
    articlesCount: 20,
    seriesCount: 10,
    description: 'Още играчи и разнообразни техники',
    rating: 4,
    achievements: ['Multiple Trophies', 'Various Awards', 'International Success']
  }
]

const positions = [
  { name: 'Forward', color: 'red', count: 2 },
  { name: 'Midfielder', color: 'blue', count: 1 },
  { name: 'Winger', color: 'green', count: 2 },
  { name: 'Various', color: 'purple', count: 1 }
]

export default function PlayersSeriesPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string>('all')

  const filteredPlayers = selectedPosition === 'all' 
    ? players 
    : players.filter(player => 
        player.position.toLowerCase().includes(selectedPosition.toLowerCase()) ||
        selectedPosition === 'winger' && player.position.includes('Winger')
      )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-70"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            {/* Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link 
                href="/series" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Обратно към Series Zone
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                <span className="text-4xl">⚽</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Играчи
              </h1>
              
              <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
                Техники и стратегии на най-талантливите звезди в света
              </p>
              
              <div className="inline-flex items-center text-sm font-medium text-gray-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
                <UserIcon className="w-4 h-4 mr-2" />
                {players.length} профила на играчи
              </div>
            </motion.div>
          </div>
        </section>

        {/* Position Filter */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <button
                onClick={() => setSelectedPosition('all')}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all duration-300
                  ${selectedPosition === 'all' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }
                `}
              >
                Всички ({players.length})
              </button>
              {positions.map((position) => (
                <button
                  key={position.name}
                  onClick={() => setSelectedPosition(position.name)}
                  className={`
                    px-4 py-2 rounded-full font-medium transition-all duration-300
                    ${selectedPosition === position.name 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }
                  `}
                >
                  {position.name} ({position.count})
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Players Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlayers.map((player, index) => (
                <motion.div
                  key={player.slug}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(player.slug)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={`/series/players/${player.slug}`} className="block group">
                    <div className={`
                      relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden
                      transition-all duration-500 hover:scale-105 hover:shadow-2xl
                      ${hoveredCard === player.slug ? 'shadow-2xl scale-105' : ''}
                    `}>
                      {/* Avatar Section */}
                      <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                              src={player.avatar}
                              alt={player.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          {/* Rating Badge */}
                          <div className="absolute -bottom-2 -right-2 flex items-center bg-yellow-400 rounded-full px-2 py-1 border-4 border-white">
                            <StarIcon className="w-3 h-3 text-yellow-800 mr-1" />
                            <span className="text-yellow-800 text-xs font-bold">{player.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {player.name}
                        </h3>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <p className="text-sm text-gray-600 font-medium">
                            {player.currentTeam}
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {player.position}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {player.description}
                        </p>

                        {/* Specialties */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {player.specialties.slice(0, 2).map((specialty) => (
                              <span
                                key={specialty}
                                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                            {player.specialties.length > 2 && (
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                +{player.specialties.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Achievement Preview */}
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-800 font-medium">
                            🏆 {player.achievements[0]}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            <span>{player.articlesCount} статии</span>
                          </div>
                          <div className="flex items-center">
                            <RectangleStackIcon className="w-4 h-4 mr-1" />
                            <span>{player.seriesCount} поредици</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          <span>Разгледайте профила</span>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Учете от звездите
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Развийте уменията си с техниките на най-добрите играчи в света
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Започнете безплатно
                </Link>
                <Link
                  href="/series/coaches"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Вижте треньорите
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}