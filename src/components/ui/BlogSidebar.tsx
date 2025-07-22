'use client'

import { useState } from 'react'
import { 
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const popularPosts = [
  {
    id: 1,
    title: 'Как да подобрим паса в играта',
    date: '22 Nov 2024',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    title: 'Тактически схеми в съвременния футбол',
    date: '22 Nov 2024',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    title: 'Физическата подготовка в модерния футбол',
    date: '22 Nov 2024',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'
  },
  {
    id: 4,
    title: 'Подготовка за мач - какво да правим',
    date: '22 Nov 2024',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop'
  }
]

const instagramPosts = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop'
]

const tags = [
  'Business', 'News', 'Marketing', 'Design', 'Images', 'Youtube',
  'Video', 'Technology', 'Football', 'Training', 'Tactics', 'Fitness'
]

const tweets = [
  {
    id: 1,
    content: 'Новата ни статия за тактики в футбола вече е публикувана! Не пропускайте да я прочетете.',
    time: '1 day ago'
  },
  {
    id: 2,
    content: 'Подготвяме специален материал за младите футболисти. Следете ни за повече информация!',
    time: '2 days ago'
  }
]

export default function BlogSidebar() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset states
    setIsSubmitting(true)
    setSubscribeStatus('idle')
    setErrorMessage('')

    // Validate email
    if (!email) {
      setErrorMessage('Моля, въведете имейл адрес')
      setSubscribeStatus('error')
      setIsSubmitting(false)
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Моля, въведете валиден имейл адрес')
      setSubscribeStatus('error')
      setIsSubmitting(false)
      return
    }

    try {
      // TODO: Implement actual subscription logic here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubscribeStatus('success')
      setEmail('')
    } catch {
      setSubscribeStatus('error')
      setErrorMessage('Възникна грешка. Моля, опитайте отново.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Popular Posts - moved to top */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">POPULAR POSTS</h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div key={post.id} className="flex space-x-3">
              <img
                src={post.image}
                alt={post.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-xs text-green-600 mb-1">
                  <span>{post.date}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 leading-tight hover:text-green-600 cursor-pointer transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tag Cloud - moved to top */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">TAG CLOUD</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-green-100 hover:text-green-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Twitter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">TWITTER</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
            <div className="text-sm font-medium">@FootballZone</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="text-sm">
              <p className="text-gray-700 leading-relaxed mb-2">&ldquo;{tweet.content}&rdquo;</p>
              <div className="text-xs text-gray-500">{tweet.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">INSTAGRAM</h3>
        <div className="grid grid-cols-3 gap-2">
          {instagramPosts.map((image, index) => (
            <div key={index} className="aspect-square rounded overflow-hidden">
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">АБОНИРАЙ СЕ</h3>
        <p className="text-sm text-gray-600 mb-4">
          Абонирайте се за нашия бюлетин, за да получавате най-новите статии и актуализации
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              placeholder="Вашият имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`
                w-full px-4 py-2.5 border rounded-lg text-sm 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed
                ${subscribeStatus === 'error' ? 'border-red-300' : 'border-gray-300'}
                ${subscribeStatus === 'success' ? 'border-green-300' : ''}
              `}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {subscribeStatus === 'success' && (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              )}
              {subscribeStatus === 'error' && (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
          
          {/* Error message */}
          {subscribeStatus === 'error' && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          
          {/* Success message */}
          {subscribeStatus === 'success' && (
            <p className="text-sm text-green-600">
              Благодарим ви! Успешно се абонирахте за нашия бюлетин.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white
              transition-all duration-200
              ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              disabled:opacity-50
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </span>
            ) : (
              'Абонирай се'
            )}
          </button>
        </form>
      </div>

      {/* Moved to bottom: About Me, Follow Me, Banner */}
      {/* About Me */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">ABOUT ME</h3>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Football Zone Expert"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            Експерт по футбол с над 15 години опит в треньорството и анализа на играта. 
            Споделяме знания и страст към най-красивата игра в света.
          </p>
        </div>
      </div>

      {/* Follow Me */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">FOLLOW ME</h3>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.744-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
            <HeartIcon className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 mb-4 p-6 pb-0 uppercase tracking-wide">BANNER</h3>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
            alt="Football Training Banner"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="text-white p-4">
              <span className="text-sm font-semibold">FOOTBALL ZONE</span>
              <div className="text-xs opacity-75">270px/270px</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 