'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

// Series Zone data according to documentation
const seriesSelectors = [
  {
    id: 'coaches',
    name: 'Треньори',
    icon: '👨‍🏫',
    description: 'Философии и методи на топ треньори',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    href: '/series/coaches',
    count: '4 профила'
  },
  {
    id: 'players',
    name: 'Играчи',
    icon: '⚽',
    description: 'Техники и стратегии на звездите',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    href: '/series/players',
    count: '4 профила'
  },
  {
    id: 'teams',
    name: 'Отбори',
    icon: '🏆',
    description: 'Тактики и философии на световни клубове',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    href: '/series/teams',
    count: '6 отбора'
  }
]

const stats = [
  { label: 'Профили & Отбори', value: '14+', icon: '👤' },
  { label: 'Статии', value: '180+', icon: '📄' },
  { label: 'Поредици', value: '35+', icon: '📚' },
  { label: 'Часа съдържание', value: '80+', icon: '⏱️' }
]

export default function SeriesZone() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-50"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Series Zone
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
                Задълбочени поредици за треньори и играчи
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Открийте уникални истории, тактики и техники от световните звезди на футбола
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Selection */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Изберете категория
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Разгледайте поредици от различни професионалисти във футбола
              </p>
            </motion.div>

            {/* Selection Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {seriesSelectors.map((selector, index) => (
                <motion.div
                  key={selector.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.2 }}
                  onMouseEnter={() => setHoveredCard(selector.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={selector.href} className="block group">
                    <div className={`
                      relative p-8 rounded-3xl border-2 border-gray-200 bg-white
                      transition-all duration-500 hover:scale-105 hover:shadow-2xl
                      ${hoveredCard === selector.id ? 'shadow-2xl scale-105' : 'shadow-lg'}
                    `}>
                      {/* Background Gradient */}
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${selector.gradient} opacity-0 
                        group-hover:opacity-10 transition-opacity duration-500 rounded-3xl
                      `}></div>
                      
                      {/* Icon Circle */}
                      <div className={`
                        w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                        bg-gradient-to-br ${selector.gradient} shadow-lg
                        transform transition-transform duration-500 group-hover:scale-110
                      `}>
                        <span className="text-4xl">{selector.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                          {selector.name}
                        </h3>
                        <p className="text-gray-600 mb-4 text-lg">
                          {selector.description}
                        </p>
                        <div className="inline-flex items-center text-sm font-medium text-gray-500 mb-6">
                          <span className="mr-2">📊</span>
                          {selector.count}
                        </div>
                        
                        {/* Action Button */}
                        <div className={`
                          inline-flex items-center px-6 py-3 rounded-full font-medium
                          bg-gradient-to-r ${selector.gradient} text-white
                          transform transition-all duration-300 group-hover:scale-110
                          shadow-md group-hover:shadow-lg
                        `}>
                          <span>Разгледайте</span>
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-100 rounded-full opacity-30 group-hover:opacity-70 transition-opacity"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Highlights */}
        <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Защо Series Zone?
              </h2>
              <p className="text-lg text-gray-600">
                Уникален достъп до знанията на световни експерти
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Задълбочен анализ',
                  description: 'Детайлни поредици за тактики, техники и философии'
                },
                {
                  icon: '📈',
                  title: 'Структуриране',
                  description: 'Логично организирано съдържание от основи до експертно ниво'
                },
                {
                  icon: '🌟',
                  title: 'Експертни знания',
                  description: 'Директно от най-успешните треньори и играчи в света'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3 + index * 0.2 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}