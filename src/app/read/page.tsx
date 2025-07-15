import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'
import BlogSidebar from '@/components/ui/BlogSidebar'
import { Article } from '@/types'

// Примерни статии за Read Zone
const readArticles: Article[] = [
  {
    id: '1',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'read',
    tags: ['Video', 'Audio', 'Website'],
    publishedAt: new Date('2024-11-25'),
    readTime: 5,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business-2',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'read',
    tags: ['Video', 'Audio', 'Website'],
    publishedAt: new Date('2024-11-25'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business-3',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'read',
    tags: ['Video', 'Audio', 'Website'],
    publishedAt: new Date('2024-11-25'),
    readTime: 6,
    isPremium: false,
  },
  {
    id: '4',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business-4',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'read',
    tags: ['Video', 'Audio', 'Website'],
    publishedAt: new Date('2024-11-25'),
    readTime: 9,
    isPremium: false,
  },
  {
    id: '5',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business-5',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'read',
    tags: ['Video', 'Audio', 'Website'],
    publishedAt: new Date('2024-11-25'),
    readTime: 7,
    isPremium: false,
  },
  {
    id: '6',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business-6',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'read',
    tags: ['Video', 'Audio', 'Website'],
    publishedAt: new Date('2024-11-25'),
    readTime: 4,
    isPremium: false,
  },
]

export default function ReadZonePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-black text-white pt-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1920&h=400&fit=crop&crop=center"
            alt="Blog Header"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">BLOG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
              Football Zone Blog
            </h1>
            <nav className="flex items-center justify-center space-x-2 text-sm">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <span className="text-gray-500">/</span>
              <span className="text-white">Football Zone Blog</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
              <BlogSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {readArticles.map((article, index) => (
                  <BlogCard 
                    key={article.id} 
                    article={article}
                    showVideo={index === 1 || index === 3}
                    showPhoto={index === 0 || index === 4}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  «
                </button>
                
                <button className="px-4 py-2 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition-colors">
                  1
                </button>
                
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  2
                </button>
                
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  3
                </button>
                
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  4
                </button>
                
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  5
                </button>
                
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 