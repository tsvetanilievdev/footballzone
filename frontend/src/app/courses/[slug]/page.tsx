'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCourseBySlug } from '@/data/courses'
import { 
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  PlayIcon,
  CheckIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  CurrencyEuroIcon,
  GlobeAltIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import NextImage from 'next/image'

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const course = getCourseBySlug(slug)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview')

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Курсът не е намерен</h1>
            <p className="text-gray-600 mb-8">Търсеният курс не съществува или е премахнат.</p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Назад към курсовете
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          <StarSolidIcon className="absolute inset-0 w-5 h-5 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={fullStars + i + 1} className="w-5 h-5 text-gray-300" />
      )
    }

    return stars
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Начинаещи'
      case 'intermediate':
        return 'Средно ниво'
      case 'advanced':
        return 'Напреднали'
      default:
        return 'Всички нива'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16">
        {/* Back Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/courses"
              className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Назад към курсовете
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Course Info */}
              <div className="lg:col-span-2">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.isBestseller && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                      БЕСТСЕЛЪР
                    </span>
                  )}
                  {course.isPopular && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      ПОПУЛЯРЕН
                    </span>
                  )}
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getLevelBadgeColor(course.level)}`}>
                    {getLevelText(course.level)}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    course.category === 'coach' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {course.category === 'coach' ? 'За треньори' : 'За играчи'}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-6">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center">
                    {renderStars(course.rating)}
                    <span className="ml-2 font-medium text-gray-900">{course.rating}</span>
                    <span className="ml-1 text-gray-600">({course.reviews} отзива)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="w-5 h-5 mr-1" />
                    <span>{course.studentsCount} студента</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-5 h-5 mr-1" />
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <VideoCameraIcon className="w-5 h-5 mr-1" />
                    <span>{course.lessonsCount} лекции</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center mb-8">
                  <NextImage
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Инструктор</p>
                    <p className="font-semibold text-gray-900">{course.instructor.name}</p>
                  </div>
                </div>
              </div>

              {/* Course Preview & Purchase */}
              <div className="lg:col-span-1">
                <div className="bg-white border rounded-2xl shadow-lg overflow-hidden sticky top-8">
                  {/* Video Preview */}
                  <div className="relative h-48">
                    <NextImage
                      src={course.featuredImage}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <PlayIcon className="w-8 h-8 text-gray-800 ml-1" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {course.price} {course.currency}
                      </div>
                      <p className="text-sm text-gray-500">Еднократна цена</p>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4">
                      Запишете се сега
                    </button>
                    
                    <p className="text-xs text-center text-gray-500 mb-6">
                      30-дневна гаранция за връщане на парите
                    </p>

                    {/* Course Includes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Този курс включва:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <VideoCameraIcon className="w-4 h-4 mr-3 text-green-500" />
                          {course.lessonsCount} видео лекции
                        </li>
                        <li className="flex items-center">
                          <DocumentTextIcon className="w-4 h-4 mr-3 text-green-500" />
                          Материали за изтегляне
                        </li>
                        <li className="flex items-center">
                          <GlobeAltIcon className="w-4 h-4 mr-3 text-green-500" />
                          Пълен достъп за цял живот
                        </li>
                        <li className="flex items-center">
                          <TrophyIcon className="w-4 h-4 mr-3 text-green-500" />
                          Сертификат за завършване
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex border-b">
              {[
                { id: 'overview', label: 'Преглед' },
                { id: 'curriculum', label: 'Учебна програма' },
                { id: 'instructor', label: 'Инструктор' },
                { id: 'reviews', label: 'Отзиви' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">За този курс</h3>
                    <div className="prose prose-lg max-w-none text-gray-600">
                      <p>{course.longDescription}</p>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                      Какво ще научите:
                    </h4>
                    <ul className="space-y-3">
                      {course.skills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      Изисквания:
                    </h4>
                    <ul className="space-y-2 mb-8">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      За кого е този курс:
                    </h4>
                    <ul className="space-y-2">
                      {course.targetAudience.map((audience, index) => (
                        <li key={index} className="flex items-start text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {audience}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Учебна програма</h3>
                  <div className="space-y-4">
                    {course.curriculum.map((lesson, index) => (
                      <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {lesson.type === 'video' && (
                              <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-500">{lesson.duration} мин</span>
                            {lesson.isPreview && (
                              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                                Преглед
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Вашият инструктор</h3>
                  <div className="flex items-start gap-6">
                    <NextImage
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {course.instructor.name}
                      </h4>
                      <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                      
                      <h5 className="font-semibold text-gray-900 mb-2">Квалификации:</h5>
                      <ul className="space-y-1">
                        {course.instructor.credentials.map((credential, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                            {credential}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Отзиви от студенти</h3>
                  <div className="text-center py-12">
                    <p className="text-gray-500">Отзивите ще бъдат добавени скоро...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}