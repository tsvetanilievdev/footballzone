'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, UserIcon, DocumentTextIcon, RectangleStackIcon, EyeIcon } from '@heroicons/react/24/outline'

// Coaches data from documentation
const coaches = [
  {
    name: 'Antonio Conte',
    slug: 'antonio-conte',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Former Chelsea, Inter, Juventus',
    specialties: ['3-5-2 Formation', 'Intensive Training', 'Team Psychology'],
    articlesCount: 8,
    seriesCount: 3,
    description: 'Известен с интензивния си стил и тактическата гениалност'
  },
  {
    name: 'Massimiliano Allegri',
    slug: 'massimiliano-allegri',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Former Juventus, AC Milan',
    specialties: ['Tactical Flexibility', 'Champions League', 'Squad Rotation'],
    articlesCount: 6,
    seriesCount: 2,
    description: 'Майстор на тактическата адаптация и управление на звезди'
  },
  {
    name: 'Jürgen Klopp',
    slug: 'jurgen-klopp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Former Liverpool',
    specialties: ['Gegenpressing', 'Heavy Metal Football', 'Team Building'],
    articlesCount: 10,
    seriesCount: 4,
    description: 'Революционна философия на интензивно натискане и колективност'
  },
  {
    name: 'Pep Guardiola',
    slug: 'pep-guardiola',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Manchester City',
    specialties: ['Possession Football', 'Tactical Innovation', 'Academy Development'],
    articlesCount: 12,
    seriesCount: 5,
    description: 'Визионер на притежателния футбол и тактическите иновации'
  },
  {
    name: 'Други треньори',
    slug: 'other-coaches',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    currentTeam: 'Различни отбори',
    specialties: ['Diverse Methods', 'Various Tactics', 'Multiple Approaches'],
    articlesCount: 15,
    seriesCount: 7,
    description: 'Още треньори и разнообразни методи'
  }
]

export default function CoachesSeriesPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 opacity-70"></div>
          
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
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group"
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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                <span className="text-4xl">👨‍🏫</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Треньори
              </h1>
              
              <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
                Философии и методи на най-успешните треньори в света
              </p>
              
              <div className="inline-flex items-center text-sm font-medium text-gray-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
                <UserIcon className="w-4 h-4 mr-2" />
                {coaches.length} профила на треньори
              </div>
            </motion.div>
          </div>
        </section>

        {/* Coaches Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coaches.map((coach, index) => (
                <motion.div
                  key={coach.slug}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(coach.slug)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={`/series/coaches/${coach.slug}`} className="block group">
                    <div className={`
                      relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden
                      transition-all duration-500 hover:scale-105 hover:shadow-2xl
                      ${hoveredCard === coach.slug ? 'shadow-2xl scale-105' : ''}
                    `}>
                      {/* Avatar Section */}
                      <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                              src={coach.avatar}
                              alt={coach.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          {/* Status Badge */}
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          {coach.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 font-medium">
                          {coach.currentTeam}
                        </p>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {coach.description}
                        </p>

                        {/* Specialties */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {coach.specialties.slice(0, 2).map((specialty) => (
                              <span
                                key={specialty}
                                className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                            {coach.specialties.length > 2 && (
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                +{coach.specialties.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            <span>{coach.articlesCount} статии</span>
                          </div>
                          <div className="flex items-center">
                            <RectangleStackIcon className="w-4 h-4 mr-1" />
                            <span>{coach.seriesCount} поредици</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          <span>Разгледайте профила</span>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Станете част от елита
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Учете от най-добрите треньори и развийте своята футболна философия
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Започнете безплатно
                </Link>
                <Link
                  href="/series/players"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-colors"
                >
                  Вижте играчите
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