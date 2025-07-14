import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/ui/ArticleCard'
import { Button } from '@/components/ui/Button'
import { Article } from '@/types'
import { LockIcon, StarIcon, UsersIcon, VideoIcon, BookOpenIcon } from 'lucide-react'

// Примерни премиум статии за Coach Zone
const coachArticles: Article[] = [
  {
    id: '1',
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
    id: '2',
    title: 'Тактически схеми за младежки отбори',
    slug: 'taktichni-shemi-za-mladezhki-otbori',
    excerpt: 'Адаптиране на тактиките за различните възрастови групи',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Николай Петров', avatar: '/avatars/nikolay.jpg' },
    category: 'coach',
    tags: ['тактика', 'младежи', 'схеми'],
    publishedAt: new Date('2024-01-11'),
    readTime: 12,
    isPremium: true,
  },
  {
    id: '3',
    title: 'Тренировъчни програми за сезона',
    slug: 'trenirovachni-programi-za-sezona',
    excerpt: 'Планиране на тренировките през различните периоди на сезона',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1579952363873-27d3bade8f55?w=800&h=450&fit=crop',
    author: { name: 'Иван Петров', avatar: '/avatars/ivan.jpg' },
    category: 'coach',
    tags: ['тренировки', 'планиране', 'сезон'],
    publishedAt: new Date('2024-01-10'),
    readTime: 15,
    isPremium: true,
  },
]

const features = [
  {
    icon: BookOpenIcon,
    title: 'Експертни статии',
    description: 'Специализирано съдържание от опитни треньори и експерти',
  },
  {
    icon: VideoIcon,
    title: 'Видео уроци',
    description: 'Детайлни видео уроци за техники, тактики и тренировки',
  },
  {
    icon: UsersIcon,
    title: 'Общност',
    description: 'Създайте връзки с други треньори и споделете опит',
  },
  {
    icon: StarIcon,
    title: 'Премиум съдържание',
    description: 'Ексклузивни материали, недостъпни за безплатните потребители',
  },
]

const pricingPlans = [
  {
    name: 'Месечен',
    price: '29',
    period: 'месец',
    features: [
      'Достъп до всички Coach Zone статии',
      'Видео уроци и тренировки',
      'Експертни консултации',
      'Общност с други треньори',
    ],
    popular: false,
  },
  {
    name: 'Годишен',
    price: '299',
    period: 'година',
    features: [
      'Всичко от месечния план',
      '2 месеца безплатно',
      'Приоритетна поддръжка',
      'Ексклузивни уебинари',
    ],
    popular: true,
  },
]

export default function CoachZonePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center mb-4">
              <LockIcon className="w-8 h-8 mr-2" />
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Coach Zone
              </h1>
            </div>
            <p className="mt-4 text-lg leading-8 text-green-100">
              Премиум съдържание за треньори: тактики, психология, тренировъчни програми
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                Абонирай се сега
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-700">
                Научи повече
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Защо Coach Zone?
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Специализирано съдържание, създадено от експерти за експерти
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Избери своя план
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Гъвкави опции за всеки треньор
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
                  plan.popular ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Най-популярен
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-lg text-gray-600"> лв/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600">
                        <StarIcon className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg">
                    Избери план
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Примерно съдържание
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Виж какво ще намериш в Coach Zone
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {coachArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Абонирай се за достъп
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 