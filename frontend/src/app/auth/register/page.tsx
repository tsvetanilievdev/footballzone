'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { RegisterRequest } from '@/types/auth'
import FormErrors from '@/components/ui/FormErrors'
import PasswordRequirements, { isPasswordValid } from '@/components/ui/PasswordRequirements'
import { ParsedValidationError } from '@/utils/errorUtils'

type UserRole = 'PLAYER' | 'COACH' | 'PARENT'

const roleOptions = [
  {
    id: 'PLAYER' as UserRole,
    name: 'Играч',
    description: 'Достъп до тренировки, техники и фитнес програми',
    icon: '🏃',
    color: 'purple'
  },
  {
    id: 'COACH' as UserRole,
    name: 'Треньор',
    description: 'Тактики, психология и треньорски материали',
    icon: '⚽',
    color: 'green'
  },
  {
    id: 'PARENT' as UserRole,
    name: 'Родител',
    description: 'Съвети за родители на млади спортисти',
    icon: '👨‍👩‍👧‍👦',
    color: 'orange'
  }
]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ParsedValidationError[]>([])
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  
  const { register, isLoading } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidationErrors([])
    
    if (!selectedRole) {
      setError('Моля, изберете роля')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Паролите не съвпадат')
      return
    }
    
    if (!agreeToTerms) {
      setError('Моля, приемете условията за ползване')
      return
    }

    try {
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        role: selectedRole,
        acceptTerms: agreeToTerms,
        subscribeNewsletter: subscribeNewsletter
      }
      
      await register(registerData)
      router.push('/') // Redirect to home page after successful registration
    } catch (err: any) {
      if (err.validationErrors && err.validationErrors.length > 0) {
        setValidationErrors(err.validationErrors)
      } else {
        setError(err.message || 'Възникна грешка при създаването на акаунта')
      }
    }
  }

  const handleSocialRegister = () => {
    // TODO: Implement social registration logic here
    // Handle social registration
  }

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'border-purple-200 bg-purple-50 hover:border-purple-300',
      green: 'border-green-200 bg-green-50 hover:border-green-300',
      orange: 'border-orange-200 bg-orange-50 hover:border-orange-300'
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  const getSelectedColorClasses = (color: string) => {
    const colors = {
      purple: 'border-purple-500 bg-purple-500 text-white',
      green: 'border-green-500 bg-green-500 text-white',
      orange: 'border-orange-500 bg-orange-500 text-white'
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl space-y-8">
            
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-white font-bold text-2xl">FZ</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Създайте профил
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Присъединете се към общността на Football Zone
              </p>
            </div>

            {/* Social Registration */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialRegister()}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Регистрация с Google
              </button>

              <button
                onClick={() => handleSocialRegister()}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Регистрация с Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">или</span>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">Изберете вашата роля</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roleOptions.map((role) => {
                  const isSelected = selectedRole === role.id
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${
                        isSelected 
                          ? getSelectedColorClasses(role.color) 
                          : getColorClasses(role.color) + ' border'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{role.icon}</span>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {role.name}
                          </h4>
                          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                            {role.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckIcon className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            {validationErrors.length > 0 && (
              <FormErrors 
                errors={validationErrors} 
                showFieldNames={true}
                groupByType={false}
              />
            )}

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Име
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Вашето име"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Фамилия
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Вашата фамилия"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Имейл адрес
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Парола
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setShowPasswordRequirements(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Минимум 8 символа"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Requirements */}
                <PasswordRequirements 
                  password={formData.password} 
                  show={showPasswordRequirements && formData.password.length > 0}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Потвърдете паролата
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Повторете паролата"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="agree-terms" className="ml-3 block text-sm text-gray-700 leading-5">
                    Съгласен/съгласна съм с{' '}
                    <Link href="/terms" className="text-green-600 hover:text-green-500 font-medium">
                      Условията за ползване
                    </Link>{' '}
                    и{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-500 font-medium">
                      Политиката за поверителност
                    </Link>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="subscribe-newsletter"
                    name="subscribe-newsletter"
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="subscribe-newsletter" className="ml-3 block text-sm text-gray-700">
                    Искам да получавам имейли с новини и съвети
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !selectedRole || !agreeToTerms || !isPasswordValid(formData.password)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Създаване на профил...
                  </div>
                ) : (
                  'Създайте профил'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Вече имате профил?{' '}
                <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                  Влезте тук
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 