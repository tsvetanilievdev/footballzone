'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'
import SearchAndCategories from '@/components/ui/SearchAndCategories'
import ReadZoneSidebar from '@/components/ui/ReadZoneSidebar'
import { useArticlesByZone } from '@/hooks/api/useArticles'
import { useTestQuery } from '@/hooks/useTestQuery'
import { Article } from '@/types'
import { ArticleListSkeleton, InlineLoading } from '@/components/ui/LoadingSpinner'
import { NoArticlesFound } from '@/components/ui/EmptyState'
import { ApiErrorDisplay } from '@/components/ui/ErrorBoundary'
import Pagination from '@/components/ui/Pagination'
import NextImage from 'next/image'

export default function ReadZonePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Test React Query with simple hook
  const testQuery = useTestQuery()

  // Fetch articles from API
  const { 
    data: articlesResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useArticlesByZone('READ', {
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined
  })

  const articles = articlesResponse?.data || []
  const pagination = articlesResponse?.pagination || { page: 1, total: 0, pages: 1 }

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      <section className="py-6 lg:py-8 read-zone">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Loading State */}
              {isLoading && (
                <ArticleListSkeleton count={6} />
              )}

              {/* Error State */}
              {isError && (
                <ApiErrorDisplay 
                  error={error} 
                  onRetry={() => refetch()} 
                />
              )}

              {/* Articles Grid */}
              {!isLoading && !isError && (
                <>
                  {articles.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {articles.map((article, index) => (
                          <BlogCard 
                            key={article.id} 
                            article={article}
                            showVideo={index % 4 === 1}
                            showPhoto={index % 5 === 0}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {pagination.pages > 1 && (
                        <div className="flex flex-col items-center gap-4">
                          <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                            className="mb-4"
                          />
                          <p className="text-sm text-gray-600 text-center">
                            Показва статии {((pagination.page - 1) * itemsPerPage) + 1}-{Math.min(pagination.page * itemsPerPage, pagination.total)} от {pagination.total}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <NoArticlesFound />
                  )}
                </>
              )}
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