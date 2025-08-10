'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './Button'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

const slides = [
  {
    id: 1,
    title: 'WINNING',
    subtitle: 'AT THE',
    highlight: 'TIME',
    description: 'Подобри своите футболни умения с нашите експертни тренировки и съвети',
    image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZvb3RiYWxsfGVufDB8fHx8MTY4NDg3NjQ3Mg&ixlib=rb-1.2.1&q=80&w=1080',
    ctaText: 'ЗАПОЧНИ СЕГА'
  },
  {
    id: 2,
    title: 'MASTER',
    subtitle: 'THE',
    highlight: 'GAME',
    description: 'Научи тактики и техники от професионални треньори',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&h=1080&fit=crop&crop=center',
    ctaText: 'ЗАПОЧНИ ТРЕНИРОВКА'
  },
  {
    id: 3,
    title: 'ACHIEVE',
    subtitle: 'YOUR',
    highlight: 'DREAMS',
    description: 'Присъединете се към общност от футболни ентусиасти',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&crop=center',
    ctaText: 'ВЛЕЗ В ОБЩНОСТТА'
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000) // Increased interval for better performance

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt="Hero background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="text-white space-y-6">
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none drop-shadow-xl">
                  <span className="block drop-shadow-xl">{currentSlideData.title}</span>
                  <span className="block drop-shadow-xl">{currentSlideData.subtitle}</span>
                  <span className="block text-green-300 drop-shadow-xl">{currentSlideData.highlight}</span>
                </h1>
              </div>
              
              <p className="text-xl text-white leading-relaxed max-w-md font-semibold drop-shadow-lg">
                {currentSlideData.description}
              </p>

              <div className="flex items-center gap-4 pt-4">
                <Link href="/auth/register">
                  <Button 
                    size="lg" 
                    className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-4 text-lg"
                  >
                    {currentSlideData.ctaText}
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <button className="flex items-center gap-3 text-white hover:text-green-400 transition-colors group">
                  <div className="w-12 h-12 rounded-full border-2 border-white group-hover:border-green-400 flex items-center justify-center">
                    <PlayIcon className="h-5 w-5 ml-1" />
                  </div>
                  <span className="font-bold drop-shadow-md">Гледай видео</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-6 lg:left-8 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-green-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-20"
      >
        <ArrowRightIcon className="h-6 w-6 rotate-180" />
      </button>
      
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-20"
      >
        <ArrowRightIcon className="h-6 w-6" />
      </button>
    </div>
  )
} 