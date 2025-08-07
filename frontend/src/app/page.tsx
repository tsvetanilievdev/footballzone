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

// Use centralized articles instead
// import { allArticles } from '@/data/articles'

// Featured articles - temporary empty until articles data is migrated
const featuredArticles: Article[] = []

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

      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent sm:text-4xl">
              Доверени от хиляди потребители
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Присъединете се към най-голямата футболна общност в България
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div 
                  key={stat.name} 
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 hover:scale-105 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-xl hover:rotate-180 transition-transform duration-600">
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.name}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent sm:text-4xl">
              Защо да изберете Football Zone?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Предлагаме най-доброто футболно образование за играчи и треньори
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={feature.title} 
                  className={`text-center group animate-fade-in-up hover:-translate-y-2 transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} text-white mb-6 group-hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent sm:text-4xl">
              Избери своята зона
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Специализирано съдържание за различните групи потребители
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone, index) => (
              <div
                key={zone.id}
                className="animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ZoneCard zone={zone} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent sm:text-4xl">
              Последни статии
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Най-новите статии от нашите експерти
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/read">
              <Button variant="outline" size="lg" className="border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300">
                Виж всички статии
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-blue-600"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Готови ли сте да подобрите своите умения?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-green-100">
              Присъединете се към нашата общност от футболни ентусиасти и достъпете 
              премиум съдържание от експерти.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-lg">
                    Абонирай се сега
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="hover:scale-105 active:scale-95 transition-transform duration-200">
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-green-700 font-bold px-8 py-4 text-lg">
                    Влез в профила
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
