export default function ParentsHero() {
  return (
    <section className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white bg-opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-white/15 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-white/20 rounded-full animate-ping delay-500"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Main Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium mb-8 border border-white/30">
            <span className="mr-2">👨‍👩‍👧‍👦</span>
            Зона за родители
            <span className="ml-2 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">ПРЕМИУМ</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Подкрепа за <br/>
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              футболните родители
            </span>
          </h1>

          {/* Hero Description */}
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Всичко, което един родител трябва да знае за подкрепа на детето си в спорта - 
            от безопасност и хранене до психологическа подкрепа и планиране на кариерата.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-white/80">Експертни съвета</div>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-3xl">🏥</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-pulse delay-300"></div>
              </div>
              <div className="text-3xl font-bold text-white">25+</div>
              <div className="text-white/80">Съвети за безопасност</div>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-3xl">🥗</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full animate-pulse delay-500"></div>
              </div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/80">Хранителни планове</div>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                  <span className="text-3xl">💝</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              </div>
              <div className="text-3xl font-bold text-white">30+</div>
              <div className="text-white/80">Психологически ресурса</div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Безопасност първо</h3>
              <p className="text-white/80 text-sm">Превенция на травми и първа помощ</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl mb-3">🧠</div>
              <h3 className="text-lg font-semibold text-white mb-2">Психологическа подкрепа</h3>
              <p className="text-white/80 text-sm">Мотивация и преодоляване на предизвикателства</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl mb-3">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">Образователен баланс</h3>
              <p className="text-white/80 text-sm">Съчетаване на спорт и учене</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Започнете днес
          </button>
        </div>
      </div>
    </section>
  )
} 