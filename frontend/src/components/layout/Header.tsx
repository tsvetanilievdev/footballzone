'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PlayCircleIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const getRoleDisplayName = (role: string) => {
  const roleNames: Record<string, string> = {
    'FREE': 'Безплатен',
    'PLAYER': 'Играч', 
    'COACH': 'Треньор',
    'PARENT': 'Родител',
    'ADMIN': 'Администратор'
  }
  return roleNames[role] || role
}

const navigation = [
  { 
    name: 'Начало', 
    href: '/',
    short: 'Начало',
    icon: BookOpenIcon,
    zone: 'home',
    gradient: 'from-zones-coach-from to-zones-coach-to'
  },
  { 
    name: 'Read Zone', 
    href: '/read',
    short: 'Read',
    icon: BookOpenIcon,
    zone: 'read',
    gradient: 'from-zones-read-from to-zones-read-to'
  },
  { 
    name: 'Coaches Zone', 
    href: '/coach',
    short: 'Coaches',
    icon: AcademicCapIcon,
    zone: 'coach',
    gradient: 'from-zones-coach-from to-zones-coach-to'
  },
  { 
    name: 'Players Zone', 
    href: '/players',
    short: 'Players',
    icon: UserGroupIcon,
    zone: 'player',
    gradient: 'from-zones-player-from to-zones-player-to'
  },
  { 
    name: 'Series Zone', 
    href: '/series',
    short: 'Series',
    icon: ClipboardDocumentListIcon,
    zone: 'series',
    gradient: 'from-zones-series-from to-zones-series-to'
  },
  { 
    name: 'Courses Zone', 
    href: '/courses',
    short: 'Courses',
    icon: PlayCircleIcon,
    zone: 'courses',
    gradient: 'from-zones-courses-from to-zones-courses-to'
  },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20) 
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAdmin = pathname.startsWith('/admin')

  // Close mobile menu when clicking outside or on overlay
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,border-color] duration-500 ease-out will-change-[background,box-shadow,border-color]',
        isScrolled 
          ? 'bg-gradient-to-r from-green-100/98 via-blue-100/98 to-purple-100/98 backdrop-blur-xl border-b border-green-300/50 shadow-lg shadow-green-500/20' 
          : 'bg-gradient-to-r from-green-100/95 via-blue-100/95 to-purple-100/95 backdrop-blur-md border-b border-transparent'
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group relative">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25 group-hover:shadow-2xl group-hover:shadow-green-500/40 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <span className="text-white font-black text-xl tracking-tight">FZ</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <div className="hidden sm:block relative">
                <span className="block text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-all duration-300 tracking-tight">
                  FOOTBALL
                </span>
                <span className="block text-sm font-bold text-emerald-600 -mt-1.5 tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">
                  ZONE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-4" aria-label="Главна навигация">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative"
                  >
                    <div className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-300 relative overflow-hidden',
                      isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-black/30 scale-105`
                        : 'text-gray-900 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-black/30'
                    )}>
                      {!isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{item.short}</span>
                      
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/50 rounded-full" />
                      )}
                    </div>
                  </Link>
                )
              })}
              
              {/* Admin link - only show for admin users */}
              {isAuthenticated && user && user.role === 'ADMIN' && (pathname === '/' || isAdmin) && (
                <Link
                  href="/admin"
                  className="group relative ml-4 pl-4 border-l border-gray-300"
                >
                  <div className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-300 relative overflow-hidden',
                    isAdmin 
                      ? 'bg-gradient-to-r from-zones-admin-from to-zones-admin-to text-white shadow-lg shadow-black/30 scale-105' 
                      : 'text-gray-900 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-black/30'
                  )}>
                    {!isAdmin && (
                      <div className="absolute inset-0 bg-gradient-to-r from-zones-admin-from to-zones-admin-to opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <UserIcon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Admin</span>
                  </div>
                </Link>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search button - desktop */}
              <button 
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 group"
                aria-label="Търсене"
              >
                <MagnifyingGlassIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </button>

              {/* Auth buttons - desktop */}
              <div className="hidden lg:flex lg:items-center lg:gap-3">
                {isAuthenticated && user ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button 
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
                    >
                      {/* Avatar placeholder */}
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</div>
                      </div>
                      <ChevronDownIcon className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        profileDropdownOpen ? "rotate-180" : ""
                      )} />
                    </button>

                    {/* Profile Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">{getRoleDisplayName(user.role)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Menu Items */}
                        <div className="py-2">
                          <Link 
                            href="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <UserIcon className="w-4 h-4" />
                            Моят профил
                          </Link>
                          
                          <Link 
                            href="/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Cog6ToothIcon className="w-4 h-4" />
                            Настройки
                          </Link>

                          {user.role === 'ADMIN' && (
                            <Link 
                              href="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <Cog6ToothIcon className="w-4 h-4" />
                              Админ панел
                            </Link>
                          )}

                          <div className="border-t border-gray-100 my-2"></div>
                          
                          <button 
                            onClick={() => {
                              logout()
                              setProfileDropdownOpen(false)
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            Изход
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/auth/login"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-gray-900 hover:text-gray-900 bg-white hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <UserIcon className="w-4 h-4" />
                      Вход
                    </Link>
                    <Link 
                      href="/auth/register"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 group"
              >
                <Bars3Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="sr-only">Отвори меню</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Background overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm transform bg-white shadow-2xl transition-all duration-500 ease-out lg:hidden">
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <Link 
                  href="/" 
                  className="flex items-center gap-3 group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-lg">FZ</span>
                  </div>
                  <div>
                    <span className="block font-black text-gray-900 text-lg group-hover:text-emerald-600 transition-colors duration-300">FOOTBALL</span>
                    <span className="block text-xs text-emerald-600 -mt-1 tracking-wider font-bold">ZONE</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 group shadow-md"
                  aria-label="Затвори меню"
                >
                  <XMarkIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>

              {/* Mobile search */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Търсене в Football Zone..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md transition-all duration-300 focus:shadow-lg"
                  />
                </div>
              </div>

              {/* Mobile navigation */}
              <div className="flex-1 overflow-y-auto py-6">
               <nav className="px-4 space-y-2" aria-label="Мобилна навигация">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block group"
                      >
                        <div className={cn(
                          'flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden',
                          isActive 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                            : 'text-gray-700 hover:text-white hover:shadow-lg'
                        )}>
                          {!isActive && (
                            <div className={cn(
                              'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                              item.gradient
                            )}></div>
                          )}
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-all duration-300',
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-gray-100 group-hover:bg-white/20'
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="relative z-10">
                            <span className="text-base">{item.name}</span>
                            <div className={cn(
                              'text-xs opacity-75 mt-0.5',
                              isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-white/80'
                            )}>
                              {item.name.includes('Zone') ? 'Зона за обучение' : 'Начална страница'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  
                  {/* Admin link - mobile - only show for admin users */}
                  {isAuthenticated && user && user.role === 'ADMIN' && (pathname === '/' || isAdmin) && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block group mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className={cn(
                        'flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden',
                        isAdmin 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:text-white hover:shadow-lg'
                      )}>
                        {!isAdmin && (
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center relative z-10',
                          isAdmin 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-white/20'
                        )}>
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="relative z-10">
                          <span className="text-base">Admin Panel</span>
                          <div className={cn(
                            'text-xs opacity-75 mt-0.5',
                            isAdmin ? 'text-white/80' : 'text-gray-500 group-hover:text-white/80'
                          )}>
                            Управление на съдържанието
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </nav>
              </div>

              {/* Mobile menu footer */}
              <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 space-y-3">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Добре дошли, {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Роля: {getRoleDisplayName(user.role)}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Изход
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/auth/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-2xl font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                    >
                      <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      Вход
                    </Link>
                    <Link 
                      href="/auth/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}