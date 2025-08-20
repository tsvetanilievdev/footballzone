import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with comprehensive data...')

  // Clear existing data to avoid conflicts
  console.log('🗑️ Clearing existing data...')
  await prisma.articleView.deleteMany()
  await prisma.userActivity.deleteMany() 
  await prisma.refreshToken.deleteMany()
  await prisma.articleZone.deleteMany()
  await prisma.article.deleteMany()
  await prisma.articleSeries.deleteMany()
  await prisma.articleTemplate.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleared')

  // Create all article templates
  const readTemplate = await prisma.articleTemplate.create({
    data: {
      name: 'Read Zone Article',
      description: 'General articles for all readers',
      category: 'read',
      isDefault: true,
      settings: {
        textLength: 'long',
        allowVideos: true,
        maxVideos: 2,
        videoTypes: ['youtube', 'vimeo'],
        allowImages: true,
        maxImages: 5,
        imageLayout: 'gallery',
        allowDownloads: true,
        downloadTypes: ['pdf', 'doc'],
        allowLinks: true,
        styling: {
          layout: 'single-column',
          fontSize: 'medium',
          spacing: 'normal',
          colors: {
            primary: '#059669',
            secondary: '#10b981',
            text: '#374151'
          }
        }
      }
    }
  })

  const coachTemplate = await prisma.articleTemplate.create({
    data: {
      name: 'Coach Zone Article',
      description: 'Professional training content for coaches',
      category: 'coach',
      isDefault: true,
      settings: {
        textLength: 'medium',
        allowVideos: true,
        maxVideos: 3,
        videoTypes: ['youtube', 'vimeo'],
        allowImages: true,
        maxImages: 8,
        imageLayout: 'grid',
        allowDownloads: true,
        downloadTypes: ['pdf', 'doc', 'ppt'],
        allowLinks: true,
        styling: {
          layout: 'single-column',
          fontSize: 'medium',
          spacing: 'normal',
          colors: {
            primary: '#2563eb',
            secondary: '#3b82f6',
            text: '#374151'
          }
        }
      }
    }
  })

  const tacticsTemplate = await prisma.articleTemplate.create({
    data: {
      name: 'Tactical Analysis',
      description: 'In-depth tactical breakdowns',
      category: 'coach',
      isDefault: false,
      settings: {
        textLength: 'long',
        allowVideos: true,
        maxVideos: 5,
        videoTypes: ['youtube', 'vimeo'],
        allowImages: true,
        maxImages: 10,
        imageLayout: 'diagram',
        allowDownloads: true,
        downloadTypes: ['pdf', 'doc', 'ppt'],
        allowLinks: true,
        styling: {
          layout: 'two-column',
          fontSize: 'medium',
          spacing: 'wide',
          colors: {
            primary: '#dc2626',
            secondary: '#ef4444',
            text: '#374151'
          }
        }
      }
    }
  })

  // Create comprehensive user base
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@footballzone.bg',
      passwordHash: await bcrypt.hash('admin123', 12),
      name: 'Администратор',
      role: 'ADMIN',
      emailVerified: true,
      bio: 'Главен администратор на FootballZone.bg',
      isActive: true,
      subscribeNewsletter: true,
      emailNotifications: true,
      pushNotifications: true,
    }
  })

  const coachUser = await prisma.user.create({
    data: {
      email: 'coach@footballzone.bg',
      passwordHash: await bcrypt.hash('coach123', 12),
      name: 'Петър Стоилов',
      role: 'COACH',
      emailVerified: true,
      bio: 'Професионален треньор с 15-годишен опит. UEFA Pro лицензиран.',
      isActive: true,
      subscribeNewsletter: true,
      emailNotifications: true,
      pushNotifications: false,
    }
  })

  const playerUser = await prisma.user.create({
    data: {
      email: 'player@footballzone.bg',
      passwordHash: await bcrypt.hash('player123', 12),
      name: 'Георги Иванов',
      role: 'PLAYER',
      emailVerified: true,
      bio: 'Полузащитник в местен отбор. Играя футбол от 10 години.',
      isActive: true,
      subscribeNewsletter: false,
      emailNotifications: true,
      pushNotifications: true,
    }
  })

  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@footballzone.bg',
      passwordHash: await bcrypt.hash('parent123', 12),
      name: 'Мария Петкова',
      role: 'PARENT',
      emailVerified: true,
      bio: 'Майка на млад футболист. Интересувам се от детското развитие.',
      isActive: true,
      subscribeNewsletter: true,
      emailNotifications: true,
      pushNotifications: false,
    }
  })

  const freeUser = await prisma.user.create({
    data: {
      email: 'user@footballzone.bg',
      passwordHash: await bcrypt.hash('user123', 12),
      name: 'Иван Димитров',
      role: 'FREE',
      emailVerified: true,
      bio: 'Футболен фен и читател на FootballZone.bg',
      isActive: true,
      subscribeNewsletter: true,
      emailNotifications: false,
      pushNotifications: false,
    }
  })

  // Create test user as requested earlier
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('TestPassword123!', 12),
      name: 'Test User',
      role: 'FREE',
      emailVerified: false,
      isActive: true,
    }
  })

  // Create multiple article series
  const conteSeries = await prisma.articleSeries.create({
    data: {
      name: 'Философията на Антонио Конте',
      slug: 'antonio-conte-philosophy',
      description: 'Серия статии за треньорската философия и методите на Антонио Конте',
      category: 'coaches',
      status: 'ACTIVE',
      totalPlannedArticles: 5,
      tags: ['Конте', 'Философия', 'Лидерство', 'Тренировки', 'Дисциплина'],
      coverImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop'
    }
  })

  const tacticsSeries = await prisma.articleSeries.create({
    data: {
      name: 'Модерни тактически формации',
      slug: 'modern-tactical-formations',
      description: 'Подробен анализ на най-използваните формации в съвременния футбол',
      category: 'coaches',
      status: 'ACTIVE',
      totalPlannedArticles: 8,
      tags: ['Тактика', 'Формации', 'Анализ', 'Съвременен футбол'],
      coverImageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&h=600&fit=crop'
    }
  })

  const techniqueSeries = await prisma.articleSeries.create({
    data: {
      name: 'Основи на футболната техника',
      slug: 'football-technique-basics',
      description: 'Фундаментални упражнения и техники за всички възрасти',
      category: 'players',
      status: 'ACTIVE',
      totalPlannedArticles: 6,
      tags: ['Техника', 'Упражнения', 'Основи', 'Тренировка'],
      coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop'
    }
  })

  // Create comprehensive articles for all working paths

  // READ ZONE ARTICLES (General football content)
  const articles = []

  // Article 1: Conte Philosophy (READ + COACH)
  const article1 = await prisma.article.create({
    data: {
      title: 'Футболна философия на Антонио Конте: Дисциплина, Идентичност, Интензитет',
      slug: 'filosofiya-antonio-conte-distsiplina-identichnost-intenzitet',
      excerpt: 'Открийте какви са треньорските принципи на Антонио Конте – интензитет, дисциплина и тактическа идентичност.',
      content: `
        <p>Знаете ли, че Антонио Конте кара играчите си да правят до 4 тренировки на ден в предсезонната подготовка? Това не е каприз, а отражение на философията му – безусловна отдаденост, контрол и интензивност във всичко.</p>

        <p>За много треньори Конте е вдъхновение, но и предизвикателство. Той съчетава военна дисциплина с модерна тактическа яснота, което го прави уникален в съвременния футбол. Какво го прави толкова ефективен?</p>

        <p>В тази статия ще разкрием основните елементи от неговата философия – тези, които оформят начина, по който води отборите си към успех.</p>

        <h2>🔥 Принцип 1: Всичко започва с интензитет</h2>
        
        <blockquote>"Ако не можеш да тичаш, не можеш да играеш за мен" – една от най-често цитираните реплики на Конте.</blockquote>
        
        <p>За него интензитетът не е резултат от добрата форма, а от менталната нагласа. На тренировка се тренира така, както се играе. Това не е просто слоган – това е начин на живот.</p>

        <h2>⚡ Принцип 2: Тактическа идентичност</h2>
        
        <p>Конте вярва, че отборът трябва да има ясна идентичност. Това означава, че всеки играч знае точно какво се очаква от него във всяка ситуация.</p>

        <h2>🎯 Принцип 3: Дисциплина като основа</h2>
        
        <p>Дисциплината при Конте не е наказание – това е инструмент за постигане на съвършенство. Всичко има своето време и място.</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
      authorId: adminUser.id,
      category: 'TACTICS',
      tags: ['Конте', 'Философия', 'Лидерство', 'Тренировки', 'Дисциплина'],
      publishedAt: new Date('2024-11-26'),
      readTime: 6,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: readTemplate.id,
      seriesId: conteSeries.id,
      seriesPart: 1
    }
  })
  articles.push(article1)

  // Article zones for article1
  await prisma.articleZone.createMany({
    data: [
      { articleId: article1.id, zone: 'READ', visible: true },
      { articleId: article1.id, zone: 'coach', visible: true }
    ]
  })

  // Article 2: Basic Football Rules (READ)
  const article2 = await prisma.article.create({
    data: {
      title: 'Основни правила на футбола: Пълно ръководство за начинаещи',
      slug: 'osnovni-pravila-futbol-rakhvodstvo-nachinayushti',
      excerpt: 'Научете основните правила на футбола, позициите на играчите и как се играе най-популярният спорт в света.',
      content: `
        <p>Футболът е най-популярният спорт в света и правилата му са относително прости. В тази статия ще разгледаме всичко, което трябва да знаете за основните правила.</p>

        <h2>⚽ Основни правила</h2>
        
        <p>Футболът се играе между два отбора от по 11 играча всеки. Целта е да се вкара топката в противниковата врата повече пъти от съперника.</p>

        <h2>🏟️ Игрище и екипировка</h2>
        
        <p>Футболното игрище има правоъгълна форма с дължина между 90-120 метра и ширина между 45-90 метра.</p>

        <h2>👥 Позиции на играчите</h2>
        
        <ul>
          <li><strong>Вратар</strong> - може да хваща топката с ръце в наказателното поле</li>
          <li><strong>Защитници</strong> - основна роля е да защитават вратата</li>
          <li><strong>Полузащитници</strong> - свързват защитата с нападението</li>
          <li><strong>Нападатели</strong> - основна роля е да вкарват голове</li>
        </ul>

        <h2>⚖️ Основни нарушения</h2>
        
        <p>Най-честите нарушения включват офсайд, фаулове, ръчна топка и неспортсменско поведение.</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop',
      authorId: freeUser.id,
      category: 'NEWS',
      tags: ['Правила', 'Начинаещи', 'Основи', 'Футбол', 'Позиции'],
      publishedAt: new Date('2024-12-01'),
      readTime: 8,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: readTemplate.id
    }
  })
  articles.push(article2)

  await prisma.articleZone.create({
    data: { articleId: article2.id, zone: 'READ', visible: true }
  })

  // Article 3: History of Football (READ)
  const article3 = await prisma.article.create({
    data: {
      title: 'История на футбола: От древността до съвременността',
      slug: 'istoriya-futbol-drevnost-savremennost',
      excerpt: 'Пътешествие през вековете за да разберем как се е развивал най-обичаният спорт в света.',
      content: `
        <p>Футболът, както го познаваме днес, има богата история, която се простира на хиляди години назад. От древните цивилизации до модерните стадиони, ето как се е развивал спортът.</p>

        <h2>🏺 Древните корени</h2>
        
        <p>Древните китайци играеха игра наречена "cuju" още през 2-ри и 3-ти век пр.н.е. Тя включваше ритане на кожена топка през отвор в мрежа.</p>

        <h2>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Раждането на модерния футбол</h2>
        
        <p>Модерният футбол е роден в Англия през 19-ти век. Първите официални правила са приети от Футболната асоциация през 1863 година.</p>

        <h2>🌍 Разпространение по света</h2>
        
        <p>Футболът се разпространява бързо по целия свят благодарение на британските моряци и търговци. Първите професионални лиги започват в края на 19-ти век.</p>

        <h2>🏆 FIFA и Световното първенство</h2>
        
        <p>FIFA е основана през 1904 година, а първото Световно първенство се провежда в Уругвай през 1930 година.</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop',
      authorId: freeUser.id,
      category: 'NEWS',
      tags: ['История', 'FIFA', 'Световно първенство', 'Традиции'],
      publishedAt: new Date('2024-11-30'),
      readTime: 10,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: readTemplate.id
    }
  })
  articles.push(article3)

  await prisma.articleZone.create({
    data: { articleId: article3.id, zone: 'READ', visible: true }
  })

  // COACH ZONE ARTICLES (Professional content)

  // Article 4: Preseason Training (COACH)
  const article4 = await prisma.article.create({
    data: {
      title: 'Предсезонната подготовка на Антонио Конте – Структура, цели и натоварване',
      slug: 'preseason-conte-structure',
      excerpt: 'Разбери как Антонио Конте структурира своята подготовка – физическо натоварване, тактически блокове и военна дисциплина.',
      content: `
        <p>При Конте е като в армията – спиш, ядеш и тренираш. Как да структурираме подготовка, която изгражда тяло, тактика и дух? Предсезонната подготовка при Конте не е просто физическа кондиция – това е трансформация на играчите в машина за победи.</p>

        <p>Ще разгледаме макроцикъл, дневна структура и методи, които използва Конте за да създаде отбори, които доминират през целия сезон.</p>

        <h2>📅 Макроцикъл: От натоварване към автоматизъм</h2>
        
        <p>Конте разделя предсезонната подготовка на три основни фази:</p>
        
        <ul>
          <li><strong>Фаза 1 (седмици 1-2):</strong> Градиране на физическата база</li>
          <li><strong>Фаза 2 (седмици 3-4):</strong> Тактическа интеграция</li>
          <li><strong>Фаза 3 (седмици 5-6):</strong> Автоматизъм и финни настройки</li>
        </ul>

        <h2>⏰ Дневна структура</h2>
        
        <p>Типичен ден включва:</p>
        <ul>
          <li>8:00 - Закуска и медицински преглед</li>
          <li>10:00 - Първа тренировка (физическа)</li>
          <li>12:00 - Обяд и почивка</li>
          <li>16:00 - Втора тренировка (тактическа)</li>
          <li>18:00 - Допълнителна работа (индивидуална)</li>
        </ul>

        <h2>🎯 Ключови принципи</h2>
        
        <p>Всяка тренировка има ясна цел. Никога не се тренира заради тренирането, а винаги с конкретна цел пред очи.</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
      authorId: coachUser.id,
      category: 'TRAINING',
      tags: ['Конте', 'Предсезонна подготовка', 'Натоварване', 'Макроцикъл', 'Структура'],
      publishedAt: new Date('2024-11-25'),
      readTime: 7,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: coachTemplate.id,
      seriesId: conteSeries.id,
      seriesPart: 2
    }
  })
  articles.push(article4)

  await prisma.articleZone.createMany({
    data: [
      { articleId: article4.id, zone: 'READ', visible: true },
      { articleId: article4.id, zone: 'coach', visible: true }
    ]
  })

  // Article 5: 4-3-3 Formation (COACH - PREMIUM)
  const article5 = await prisma.article.create({
    data: {
      title: 'Модерна тактическа схема 4-3-3: Детайли и приложение',
      slug: 'modern-4-3-3-formation-details',
      excerpt: 'Подробен анализ на една от най-използваните формации в съвременния футбол и как да я приложите.',
      content: `
        <h2>🔷 Въведение в 4-3-3</h2>
        <p>Формацията 4-3-3 се счита за една от най-балансираните в модерния футбол. Тя предлага отлична комбинация между атакуване и защита, като позволява гъвкавост във всички фази на играта.</p>
        
        <h2>🏗️ Основна структура</h2>
        <p>Формацията се състои от:</p>
        <ul>
          <li><strong>Четири защитника:</strong> Два централни и двама крайни</li>
          <li><strong>Три полузащитника:</strong> Един задържащ и двама атакуващи</li>
          <li><strong>Три нападатели:</strong> Два крайни и един централен</li>
        </ul>

        <h2>⚙️ Ролите на позициите</h2>
        
        <h3>Защитници</h3>
        <p>Централните защитници трябва да са силни в единоборствата и добри в конструирането на играта. Крайните защитници се включват активно в атаката.</p>

        <h3>Полузащитници</h3>
        <p>Задържащият полузащитник (DM) е ключов за баланса. Двамата атакуващи полузащитника (CM) осигуряват връзката между линиите.</p>

        <h3>Нападатели</h3>
        <p>Крайните нападатели работят широко и навътре, централният нападател е фокусна точка в атаката.</p>

        <h2>📋 Предимства и недостатъци</h2>
        
        <h3>Предимства:</h3>
        <ul>
          <li>Отличен баланс между атака и защита</li>
          <li>Гъвкавост в преходите</li>
          <li>Множество варианти за атака</li>
          <li>Ефективно пресинг</li>
        </ul>

        <h3>Недостатъци:</h3>
        <ul>
          <li>Изисква играчи с високо техническо ниво</li>
          <li>Може да остави пространства в центъра</li>
          <li>Зависи от формата на ключовите играчи</li>
        </ul>

        <h2>🎯 Практическо приложение</h2>
        
        <p>За успешно приложение на 4-3-3 е необходимо:</p>
        <ul>
          <li>Интензивна работа върху позиционната игра</li>
          <li>Автоматизъм в движенията</li>
          <li>Ясни инструкции за всяка фаза</li>
          <li>Физическа подготовка за високо темпо</li>
        </ul>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&h=600&fit=crop',
      authorId: coachUser.id,
      category: 'TACTICS',
      tags: ['4-3-3', 'формация', 'тактика', 'схема', 'позиции', 'модерен футбол'],
      publishedAt: new Date('2024-01-10'),
      readTime: 12,
      isPremium: true,
      premiumReleaseDate: new Date('2024-02-10'), // Becomes free after 1 month
      status: 'PUBLISHED',
      templateId: tacticsTemplate.id,
      seriesId: tacticsSeries.id,
      seriesPart: 1
    }
  })
  articles.push(article5)

  await prisma.articleZone.create({
    data: {
      articleId: article5.id,
      zone: 'coach',
      visible: true,
      requiresSubscription: true,
      freeAfterDate: new Date('2024-02-10')
    }
  })

  // Article 6: Training Methodology (COACH)
  const article6 = await prisma.article.create({
    data: {
      title: 'Методика на тренировката: Планиране и периодизация',
      slug: 'metodika-trenirovka-planirane-periodizaciya',
      excerpt: 'Основни принципи за планиране на тренировъчния процес и периодизация през сезона.',
      content: `
        <p>Планирането на тренировъчния процес е основа за успеха на всеки отбор. В тази статия ще разгледаме ключовите принципи на периодизацията.</p>

        <h2>📊 Принципи на планирането</h2>
        
        <p>Ефективното планиране се базира на няколко основни принципа:</p>
        <ul>
          <li><strong>Специфичност:</strong> Тренировките трябва да отговарят на нуждите на играта</li>
          <li><strong>Прогресия:</strong> Постепенно увеличаване на натоварването</li>
          <li><strong>Индивидуализация:</strong> Адаптиране към нуждите на всеки играч</li>
          <li><strong>Възстановяване:</strong> Баланс между натоварване и почивка</li>
        </ul>

        <h2>📅 Периодизация</h2>
        
        <p>Сезонът се разделя на няколко периода:</p>
        
        <h3>Предсезонен период</h3>
        <ul>
          <li>Общо физическо развитие</li>
          <li>Техническа работа</li>
          <li>Основни тактически принципи</li>
        </ul>

        <h3>Състезателен период</h3>
        <ul>
          <li>Поддържане на формата</li>
          <li>Тактическо усъвършенстване</li>
          <li>Ментална подготовка</li>
        </ul>

        <h3>Преходен период</h3>
        <ul>
          <li>Активна почивка</li>
          <li>Възстановяване</li>
          <li>Планиране за новия сезон</li>
        </ul>

        <h2>⚖️ Баланс в тренировката</h2>
        
        <p>Всяка тренировка трябва да съчетава различни компоненти в правилната пропорция.</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e787d7912?w=1200&h=600&fit=crop',
      authorId: coachUser.id,
      category: 'TRAINING',
      tags: ['Методика', 'Планиране', 'Периодизация', 'Тренировка'],
      publishedAt: new Date('2024-11-20'),
      readTime: 9,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: coachTemplate.id
    }
  })
  articles.push(article6)

  await prisma.articleZone.create({
    data: { articleId: article6.id, zone: 'coach', visible: true }
  })

  // Article 7: Technical Training (COACH)
  const article7 = await prisma.article.create({
    data: {
      title: 'Техническа тренировка: Основни упражнения за всички възрасти',
      slug: 'tehniceska-trenirovka-osnovni-uprajneniya',
      excerpt: 'Практическо ръководство за техническа тренировка с конкретни упражнения и методики.',
      content: `
        <p>Техническата тренировка е основата на добрия футболист. В тази статия ще разгледаме основните упражнения за развитие на техниката.</p>

        <h2>⚽ Контрол на топката</h2>
        
        <p>Упражнения за контрол:</p>
        <ul>
          <li><strong>Jongling:</strong> С различни части от тялото</li>
          <li><strong>Cone drills:</strong> Дриблиране между конуси</li>
          <li><strong>Wall pass:</strong> Контрол от стена</li>
          <li><strong>Aerial control:</strong> Контрол на високи топки</li>
        </ul>

        <h2>🎯 Точност в подаването</h2>
        
        <p>Основни упражнения:</p>
        <ul>
          <li>Кратки подавания в двойки</li>
          <li>Дълги подавания към цел</li>
          <li>Подавания под натиск</li>
          <li>Кръстосани подавания</li>
        </ul>

        <h2>🥅 Финализация</h2>
        
        <p>Упражнения за стрелба:</p>
        <ul>
          <li>Стрелба от място</li>
          <li>Стрелба в движение</li>
          <li>Volley упражнения</li>
          <li>Финиширане от фланг</li>
        </ul>

        <h2>👥 Възрастови особености</h2>
        
        <h3>Деца (6-10 години)</h3>
        <p>Фокус върху забавление и основни движения с топка.</p>

        <h3>Юноши (11-15 години)</h3>
        <p>Развитие на координация и основни технически умения.</p>

        <h3>Младежи (16+ години)</h3>
        <p>Усъвършенстване и специализация на техниката.</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&h=600&fit=crop',
      authorId: coachUser.id,
      category: 'TECHNIQUE',
      tags: ['Техника', 'Упражнения', 'Контрол', 'Подаване', 'Стрелба'],
      publishedAt: new Date('2024-11-18'),
      readTime: 8,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: coachTemplate.id,
      seriesId: techniqueSeries.id,
      seriesPart: 1
    }
  })
  articles.push(article7)

  await prisma.articleZone.create({
    data: { articleId: article7.id, zone: 'coach', visible: true }
  })

  // Article 8: Psychology in Football (COACH)
  const article8 = await prisma.article.create({
    data: {
      title: 'Психология във футбола: Ментална подготовка на играчите',
      slug: 'psihologiya-futbol-mentalna-podgotovka',
      excerpt: 'Как да развиете ментална сила при играчите и да ги подготвите психологически за предизвикателствата.',
      content: `
        <p>Менталната подготовка е толкова важна колкото физическата и техническата. Ето как да развиете психологическата сила на вашите играчи.</p>

        <h2>🧠 Ментални умения</h2>
        
        <p>Ключовите ментални умения включват:</p>
        <ul>
          <li><strong>Концентрация:</strong> Фокус върху важното</li>
          <li><strong>Увереност:</strong> Вяра в собствените възможности</li>
          <li><strong>Управление на стреса:</strong> Справяне с напрежението</li>
          <li><strong>Мотивация:</strong> Желание за постижения</li>
        </ul>

        <h2>🎯 Техники за развитие</h2>
        
        <h3>Визуализация</h3>
        <p>Мислено представяне на успешни действия преди тяхното изпълнение.</p>

        <h3>Дихателни техники</h3>
        <p>Контролирано дишане за успокояване и фокус.</p>

        <h3>Позитивен self-talk</h3>
        <p>Замяна на негативните мисли с позитивни послания.</p>

        <h3>Goal setting</h3>
        <p>Поставяне на ясни и достижими цели.</p>

        <h2>⚡ Справяне с натиска</h2>
        
        <p>Стратегии за справяне с натиска:</p>
        <ul>
          <li>Подготовка чрез симулация</li>
          <li>Фокус върху процеса, не върху резултата</li>
          <li>Използване на рутини</li>
          <li>Положителна комуникация</li>
        </ul>

        <h2>👥 Работа с отбора</h2>
        
        <p>Изграждане на отборен дух чрез:</p>
        <ul>
          <li>Общи цели</li>
          <li>Взаимно доверие</li>
          <li>Ефективна комуникация</li>
          <li>Положителна атмосфера</li>
        </ul>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1594736797933-d0fce2fe2836?w=1200&h=600&fit=crop',
      authorId: coachUser.id,
      category: 'PSYCHOLOGY',
      tags: ['Психология', 'Ментална подготовка', 'Концентрация', 'Мотивация'],
      publishedAt: new Date('2024-11-15'),
      readTime: 10,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: coachTemplate.id
    }
  })
  articles.push(article8)

  await prisma.articleZone.create({
    data: { articleId: article8.id, zone: 'coach', visible: true }
  })

  // Article 9: Nutrition in Football (READ + COACH)
  const article9 = await prisma.article.create({
    data: {
      title: 'Храненето във футбола: Ръководство за оптимална производителност',
      slug: 'hranene-futbol-rakhovodstvo-optimalna-proizvoditelnost',
      excerpt: 'Как правилното хранене може да подобри производителността и възстановяването на футболистите.',
      content: `
        <p>Храненето играе ключова роля за производitelността на футболистите. Правилната диета може да направи разликата между победата и загубата.</p>

        <h2>🍎 Основи на спортното хранене</h2>
        
        <p>Основните макронутриенти са:</p>
        <ul>
          <li><strong>Въглехидрати (55-60%):</strong> Основен източник на енергия</li>
          <li><strong>Протеини (15-20%):</strong> За възстановяване на мускулите</li>
          <li><strong>Мазнини (20-25%):</strong> За дългосрочна енергия</li>
        </ul>

        <h2>⏰ Времингът е важен</h2>
        
        <h3>Преди тренировка/мач</h3>
        <ul>
          <li>3-4 часа преди: Пълноценно хранене</li>
          <li>1-2 часа преди: Лека закуска</li>
          <li>30 мин преди: Малко въглехидрати</li>
        </ul>

        <h3>По време на мач</h3>
        <ul>
          <li>Течности за хидратация</li>
          <li>Изотонични напитки</li>
          <li>Бързи въглехидрати при нужда</li>
        </ul>

        <h3>След мач/тренировка</h3>
        <ul>
          <li>Първите 30 мин: Протеини + въглехидрати</li>
          <li>В рамките на 2 часа: Пълноценно хранене</li>
        </ul>

        <h2>💧 Хидратация</h2>
        
        <p>Правилната хидратация е жизненоважна:</p>
        <ul>
          <li>2-3 литра вода дневно</li>
          <li>Повече при тренировки</li>
          <li>Мониториране чрез цвета на урината</li>
          <li>Електролити при дълги усилия</li>
        </ul>

        <h2>🚫 Какво да избягваме</h2>
        
        <ul>
          <li>Мазна храна преди мач</li>
          <li>Много захар</li>
          <li>Алкохол</li>
          <li>Нови храни в деня на мача</li>
        </ul>

        <h2>📋 Примерно меню</h2>
        
        <h3>Закуска</h3>
        <p>Овесена каша с плодове и орехи</p>

        <h3>Обяд</h3>
        <p>Пилешко месо с ориз и зеленчуци</p>

        <h3>Вечеря</h3>
        <p>Риба с картофи и салата</p>

        <h3>Закуски</h3>
        <p>Плодове, кисело мляко, орехи</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop',
      authorId: playerUser.id,
      category: 'CONDITIONING',
      tags: ['Хранене', 'Диета', 'Производителност', 'Възстановяване', 'Хидратация'],
      publishedAt: new Date('2024-11-12'),
      readTime: 11,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: readTemplate.id
    }
  })
  articles.push(article9)

  await prisma.articleZone.createMany({
    data: [
      { articleId: article9.id, zone: 'READ', visible: true },
      { articleId: article9.id, zone: 'coach', visible: true }
    ]
  })

  // Article 10: Famous Players Analysis (READ)
  const article10 = await prisma.article.create({
    data: {
      title: 'Лионел Меси: Анализ на гениалността',
      slug: 'lionel-mesi-analiz-genialnost',
      excerpt: 'Детайлен анализ на играта на Лионел Меси и какво го прави толкова специален.',
      content: `
        <p>Лионел Меси се счита за един от най-великите футболисти в историята. Какво го прави толкова специален и какво можем да научим от неговата игра?</p>

        <h2>⚽ Техническо майстерство</h2>
        
        <p>Месси се отличава с:</p>
        <ul>
          <li><strong>Невероятен контрол:</strong> Топката изглежда залепена за крака му</li>
          <li><strong>Близко дриблиране:</strong> Много малки докосвания</li>
          <li><strong>Промяна на ритъм:</strong> Ускорения и забавяния</li>
          <li><strong>Двукракост:</strong> Използва и двата крака еднакво добре</li>
        </ul>

        <h2>🧠 Футболен интелект</h2>
        
        <p>Менталните качества на Меси:</p>
        <ul>
          <li>Видение за игра</li>
          <li>Вземане на решения</li>
          <li>Четене на играта</li>
          <li>Адаптиране към ситуациите</li>
        </ul>

        <h2>📊 Статистически данни</h2>
        
        <p>Впечатляващите цифри:</p>
        <ul>
          <li>Над 800 гола в кариерата</li>
          <li>8 Златни топки</li>
          <li>4 Шампионски лиги</li>
          <li>Световен шампион 2022</li>
        </ul>

        <h2>🎯 Еволюция на играта</h2>
        
        <h3>Млади години</h3>
        <p>Чист дрибльор и скоростен играч.</p>

        <h3>Зрели години</h3>
        <p>Развитие на пасовите качества и лидерство.</p>

        <h3>Опитни години</h3>
        <p>Изключителното футболно видение и ефективност.</p>

        <h2>💡 Уроци за младите играчи</h2>
        
        <ul>
          <li>Постоянство в тренировките</li>
          <li>Работа върху слабостите</li>
          <li>Адаптиране към различни роли</li>
          <li>Ментална сила</li>
        </ul>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&h=600&fit=crop',
      authorId: freeUser.id,
      category: 'NEWS',
      tags: ['Меси', 'Анализ', 'Техника', 'Футболен интелект', 'Легенди'],
      publishedAt: new Date('2024-11-10'),
      readTime: 9,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: readTemplate.id
    }
  })
  articles.push(article10)

  await prisma.articleZone.create({
    data: { articleId: article10.id, zone: 'READ', visible: true }
  })

  // Create comprehensive analytics data for all articles
  const viewsData = []
  
  // Generate realistic views for all articles
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    const viewCount = Math.floor(Math.random() * 500) + 50 // 50-550 views per article
    
    for (let j = 0; j < Math.min(viewCount, 20); j++) { // Limit to 20 detailed views per article
      const randomUser = [adminUser, coachUser, playerUser, parentUser, freeUser, testUser][Math.floor(Math.random() * 6)]
      const deviceTypes = ['desktop', 'mobile', 'tablet']
      const referrers = ['https://google.com', 'https://facebook.com', 'direct', 'https://twitter.com']
      
      viewsData.push({
        articleId: article.id,
        userId: randomUser.id,
        sessionId: `session-${i}-${j}`,
        viewDuration: Math.floor(Math.random() * 600) + 30, // 30-630 seconds
        completionPercent: Math.floor(Math.random() * 100) + 1,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
      })
    }
  }

  await prisma.articleView.createMany({
    data: viewsData
  })

  // Create user activities for authentication tracking
  const activitiesData = [
    {
      userId: adminUser.id,
      sessionId: 'admin-session-1',
      action: 'LOGIN',
      resourceType: 'AUTH',
      resourceId: null,
      metadata: { deviceType: 'desktop', userAgent: 'Mozilla/5.0 Chrome' }
    },
    {
      userId: coachUser.id,
      sessionId: 'coach-session-1',
      action: 'LOGIN',
      resourceType: 'AUTH',
      resourceId: null,
      metadata: { deviceType: 'mobile', userAgent: 'Mozilla/5.0 Safari' }
    },
    {
      userId: playerUser.id,
      sessionId: 'player-session-1',
      action: 'VIEW',
      resourceType: 'ARTICLE',
      resourceId: article1.id,
      metadata: { zone: 'READ', template: 'classic' }
    },
    {
      userId: parentUser.id,
      sessionId: 'parent-session-1',
      action: 'VIEW',
      resourceType: 'ARTICLE',
      resourceId: null,
      metadata: { query: 'детски футбол', results: 5 }
    },
    {
      userId: freeUser.id,
      sessionId: 'free-session-1',
      action: 'READ',
      resourceType: 'ARTICLE',
      resourceId: article10.id,
      metadata: { zone: 'read', duration: 180 }
    }
  ]

  await prisma.userActivity.createMany({
    data: activitiesData
  })

  // Create refresh tokens for some users (simulate active sessions)
  const refreshTokensData = [
    {
      token: 'refresh_token_admin_123',
      userId: adminUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceName: 'Chrome Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      isRevoked: false
    },
    {
      token: 'refresh_token_coach_456',
      userId: coachUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceName: 'Safari Mobile',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      isRevoked: false
    },
    {
      token: 'refresh_token_test_789',
      userId: testUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceName: 'Firefox Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko',
      isRevoked: false
    }
  ]

  await prisma.refreshToken.createMany({
    data: refreshTokensData
  })

  console.log('✅ Database seeded successfully with comprehensive data!')
  console.log('\n📊 CREATED:')
  console.log('- 3 Article Templates (Read Zone, Coach Zone, Tactical Analysis)')
  console.log('- 6 Users (Admin, Coach, Player, Parent, Free User, Test User)')
  console.log('- 3 Article Series (Conte Philosophy, Modern Formations, Technique Basics)')
  console.log('- 10 Articles (8 free, 1 premium, 1 cross-zone)')
  console.log('- Multiple zone assignments (READ + COACH visibility)')
  console.log(`- ${viewsData.length} Article views with realistic analytics`)
  console.log('- 5 User activities for tracking')
  console.log('- 3 Active refresh tokens')
  
  console.log('\n🔐 LOGIN CREDENTIALS:')
  console.log('👨‍💼 Admin: admin@footballzone.bg / admin123')
  console.log('🏆 Coach: coach@footballzone.bg / coach123')
  console.log('⚽ Player: player@footballzone.bg / player123')
  console.log('👩‍👧‍👦 Parent: parent@footballzone.bg / parent123')
  console.log('👤 Free User: user@footballzone.bg / user123')
  console.log('🧪 Test User: test@example.com / TestPassword123!')

  console.log('\n📝 ARTICLE CATEGORIES:')
  console.log('- GENERAL: Basic football rules, history, player analysis')
  console.log('- TACTICS: Formation analysis, tactical philosophy')
  console.log('- TRAINING: Preseason planning, methodology, periodization')
  console.log('- TECHNIQUE: Technical training, skill development')
  console.log('- PSYCHOLOGY: Mental preparation, team building')
  console.log('- CONDITIONING: Nutrition, fitness, performance')

  console.log('\n🏟️ ZONE COVERAGE:')
  console.log('- READ ZONE: 6 articles (general football content)')
  console.log('- COACH ZONE: 7 articles (professional training content)')
  console.log('- Cross-zone articles: 3 (visible in both READ and COACH)')
  console.log('- Premium content: 1 article (time-based release)')

  console.log('\n🚀 ALL WORKING PATHS NOW HAVE DATA:')
  console.log('✅ Authentication system (6 user roles)')
  console.log('✅ Read Zone articles (general football content)')
  console.log('✅ Coach Zone articles (professional content)')
  console.log('✅ Premium content management')
  console.log('✅ Article series and templates')
  console.log('✅ Analytics and view tracking')
  console.log('✅ User activity logging')
  console.log('✅ Multi-zone article visibility')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })