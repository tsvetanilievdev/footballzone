import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  TrophyIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'За нас | FootballZone.bg',
  description: 'Научете повече за FootballZone.bg - водещата българска платформа за футболно образование за играчи, треньори и родители.',
}

const stats = [
  { label: 'Регистрирани потребители', value: '10,000+' },
  { label: 'Публикувани статии', value: '500+' },
  { label: 'Образователни курсове', value: '50+' },
  { label: 'Години опит', value: '15+' },
]

const features = [
  {
    icon: BookOpenIcon,
    title: 'Read Zone',
    description: 'Актуални статии, новини и анализи от света на българския и световния футбол.',
    badge: 'read'
  },
  {
    icon: AcademicCapIcon,
    title: 'Coach Zone',
    description: 'Професионални материали, тактики и методики за треньори на всички нива.',
    badge: 'coach'
  },
  {
    icon: UserGroupIcon,
    title: 'Player Zone',
    description: 'Упражнения, техники и съвети за развитие на индивидуалните умения.',
    badge: 'player'
  },
  {
    icon: HeartIcon,
    title: 'Parent Zone',
    description: 'Подкрепа и насоки за родители на млади футболисти.',
    badge: 'parent'
  },
]

const team = [
  {
    name: 'Георги Петров',
    role: 'Основател и главен редактор',
    description: 'Бивш професионален футболист и треньор с 20+ години опит във футбола.',
    image: '/images/team/georgi-petrov.jpg'
  },
  {
    name: 'Мария Димитрова',
    role: 'Спортен психолог',
    description: 'Специалист по детска спортна психология с фокус върху футбола.',
    image: '/images/team/maria-dimitrova.jpg'
  },
  {
    name: 'Иван Стоянов',
    role: 'Технически директор',
    description: 'UEFA Pro лицензиран треньор и бивш играч от Първа лига.',
    image: '/images/team/ivan-stoyanov.jpg'
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-background to-primary-50/30 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/images/football-field-pattern.svg')] opacity-5" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">FZ</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-heading mb-6">
              За <span className="text-primary">FootballZone.bg</span>
            </h1>
            
            <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed">
              Ние сме водещата българска платформа за футболно образование, която обединява играчи, 
              треньори и родители в една общност, посветена на развитието на футбола в България.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/read">
                  Разгледайте съдържанието
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Свържете се с нас
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <TrophyIcon className="w-4 h-4" />
                Нашата мисия
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-6">
                Развиваме българския футбол чрез образование
              </h2>
              
              <div className="prose prose-lg text-text">
                <p>
                  FootballZone.bg е създаден с ясна цел - да предостави качествено футболно 
                  образование и да подкрепи развитието на всички участници във футболната общност.
                </p>
                
                <p>
                  Вярваме, че чрез споделяне на знания, опит и най-добрите практики, можем да 
                  повишим нивото на българския футбол на всички равнища - от детски до 
                  професионален.
                </p>
                
                <ul>
                  <li>Качествено съдържание от експерти в областта</li>
                  <li>Персонализирано обучение за различни роли</li>
                  <li>Активна общност от единомишленици</li>
                  <li>Постоянно актуализирана информация</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/about/football-education.jpg"
                    alt="Футболно образование"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
                  <StarIcon className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">
              Нашите зони за обучение
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Специализирано съдържание за всеки участник във футболната общност
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="h-full group hover:shadow-xl transition-all duration-normal">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {feature.title}
                    <Badge variant={feature.badge as any} size="sm">
                      {feature.badge}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">
              Нашият екип
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Опитни професионалисти, посветени на развитието на българския футбол
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {team.map((member, index) => (
              <Card key={index} variant="elevated" className="text-center group hover:shadow-xl transition-all duration-normal">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-heading mb-2">
                    {member.name}
                  </h3>
                  
                  <Badge variant="outline" className="mb-4">
                    {member.role}
                  </Badge>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Присъединете се към нашата общност
          </h2>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Станете част от най-голямата българска платформа за футболно образование
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/auth/register">
                Започнете безплатно
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/courses">
                Разгледайте курсовете
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}