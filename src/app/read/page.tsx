import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/ui/ArticleCard'
import { Button } from '@/components/ui/Button'
import { Article } from '@/types'
import { FilterIcon, SearchIcon } from 'lucide-react'

// Примерни статии за Read Zone
const readArticles: Article[] = [
  {
    id: '1',
    title: 'Как да подобрим паса в играта',
    slug: 'kak-da-podobrim-pasa-v-igrata',
    excerpt: 'Основни техники за подобряване на предаването на топката в различни игрови ситуации',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1579952363873-27d3bade8f55?w=800&h=450&fit=crop',
    author: { name: 'Иван Петров', avatar: '/avatars/ivan.jpg' },
    category: 'read',
    tags: ['техники', 'пас', 'основи'],
    publishedAt: new Date('2024-01-15'),
    readTime: 5,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Основни правила на футбола',
    slug: 'osnovni-pravila-na-futbola',
    excerpt: 'Преглед на основните правила, които всеки футболист трябва да знае',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=450&fit=crop',
    author: { name: 'Петър Стоянов', avatar: '/avatars/petar.jpg' },
    category: 'read',
    tags: ['правила', 'основи', 'футбол'],
    publishedAt: new Date('2024-01-14'),
    readTime: 4,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Историята на българския футбол',
    slug: 'istoriyata-na-balgarskiya-futbol',
    excerpt: 'От първите мачове до днешните дни - пътешествие през времето',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Мария Георгиева', avatar: '/avatars/maria.jpg' },
    category: 'read',
    tags: ['история', 'България', 'футбол'],
    publishedAt: new Date('2024-01-13'),
    readTime: 7,
    isPremium: false,
  },
  {
    id: '4',
    title: 'Подготовка за мач - какво да правим',
    slug: 'podgotovka-za-mach-kakvo-da-pravim',
    excerpt: 'Съвети за правилната подготовка преди важни мачове',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Стефан Димитров', avatar: '/avatars/stefan.jpg' },
    category: 'read',
    tags: ['подготовка', 'мач', 'психология'],
    publishedAt: new Date('2024-01-12'),
    readTime: 6,
    isPremium: false,
  },
  {
    id: '5',
    title: 'Физическата подготовка в модерния футбол',
    slug: 'fizicheskata-podgotovka-v-moderniya-futbol',
    excerpt: 'Как се е променила физическата подготовка през годините',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Александър Иванов', avatar: '/avatars/aleksandar.jpg' },
    category: 'read',
    tags: ['физика', 'подготовка', 'модерен футбол'],
    publishedAt: new Date('2024-01-11'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '6',
    title: 'Тактически схеми в съвременния футбол',
    slug: 'taktichni-shemi-v-savremenniya-futbol',
    excerpt: 'Анализ на най-популярните тактически схеми днес',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Николай Петров', avatar: '/avatars/nikolay.jpg' },
    category: 'read',
    tags: ['тактика', 'схеми', 'анализ'],
    publishedAt: new Date('2024-01-10'),
    readTime: 9,
    isPremium: false,
  },
]

const categories = [
  { id: 'all', name: 'Всички', count: 45 },
  { id: 'techniques', name: 'Техники', count: 12 },
  { id: 'tactics', name: 'Тактики', count: 8 },
  { id: 'history', name: 'История', count: 5 },
  { id: 'psychology', name: 'Психология', count: 7 },
  { id: 'fitness', name: 'Физика', count: 13 },
]

export default function ReadZonePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Read Zone
            </h1>
            <p className="mt-4 text-lg leading-8 text-blue-100">
              Безплатни статии, новини и видео уроци за всички футболни ентусиасти
            </p>
            <div className="mt-8 flex items-center justify-center">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Търси статии..."
                  className="w-full rounded-lg border-0 bg-white/10 px-10 py-3 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Категории</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="flex items-center justify-between w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Филтри</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Само последните</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">С видео</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Всички статии</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    Филтри
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {readArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Предишна
                  </Button>
                  <Button size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">
                    Следваща
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 