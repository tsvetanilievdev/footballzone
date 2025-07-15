import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/ui/HeroSlider'
import ZoneCard from '@/components/zones/ZoneCard'
import ArticleCard from '@/components/ui/ArticleCard'
import { Button } from '@/components/ui/Button'
import { Zone, Article } from '@/types'
import { ArrowRightIcon, PlayIcon, BookOpenIcon, UsersIcon, HeartIcon } from 'lucide-react'

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
  {
    id: 'parent',
    name: 'Parent Zone',
    description: 'Ръководство за родители: безопасност, хранене, ментална подкрепа',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-orange-500',
    isPremium: true,
    articleCount: 34,
    videoCount: 67,
  },
]

// Примерни статии
const featuredArticles: Article[] = [
  {
    id: '1',
    title: 'Как да подобрим паса в играта',
    slug: 'kak-da-podobrim-pasa-v-igrata',
    excerpt: 'Основни техники за подобряване на предаването на топката в различни игрови ситуации',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Иван Петров', avatar: '/avatars/ivan.jpg' },
    category: 'read',
    tags: ['техники', 'пас', 'основи'],
    publishedAt: new Date('2024-01-15'),
    readTime: 5,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Психологията на успешния треньор',
    slug: 'psihologiyata-na-uspeshniya-trenyor',
    excerpt: 'Как да изградим доверие с играчите и да постигнем максимални резултати',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Мария Георгиева', avatar: '/avatars/maria.jpg' },
    category: 'coach',
    tags: ['психология', 'треньорство', 'лидерство'],
    publishedAt: new Date('2024-01-12'),
    readTime: 8,
    isPremium: true,
  },
  {
    id: '3',
    title: 'Правилно хранене за млади футболисти',
    slug: 'pravilno-hranene-za-mladi-futbolisti',
    excerpt: 'Основни принципи на храненето за оптимално представяне на терена',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
    author: { name: 'Д-р Стефан Димитров', avatar: '/avatars/stefan.jpg' },
    category: 'parent',
    tags: ['хранене', 'здравье', 'спорт'],
    publishedAt: new Date('2024-01-10'),
    readTime: 6,
    isPremium: true,
  },
]

const stats = [
  { name: 'Активни потребители', value: '2,500+' },
  { name: 'Статии и видео уроци', value: '500+' },
  { name: 'Експертни треньори', value: '25+' },
  { name: 'Доволни клиенти', value: '98%' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Zones Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Избери своята зона
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Специализирано съдържание за различните групи потребители
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {zones.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Последни статии
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Най-новите статии от нашите експерти
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Виж всички статии
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Готови ли сте да подобрите своите умения?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-green-100">
              Присъединете се към нашата общност от футболни ентусиасти и достъпете 
              премиум съдържание от експерти.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                  Абонирай се сега
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-700">
                  Влез в профила
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
