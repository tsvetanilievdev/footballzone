import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  DocumentTextIcon,
  ScaleIcon,
  UserIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Условия за ползване | FootballZone.bg',
  description: 'Условия за ползване на FootballZone.bg - правила и условия за използването на нашата платформа.',
}

const mainSections = [
  {
    icon: DocumentTextIcon,
    title: 'Приемане на условията',
    content: `Като използвате FootballZone.bg, вие се съгласявате да спазвате тези условия за ползване. 
              Ако не се съгласявате с някое от условията, моля не използвайте нашата платформа.`
  },
  {
    icon: UserIcon,
    title: 'Потребителски акаунти',
    content: `За достъп до определени функции е необходима регистрация. Вие сте отговорни за 
              поддържането на поверителността на вашия акаунт и пароли, както и за всички дейности, 
              извършвани под вашия акаунт.`
  },
  {
    icon: ScaleIcon,
    title: 'Интелектуална собственост',
    content: `Всичко съдържание на FootballZone.bg (текстове, изображения, видеа, курсове) е защитено 
              от авторско право. Можете да използвате съдържанието за лична, некомерсиална употреба, 
              освен ако не е посочено друго.`
  },
  {
    icon: ShieldExclamationIcon,
    title: 'Отговорности на потребителите',
    content: `Потребителите се задължават да не публикуват неподходящо съдържание, да не нарушават 
              правата на други потребители, да не използват платформата за незаконни дейности и 
              да спазват правилата на общността.`
  }
]

const prohibitedActivities = [
  'Публикуване на невярна, подвеждаща или клеветническа информация',
  'Заплахи, тормоз или всякакво поведение, което може да навреди на други',
  'Нарушаване на авторските права или други права върху интелектуална собственост',
  'Разпространение на вируси, малуер или други вредни кодове',
  'Автоматизирано събиране на данни (scraping) без разрешение',
  'Използване на платформата за спам или нежелана реклама',
  'Създаване на фалшиви акаунти или представяне за друго лице',
  'Нарушаване на приложимото законодателство'
]

const userContent = [
  'Запазвате авторските права върху съдържанието, което публикувате',
  'Предоставяте ни неексклузивен лиценз за използване на съдържанието',
  'Гарантирате, че имате право да публикувате съдържанието',
  'Съдържанието не трябва да нарушава закони или права на трети лица',
  'Запазваме си правото да премахваме неподходящо съдържание'
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
            <DocumentTextIcon className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            Условия за ползване
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Последна актуализация: 15 декември 2024
            </div>
          </div>
          
          <p className="text-lg text-text max-w-3xl mx-auto leading-relaxed">
            Моля, прочетете внимателно тези условия преди да използвате FootballZone.bg. 
            Използването на нашата платформа означава, че приемате тези условия.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {mainSections.map((section, index) => (
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
          {/* Prohibited Activities */}
          <Card variant="flat" className="border border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
                Забранени дейности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text mb-4">
                При използването на FootballZone.bg се забранява:
              </p>
              
              <ul className="space-y-3">
                {prohibitedActivities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text">{activity}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-text">
                  <strong>Важно:</strong> Нарушаването на тези правила може да доведе до 
                  временно или постоянно преустановяване на достъпа до платформата.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Content */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Потребителско съдържание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text mb-4">
                Когато публикувате съдържание на FootballZone.bg (коментари, статии, снимки и др.), 
                се прилагат следните правила:
              </p>
              
              <ul className="space-y-3">
                {userContent.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-text">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Достъпност на услугите</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-text">
                <p>
                  Ние се стремим да осигурим непрекъснат достъп до нашите услуги, но не можем да 
                  гарантираме 100% достъпност. Платформата може временно да не е достъпна поради:
                </p>
                
                <ul className="mt-4 space-y-2">
                  <li>Планирана поддръжка и актуализации</li>
                  <li>Технически проблеми извън нашия контрол</li>
                  <li>Проблеми с интернет доставчиците</li>
                  <li>Форсмажорни обстоятелства</li>
                </ul>
                
                <p className="mt-4">
                  В случай на продължителни проблеми ще информираме потребителите чрез нашите 
                  официални канали за комуникация.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Premium Services */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Платени услуги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-text">
                <h4 className="font-semibold text-heading mb-2">Абонаменти и плащания:</h4>
                <ul className="space-y-2">
                  <li>Премиум абонаментите се заплащат предварително</li>
                  <li>Цените могат да се променят с предизвестие от 30 дни</li>
                  <li>Автоматичното подновяване може да бъде спряно по всяко време</li>
                  <li>Възстановяването на средства се извършва според нашата политика</li>
                </ul>
                
                <h4 className="font-semibold text-heading mt-6 mb-2">Политика за възстановяване:</h4>
                <ul className="space-y-2">
                  <li>14-дневен период за връщане на средства при първоначална покупка</li>
                  <li>Пропорционално възстановяване при технически проблеми</li>
                  <li>Без възстановяване при нарушаване на условията за ползване</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Ограничение на отговорността</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-text">
                <p>
                  FootballZone.bg се предоставя "както е" без никакви гаранции. В максималната 
                  степен, разрешена от закона, ние не носим отговорност за:
                </p>
                
                <ul className="mt-4 space-y-2">
                  <li>Преки, непреки или случайни щети</li>
                  <li>Загуба на данни или печалби</li>
                  <li>Прекъсване на бизнес дейности</li>
                  <li>Съдържание, публикувано от потребители</li>
                  <li>Действия на трети страни</li>
                </ul>
                
                <p className="mt-4">
                  Максималната ни отговорност е ограничена до сумата, заплатена от вас за 
                  използването на нашите услуги през последните 12 месеца.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Промени в условията</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text">
                Запазваме си правото да актуализираме тези условия за ползване по всяко време. 
                Промените влизат в сила веднага след публикуването им на сайта. Значителни промени 
                ще бъдат съобщени на потребителите чрез имейл или известие в платформата.
              </p>
              
              <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg">
                <p className="text-sm text-text">
                  <strong>Препоръка:</strong> Проверявайте периодично тези условия за актуализации. 
                  Продължителното използване на платформата след промените означава приемане на новите условия.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card variant="flat" className="border">
            <CardHeader>
              <CardTitle>Приложимо право</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text">
                Тези условия за ползване се регулират от законодателството на Република България. 
                Всички спорове се решават от компетентните български съдилища в град София.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card variant="elevated" className="mt-16 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-8 text-center">
            <ScaleIcon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-heading mb-4">
              Въпроси относно условията?
            </h3>
            <p className="text-text mb-6 max-w-2xl mx-auto">
              Ако имате въпроси относно тези условия за ползване или нуждаете от разяснения, 
              моля свържете се с нас.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="mailto:legal@footballzone.bg">
                  Правни въпроси
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