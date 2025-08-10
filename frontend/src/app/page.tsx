import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/ui/HeroSlider'
import ZoneCard from '@/components/zones/ZoneCard'
import ArticleCard from '@/components/ui/ArticleCard'
import { Button } from '@/components/ui/Button'
import { Article } from '@/types'
import { Zone } from '@/types'
import { ArrowRightIcon, BookOpenIcon, UsersIcon, StarIcon, TrophyIcon, GraduationCapIcon, ShieldCheckIcon } from 'lucide-react'


// Примерни данни за зоните
const zones: Zone[] = [
  {
    id: 'read',
    name: 'Read Zone',
    description: 'Безплатни статии, новини и видео уроци за всички футболни ентусиасти',
    icon: '📖',
    color: 'bg-blue-500',
    isPremium: false,
    articleCount: 45,
    videoCount: 23,
  },
  {
    id: 'coach',
    name: 'Coach Zone',
    description: 'Премиум съдържание за треньори: тактики, психология, тренировъчни програми',
    icon: '⚽',
    color: 'bg-green-500',
    isPremium: true,
    articleCount: 78,
    videoCount: 156,
  },
  {
    id: 'player',
    name: 'Player Zone',
    description: 'Специализирано съдържание за играчи: техники, кондиция, умения',
    icon: '🏃',
    color: 'bg-purple-500',
    isPremium: true,
    articleCount: 92,
    videoCount: 203,
  },
]

// Import articles from centralized data
import { allArticles } from '@/data/articles'

// Featured articles - select first 3 articles for showcase
const featuredArticles: Article[] = allArticles.slice(0, 3)

const stats = [
  { 
    name: 'Активни потребители', 
    value: '2,500+',
    icon: UsersIcon,
    color: 'text-blue-600'
  },
  { 
    name: 'Статии и видео уроци', 
    value: '500+',
    icon: BookOpenIcon,
    color: 'text-green-600'
  },
  { 
    name: 'Експертни треньори', 
    value: '25+',
    icon: GraduationCapIcon,
    color: 'text-purple-600'
  },
  { 
    name: 'Доволни клиенти', 
    value: '98%',
    icon: TrophyIcon,
    color: 'text-orange-600'
  },
]

