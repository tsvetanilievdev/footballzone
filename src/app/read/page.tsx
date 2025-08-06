'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'
import BlogSidebar from '@/components/ui/BlogSidebar'
import SearchAndCategories from '@/components/ui/SearchAndCategories'
import { Article } from '@/types'
import Link from 'next/link'
import NextImage from 'next/image'
import { BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getReadZoneArticles } from '@/data/articles'


// Получаваме статиите от централизирания файл
const readArticles: Article[] = getReadZoneArticles()

export default function ReadZonePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = useMemo(() => {
    return readArticles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Reduced height */}
      <section className="relative bg-black text-white pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <NextImage
            src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1920&h=300&fit=crop&crop=center"
            alt="Blog Header"
            width={1920}
            height={300}
            className="w-full h-full object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="mb-2 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">BLOG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Football Zone Blog
            </h1>
          </div>
        </div>
      </section>

      {/* Series Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                📚 Тематични поредици
              </h2>
              <p className="text-gray-600">
                Дълбочинни анализи и експертни ръководства разделени в логически поредици
              </p>
            </div>
            <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
              <Link 
                href="/read/series"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors group"
              >
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Виж всички поредици
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Featured Series Preview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300" style={{ animationDelay: '100ms' }}>
              <Link 
                href="/read/series/antonio-conte-philosophy"
                className="group bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:border-green-300 transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                      Философията на Антонио Конте
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      5 статии за треньорската философия и методите
                    </p>
                  </div>
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    5 части
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  <span>Завършена поредица</span>
                </div>
              </Link>
            </div>
            
            {/* Placeholder for future series */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300" style={{ animationDelay: '200ms' }}>
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Скоро
                </h3>
                <p className="text-sm text-gray-500">
                  Нови поредици в подготовка
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300" style={{ animationDelay: '300ms' }}>
              <div className="text-center">
                <div className="text-3xl mb-2">⚽</div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Предложи тема
                </h3>
                <p className="text-sm text-gray-500">
                  Имаш идея за поредица?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <SearchAndCategories 
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {/* Main Content - Adjusted spacing */}
      <section className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Sidebar - Moved to left side */}
            <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
              <BlogSidebar />
            </div>

            {/* Main Content - Moved to right side */}
            <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <BlogCard 
                      key={article.id} 
                      article={article}
                      showVideo={index === 1 || index === 3}
                      showPhoto={index === 0 || index === 4}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">Няма намерени статии, които да отговарят на критериите.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors">
                  «
                </button>
                
                <button className="px-3 py-1 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition-colors">
                  1
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  2
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  3
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  4
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  5
                </button>
                
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors">
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 