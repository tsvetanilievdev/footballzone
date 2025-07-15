'use client'

import { StarIcon, FireIcon, BoltIcon } from '@heroicons/react/24/outline'

export default function PlayersHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-green-800 to-emerald-900 text-white pt-16 overflow-hidden min-h-[80vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-green-400 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 right-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>
      
      {/* Football Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 text-8xl animate-spin-slow">⚽</div>
        <div className="absolute top-3/4 right-1/4 text-6xl animate-bounce">🥅</div>
        <div className="absolute top-1/2 left-1/2 text-4xl animate-pulse">🏃</div>
      </div>
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=800&fit=crop&crop=center"
          alt="Players Training Background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <div className="flex items-center space-x-2">
                    <BoltIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">ZONE ЗА ИГРАЧИ</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="block">Твоето</span>
              <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                Футболно
              </span>
              <span className="block text-yellow-400">Развитие</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              Превърни се в играча, който си мечтал да бъдеш! Персонализирани тренировки, експертни съвети и професионални техники в един интерактивен портал.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">⚽</div>
                <div className="text-sm font-semibold">Техника</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">💪</div>
                <div className="text-sm font-semibold">Фитнес</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-sm font-semibold">Тактика</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl mb-2">🧘</div>
                <div className="text-sm font-semibold">Ментално</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-10 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl animate-pulse">
                Започни безплатно сега
              </button>
              <button className="px-10 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105">
                Виж програмата
              </button>
            </div>
          </div>
          
          {/* Right Content - Interactive Stats */}
          <div className="lg:pl-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <FireIcon className="w-8 h-8 text-orange-400 mr-3 animate-bounce" />
                Развивай се всеки ден
              </h3>
              
              {/* Progress Rings */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">250+</span>
                    </div>
                  </div>
                  <div className="text-sm text-blue-200">Упражнения</div>
                </div>
                
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin delay-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">50+</span>
                    </div>
                  </div>
                  <div className="text-sm text-blue-200">Видео уроци</div>
                </div>
              </div>
              
              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-semibold text-white">Персонализирани тренировки</div>
                    <div className="text-blue-200 text-sm">Според твоето ниво и цели</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <div>
                    <div className="font-semibold text-white">Експертни анализи</div>
                    <div className="text-blue-200 text-sm">От професионални треньори</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                  <div>
                    <div className="font-semibold text-white">Следене на прогреса</div>
                    <div className="text-blue-200 text-sm">Виж как се развиваш всеки ден</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-700"></div>
                  <div>
                    <div className="font-semibold text-white">Общност на играчи</div>
                    <div className="text-blue-200 text-sm">Споделяй опит с хиляди играчи</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">7 дни безплатно</div>
                  <div className="text-sm text-blue-200">След това само 19 лв/месец</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 text-white" viewBox="0 0 1440 120" fill="currentColor">
          <path d="M0,120L48,112C96,104,192,88,288,80C384,72,480,72,576,76C672,80,768,88,864,92C960,96,1056,96,1152,88C1248,80,1344,64,1392,56L1440,48L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  )
} 