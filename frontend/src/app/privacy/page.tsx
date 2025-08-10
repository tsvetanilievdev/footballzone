import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Политика за поверителност | FootballZone.bg',
  description: 'Политика за поверителност на FootballZone.bg - как събираме, използваме и защитаваме вашите лични данни.',
}

const sections = [
  {
    icon: DocumentTextIcon,
    title: 'Обща информация',
    content: `Тази политика за поверителност обяснява как FootballZone.bg ("ние", "нас", "наш") 
              събира, използва и защитава информацията, която ни предоставяте при използването 
              на нашия уебсайт и услуги.`
  },
  {
    icon: UserIcon,
    title: 'Събирана информация',
    content: `Ние събираме информация, която ни предоставяте директно (име, имейл, профилна снимка) 
              и информация, която се събира автоматично (IP адрес, браузър, устройство, активност на сайта).
              Всички данни се събират и обработват в съответствие с GDPR.`
  },
  {
    icon: EyeIcon,
    title: 'Използване на информацията',
    content: `Вашата информация се използва за: осигуряване на персонализирано съдържание, 
              комуникация с вас, подобряване на нашите услуги, изпращане на новини и актуализации 
              (само ако сте дали съгласие), и анализ на използването на платформата.`
  },
  {
    icon: LockClosedIcon,
    title: 'Защита на данните',
    content: `Ние прилагаме съответните технически и организационни мерки за защита на вашите 
              лични данни срещу неоторизиран достъп, промяна, разкриване или унищожаване. 
              Всички данни се съхраняват на сигурни сървъри с шифроване.`
  }
]

const userRights = [
  'Право на достъп до вашите лични данни',
  'Право на коригиране на неточни данни', 
  'Право на изтриване на данните ("правото да бъдете забравени")',
  'Право на ограничаване на обработката',
  'Право на преносимост на данните',
  'Право на възражение срещу обработката',
  'Право да оттеглите съгласието си по всяко време'
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            Политика за поверителност
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Последна актуализация: 15 декември 2024
            </div>
          </div>
          
          <p className="text-lg text-text max-w-3xl mx-auto leading-relaxed">
            В FootballZone.bg поверителността на вашите данни е изключително важна за нас. 
            Тази политика обяснява как събираме, използваме и защитаваме вашата информация.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} variant="flat" className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          {/* Cookies */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Използване на "бисквитки" (Cookies)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-text">
                <p>
                  Нашият сайт използва "бисквитки" за подобряване на вашето потребителско изживяване. 
                  Бисквитките са малки текстови файлове, които се съхраняват на вашето устройство.
                </p>
                
                <h4 className="font-semibold text-heading mt-4 mb-2">Видове бисквитки:</h4>
                <ul className="space-y-2">
                  <li><strong>Необходими бисквитки:</strong> За основната функционалност на сайта</li>
                  <li><strong>Аналитични бисквитки:</strong> За анализ на трафика и поведението на потребителите</li>
                  <li><strong>Функционални бисквитки:</strong> За запаметяване на вашите предпочитания</li>
                  <li><strong>Рекламни бисквитки:</strong> За показване на релевантни реклами (ако има такива)</li>
                </ul>
                
                <p className="mt-4">
                  Можете да управлявате настройките за бисквитки чрез вашия браузър или чрез нашия 
                  панел за настройки на поверителността.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Вашите права</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text mb-4">
                В съответствие с GDPR, вие имате следните права относно вашите лични данни:
              </p>
              
              <ul className="space-y-3">
                {userRights.map((right, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text">{right}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-text mt-6">
                За да упражните някое от тези права, свържете се с нас на{' '}
                <Link href="mailto:privacy@footballzone.bg" className="text-primary hover:text-primary-600">
                  privacy@footballzone.bg
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Срок на съхранение</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-text">
                <p>
                  Ние съхраняваме вашите лични данни само докато е необходимо за целите, 
                  за които са събрани, или докато имаме законно основание за тяхното съхранение:
                </p>
                
                <ul className="mt-4 space-y-2">
                  <li><strong>Профилни данни:</strong> Докато вашият акаунт е активен</li>
                  <li><strong>Комуникационни данни:</strong> 3 години от последната комуникация</li>
                  <li><strong>Технически логове:</strong> 12 месеца</li>
                  <li><strong>Аналитични данни:</strong> 24 месеца в анонимизиран вид</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Споделяне с трети страни</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-text">
                <p>
                  Ние не продаваме, не търгуваме и не предоставяме вашите лични данни на трети страни, 
                  освен в следните случаи:
                </p>
                
                <ul className="mt-4 space-y-2">
                  <li>Когато имаме вашето изрично съгласие</li>
                  <li>При законово изискване (съдебна заповед, разследване и др.)</li>
                  <li>С доверени партньори, които ни помагат да предоставяме услугите (хостинг, аналитика)</li>
                  <li>При продажба или прехвърляне на бизнеса</li>
                </ul>
                
                <p className="mt-4">
                  Всички наши партньори са задължени да спазват същите стандарти за защита на данните.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Children Privacy */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Защита на децата</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text">
                Нашите услуги не са предназначени за деца под 16 години. Ако научим, че сме събрали 
                лични данни от дете под 16 години без съгласие на родител или настойник, ще предприемем 
                стъпки за изтриване на тази информация възможно най-скоро.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card variant="elevated" className="mt-16 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-8 text-center">
            <ShieldCheckIcon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-heading mb-4">
              Въпроси за поверителността?
            </h3>
            <p className="text-text mb-6 max-w-2xl mx-auto">
              Ако имате въпроси относно тази политика за поверителност или обработката на 
              вашите лични данни, не се колебайте да се свържете с нас.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="mailto:privacy@footballzone.bg">
                  Свържете се с нас
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Общи въпроси
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}