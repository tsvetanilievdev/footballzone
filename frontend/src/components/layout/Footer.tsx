import Link from 'next/link'
import { FacebookIcon, InstagramIcon, YoutubeIcon, MailIcon } from 'lucide-react'

const navigation = {
  main: [
    { name: 'За нас', href: '/about' },
    { name: 'Контакти', href: '/contact' },
    { name: 'Политика за поверителност', href: '/privacy' },
    { name: 'Условия за ползване', href: '/terms' },
  ],
  zones: [
    { name: 'Read Zone', href: '/read' },
    { name: 'Coach Zone', href: '/coach' },
    { name: 'Player Zone', href: '/player' },
    { name: 'Parent Zone', href: '/parent' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: FacebookIcon,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: InstagramIcon,
    },
    {
      name: 'YouTube',
      href: '#',
      icon: YoutubeIcon,
    },
    {
      name: 'Email',
      href: 'mailto:info@footballzone.bg',
      icon: MailIcon,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <Link key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          ))}
        </div>
        
        <div className="mt-10 border-t border-gray-800 pt-8">
          <div className="text-center">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 FootballZone.bg. Всички права запазени.
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-400">
              Образователна футболна платформа за играчи, треньори и родители.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 