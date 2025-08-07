'use client'

import { LockClosedIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/outline'

export default function CoachHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white pt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
      </div>
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
        <img
          src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&h=600&fit=crop&crop=center"
          alt="Coach Zone Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-4">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="flex items-center space-x-2">
                                     <LockClosedIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold uppercase tracking-wider">ПРЕМИУМ ЗОНА</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block">Coach</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Zone
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-xl">
              Превърнете се в треньор от световна класа с нашите експертни материали, тактически анализи и иновативни методики
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">500+</div>
                <div className="text-sm text-blue-200 uppercase tracking-wide">Статии</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">50+</div>
                <div className="text-sm text-blue-200 uppercase tracking-wide">Видео уроци</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">2000+</div>
                <div className="text-sm text-blue-200 uppercase tracking-wide">Треньори</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Започни сега - 7 дни безплатно
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300">
                Научи повече
              </button>
            </div>
          </div>
          
          {/* Right Content - Features */}
          <div className="lg:pl-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <StarIcon className="w-6 h-6 text-yellow-400 mr-3" />
                Какво включва?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-white">Тактически анализи</div>
                    <div className="text-blue-200 text-sm">Подробни схеми и стратегии от топ треньори</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-white">Тренировъчни програми</div>
                    <div className="text-blue-200 text-sm">Готови програми за различни възрасти и нива</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-white">Психологически подходи</div>
                    <div className="text-blue-200 text-sm">Мотивация и ментална подготовка на играчите</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-white">Видео демонстрации</div>
                    <div className="text-blue-200 text-sm">Практически примери и упражнения на видео</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-white">Общност на треньори</div>
                    <div className="text-blue-200 text-sm">Споделяне на опит и дискусии с колеги</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-sm text-blue-200 mb-2">Специална оферта</div>
                <div className="text-2xl font-bold text-yellow-400">
                  29 лв/месец
                  <span className="text-base text-blue-200 line-through ml-2">59 лв</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
    </section>
  )
} 