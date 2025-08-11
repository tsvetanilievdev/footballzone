'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'

import SearchAndCategories from '@/components/ui/SearchAndCategories'
import ReadZoneSidebar from '@/components/ui/ReadZoneSidebar'
import { Article } from '@/types'
import Link from 'next/link'
import NextImage from 'next/image'
import { BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getReadZoneArticles } from '@/data/articles'
import AdminEditButton from '@/components/admin/AdminEditButton'


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
      <main id="main" role="main">
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


      {/* Search and Categories */}
      <SearchAndCategories 
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {/* Main Content - With sidebar */}
      <section className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <BlogCard 
                      key={article.id} 
                      article={article}
                      showVideo={index % 4 === 1}
                      showPhoto={index % 5 === 0}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-black text-lg">Няма намерени статии, които да отговарят на критериите.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button className="px-2 py-1 text-green-700 hover:text-green-900 transition-colors">
                  «
                </button>
                
                <button className="px-3 py-1 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition-colors">
                  1
                </button>
                
                <button className="px-3 py-1 text-green-700 hover:text-green-900 border border-green-200 rounded hover:bg-green-50 transition-colors">
                  2
                </button>
                
                <button className="px-3 py-1 text-green-700 hover:text-green-900 border border-green-200 rounded hover:bg-green-50 transition-colors">
                  3
                </button>
                
                <button className="px-3 py-1 text-green-700 hover:text-green-900 border border-green-200 rounded hover:bg-green-50 transition-colors">
                  4
                </button>
                
                <button className="px-3 py-1 text-green-700 hover:text-green-900 border border-green-200 rounded hover:bg-green-50 transition-colors">
                  5
                </button>
                
                <button className="px-2 py-1 text-green-700 hover:text-green-900 transition-colors">
                  »
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <ReadZoneSidebar 
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  )
} 