'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Course } from '@/types'
import { getAllCourses, getCoachesCourses, getPlayersCourses } from '@/data/courses'
import { 
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import NextImage from 'next/image'

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coach' | 'player'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getCourses = () => {
    let courses: Course[]
    
    switch (selectedCategory) {
      case 'coach':
        courses = getCoachesCourses()
        break
      case 'player':
        courses = getPlayersCourses()
        break
      default:
        courses = getAllCourses()
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      courses = courses.filter(course => course.level === selectedLevel || course.level === 'all')
    }

    // Filter by search term
    if (searchTerm) {
      courses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return courses
  }

  const courses = getCourses()

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <StarSolidIcon className="absolute inset-0 w-4 h-4 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={fullStars + i + 1} className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="mb-4">
              <AcademicCapIcon className="w-16 h-16 mx-auto text-green-200" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Football Zone Курсове
            </h1>
            <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto">
              Подобрете своите умения с професионални курсове от експерти във футбола
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Търсете курсове..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Всички курсове</option>
                <option value="coach">За треньори</option>
                <option value="player">За играчи</option>
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Всички нива</option>
                <option value="beginner">Начинаещи</option>
                <option value="intermediate">Средно ниво</option>
                <option value="advanced">Напреднали</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Намерени са {courses.length} курса{courses.length === 1 ? '' : courses.length > 1 && courses.length < 5 ? 'а' : 'а'}
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* Course Image */}
                  <div className="relative h-48">
                    <NextImage
                      src={course.featuredImage}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {course.isBestseller && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                          БЕСТСЕЛЪР
                        </span>
                      )}
                      {course.isPopular && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          ПОПУЛЯРЕН
                        </span>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        course.category === 'coach' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {course.category === 'coach' ? 'Треньори' : 'Играчи'}
                      </span>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center mb-3">
                      <NextImage
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {course.instructor.name}
                      </span>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        {course.studentsCount}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {renderStars(course.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {course.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({course.reviews} отзива)
                      </span>
                    </div>

                    {/* Skills Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Ще научите:</h4>
                      <ul className="space-y-1">
                        {course.skills.slice(0, 3).map((skill, index) => (
                          <li key={index} className="flex items-start text-xs text-gray-600">
                            <CheckIcon className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {skill}
                          </li>
                        ))}
                        {course.skills.length > 3 && (
                          <li className="text-xs text-gray-500">
                            + още {course.skills.length - 3} умения
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {course.price} {course.currency}
                        </span>
                      </div>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Детайли
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">Няма намерени курсове</p>
              <p className="text-gray-400">Опитайте да промените филтрите или търсенето</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}