const features = [
  {
    title: 'Експертно съдържание',
    description: 'Научете от най-добрите треньори и експерти в България',
    icon: StarIcon,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  },
  {
    title: 'Персонализирано обучение',
    description: 'Съдържание адаптирано към вашата роля и ниво',
    icon: GraduationCapIcon,
    color: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  {
    title: 'Общност',
    description: 'Свързвайте се с други футболни ентусиасти',
    icon: UsersIcon,
    color: 'bg-gradient-to-r from-green-400 to-blue-500'
  },
  {
    title: 'Сигурност',
    description: 'Проверени методи за безопасна тренировка',
    icon: ShieldCheckIcon,
    color: 'bg-gradient-to-r from-red-400 to-pink-500'
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <HeroSlider />

      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-bold drop-shadow-md">LIVE ПЛАТФОРМА</span>
            </div>
            <h2 className="text-4xl font-black text-white sm:text-6xl lg:text-7xl mb-6 drop-shadow-xl">
              Вдъхновяваме
              <span className="block bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-xl">
                футболни легенди
              </span>
            </h2>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg">
              Присъединете се към най-иновативната футболна образователна платформа в България. 
              Учете от експерти, развивайте уменията си и станете част от елитната общност.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div 
                  key={stat.name} 
                  className={`group bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-4 hover:scale-105 animate-fade-in-up relative overflow-hidden`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <IconComponent className={`h-8 w-8 text-white group-hover:scale-110 transition-transform duration-500`} />
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-white mb-3 group-hover:text-green-300 transition-colors duration-500 drop-shadow-xl">
                        {stat.value}
                      </div>
                      <div className="text-white font-bold text-sm uppercase tracking-wider drop-shadow-lg">
                        {stat.name}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 rounded-2xl border-0">
                  Започни безплатно
                  <ArrowRightIcon className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/read">
                <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-bold px-10 py-4 text-lg backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105">
                  Разгледай съдържанието
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles Preview Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-blue-100/30 to-purple-100/30"></div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-sm font-bold">ПОПУЛЯРНИ СТАТИИ</span>
            </div>
            <h2 className="text-4xl font-black text-gray-800 sm:text-5xl mb-6">
              Научете от 
              <span className="block bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                най-добрите експерти
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-900 max-w-3xl mx-auto leading-relaxed font-semibold">
              Открийте професионални тактики, техники и стратегии от световни треньори и играчи. 
              Всяка статия е написана от сертифицирани експерти с многогодишен опит.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 hover:scale-105 animate-fade-in-up flex flex-col h-full relative"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  backgroundImage: `url('${index === 0 ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' : index === 1 ? 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' : 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=300&fit=crop'}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/70 rounded-3xl"></div>
                
                <div className="p-8 flex flex-col h-full relative z-10">
                  {/* Article badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      ЕКСПЕРТНА СТАТИЯ
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-4 group-hover:text-green-300 transition-colors duration-300 leading-tight drop-shadow-xl">
                    {article.title.length > 60 ? `${article.title.slice(0, 60)}...` : article.title}
                  </h3>
                  
                  <p className="text-white leading-relaxed mb-6 text-base font-bold flex-grow drop-shadow-lg">
                    {article.excerpt.length > 120 ? `${article.excerpt.slice(0, 120)}...` : article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/40 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">FZ</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-bold text-white drop-shadow-lg">Football Zone</div>
                        <div className="text-white font-semibold drop-shadow-lg">Експертен екип</div>
                      </div>
                    </div>
                                          <div className="flex items-center text-green-400 font-bold group-hover:translate-x-2 transition-transform duration-300 drop-shadow-lg">
                      Чети повече
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call-to-action */}
          <div className="text-center">
            <Link href="/read">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-10 py-4 text-lg shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 rounded-2xl">
                Виж всички статии
                <ArrowRightIcon className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-8 py-4 mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-bold tracking-wider drop-shadow-md">ПРЕДИМСТВА</span>
            </div>
            <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-8 drop-shadow-xl">
              Защо да изберете
              <span className="block bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-xl">
                Football Zone?
              </span>
            </h2>
            <p className="mt-8 text-2xl text-white max-w-4xl mx-auto font-semibold leading-relaxed drop-shadow-lg">
              Предлагаме най-доброто футболно образование за играчи и треньори в България
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={feature.title} 
                  className={`group bg-black/40 backdrop-blur-xl rounded-3xl p-12 border border-white/20 hover:border-white/40 transition-all duration-700 hover:-translate-y-6 hover:scale-105 animate-fade-in-up relative overflow-hidden`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${feature.color} text-white mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl group-hover:shadow-green-500/25`}>
                      <IconComponent className="h-12 w-12" />
                    </div>
                    
                    <h3 className="text-3xl font-black text-white mb-6 group-hover:text-green-300 transition-colors duration-500 drop-shadow-xl">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white leading-relaxed text-xl font-semibold drop-shadow-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Zones Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-bold drop-shadow-md">СПЕЦИАЛИЗИРАНИ ЗОНИ</span>
            </div>
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-6 drop-shadow-xl">
              Избери своята
              <span className="block bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-xl">
                област за развитие
              </span>
            </h2>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg">
              Всяка зона е създадена специално за различните нужди - от базови знания до напреднали професионални техники
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone, index) => (
              <div
                key={zone.id}
                className="group bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-4 hover:scale-105 animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{zone.icon}</div>
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-green-300 transition-colors duration-300">
                        {zone.name}
                      </h3>
                      {zone.isPremium && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                          ПРЕМИУМ
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-white mb-6 leading-relaxed font-semibold drop-shadow-lg">
                    {zone.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span className="text-white/90 font-medium drop-shadow-md">
                        📚 {zone.articleCount} статии
                      </span>
                      <span className="text-white/90 font-medium drop-shadow-md">
                        🎥 {zone.videoCount} видео
                      </span>
                    </div>
                    <div className="flex items-center text-green-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Влез
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 mb-8">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-green-100 text-sm font-bold tracking-wider">ПРИСЪЕДИНИ СЕ ДНЕС</span>
            </div>
            
            <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-8">
              Готови ли сте да станете
              <span className="block bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent">
                футболни експерти?
              </span>
            </h2>
            
            <p className="mx-auto mt-8 max-w-4xl text-2xl leading-9 text-slate-200 font-medium">
              Над <strong className="text-white">2,500 потребители</strong> вече се развиват с нас. 
              Достъпете <strong className="text-white">500+ статии и видео уроци</strong> от сертифицирани треньори и експерти.
              <span className="block mt-4 text-green-200">
                Започнете безплатно още днес! 🚀
              </span>
            </p>
            
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="group">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-black px-12 py-5 text-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-110 rounded-2xl group-hover:animate-pulse">
                    🎯 Започни безплатно
                    <ArrowRightIcon className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <p className="text-green-200 text-sm mt-3 font-semibold">
                  ✅ Безплатен достъп до Read Zone
                </p>
              </div>
              
              <div className="group">
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="border-3 border-white/50 text-white hover:bg-white/10 hover:border-white font-black px-12 py-5 text-xl backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105">
                    🏆 Премиум достъп
                  </Button>
                </Link>
                <p className="text-blue-200 text-sm mt-3 font-semibold">
                  ⭐ Всички зони + експерти съдържание
                </p>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-semibold">Безплатно започване</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-semibold">Експертно съдържание</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-semibold">24/7 достъп</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
