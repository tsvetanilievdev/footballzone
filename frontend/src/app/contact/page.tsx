'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const contactMethods = [
  {
    icon: EnvelopeIcon,
    title: 'Имейл',
    description: 'Изпратете ни съобщение',
    contact: 'info@footballzone.bg',
    href: 'mailto:info@footballzone.bg'
  },
  {
    icon: PhoneIcon,
    title: 'Телефон',
    description: 'Обадете ни се директно',
    contact: '+359 2 123 4567',
    href: 'tel:+35921234567'
  },
  {
    icon: MapPinIcon,
    title: 'Адрес',
    description: 'Посетете ни в София',
    contact: 'бул. Витоша 123, София 1000',
    href: '#'
  },
  {
    icon: ClockIcon,
    title: 'Работно време',
    description: 'Понеделник - петък',
    contact: '09:00 - 18:00',
    href: '#'
  }
]

const faqs = [
  {
    question: 'Как мога да се регистрирам в платформата?',
    answer: 'Регистрацията е безплатна и лесна. Кликнете на бутона "Регистрация" в горния ред и попълнете необходимите данни.'
  },
  {
    question: 'Има ли платено съдържание?',
    answer: 'Голяма част от съдържанието е безплатно. Premium материалите изискват абонамент, но предлагаме и безплатен пробен период.'
  },
  {
    question: 'Подходяща ли е платформата за начинаещи треньори?',
    answer: 'Абсолютно! Имаме материали за всички нива - от начинаещи до опитни треньори с професионални лицензи.'
  },
  {
    question: 'Как мога да предложа собствено съдържание?',
    answer: 'Свържете се с нас чрез формата за контакт или на имейл. Винаги търсим качествени автори и експерти.'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Съобщението е изпратено успешно!')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-heading mb-6">
            Свържете се с <span className="text-primary">нас</span>
          </h1>
          <p className="text-xl text-text max-w-3xl mx-auto leading-relaxed">
            Имате въпрос, предложение или искате да станете част от екипа ни? 
            Ние сме тук да ви помогнем и чакаме вашето съобщение.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-heading mb-6">
              Начини за контакт
            </h2>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={index} variant="flat" className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-heading mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted mb-2">
                          {method.description}
                        </p>
                        {method.href !== '#' ? (
                          <Link 
                            href={method.href}
                            className="text-primary hover:text-primary-600 font-medium text-sm transition-colors"
                          >
                            {method.contact}
                          </Link>
                        ) : (
                          <span className="text-text font-medium text-sm">
                            {method.contact}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Links */}
            <Card variant="elevated" className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="w-5 h-5" />
                  Често задавани въпроси
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  Потърсете отговор на вашия въпрос в нашите ЧЗВ.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Вижте ЧЗВ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Изпратете ни съобщение
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-heading mb-2">
                        Име *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Вашето име"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">
                        Имейл *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-heading mb-2">
                      Тема
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="За какво искате да говорим?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-heading mb-2">
                      Съобщение *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Напишете вашето съобщение тук..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Изпращане...' : 'Изпрати съобщение'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-heading mb-4">
              Често задавани въпроси
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Отговори на най-честите въпроси от нашите потребители
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} variant="flat" className="border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-heading mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 text-center">
          <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <CardContent className="p-8">
              <UserGroupIcon className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-heading mb-4">
                Искате да станете част от екипа?
              </h3>
              <p className="text-text mb-6 max-w-2xl mx-auto">
                Винаги търсим талантливи автори, треньори и футболни експерти, 
                които искат да споделят знанията си с общността.
              </p>
              <Button size="lg" asChild>
                <Link href="mailto:careers@footballzone.bg">
                  Свържете се с нас
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}