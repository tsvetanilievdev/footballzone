import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default article templates
  const readTemplate = await prisma.articleTemplate.create({
    data: {
      name: 'Comprehensive Article',
      description: 'Long-form article with rich media support',
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
            primary: '#1a365d',
            secondary: '#2d3748',
            text: '#374151'
          }
        }
      }
    }
  })

  const coachTemplate = await prisma.articleTemplate.create({
    data: {
      name: 'Training Article',
      description: 'Coach-focused training content',
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
        downloadTypes: ['pdf', 'doc'],
        allowLinks: true,
        styling: {
          layout: 'single-column',
          fontSize: 'medium',
          spacing: 'normal',
          colors: {
            primary: '#1a365d',
            secondary: '#2d3748',
            text: '#374151'
          }
        }
      }
    }
  })

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@footballzone.bg',
      passwordHash: await bcrypt.hash('admin123', 12),
      name: 'Администратор',
      role: 'ADMIN',
      emailVerified: true,
    }
  })

  // Create test users
  const coachUser = await prisma.user.create({
    data: {
      email: 'coach@footballzone.bg',
      passwordHash: await bcrypt.hash('coach123', 12),
      name: 'Петър Стоилов',
      role: 'COACH',
      emailVerified: true,
    }
  })

  // Create Antonio Conte article series
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

  // Create articles from frontend mock data
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

  // Create article zones
  await prisma.articleZone.createMany({
    data: [
      { articleId: article1.id, zone: 'READ', visible: true },
      { articleId: article1.id, zone: 'coach', visible: true }
    ]
  })

  const article2 = await prisma.article.create({
    data: {
      title: 'Предсезонната подготовка на Антонио Конте – Структура, цели и натоварване',
      slug: 'preseason-conte-structure',
      excerpt: 'Разбери как Антонио Конте структурира своята подготовка – физическо натоварване, тактически блокове и военна дисциплина.',
      content: `
        <p>При Конте е като в армията – спиш, ядеш и тренираш. Как да структурираме подготовка, която изгражда тяло, тактика и дух? Предсезонната подготовка при Конте не е просто физическа кондиция – това е трансформация на играчите в машина за победи.</p>

        <p>Ще разгледаме макроцикъл, дневна структура и методи, които използва Конте за да създаде отбори, които доминират през целия сезон.</p>

        <h2>📅 Макроцикъл: От натоварване към автоматизъм</h2>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
      authorId: coachUser.id,
      category: 'TRAINING',
      tags: ['Конте', 'Предсезонна подготовка', 'Натоварване', 'Макроцикъл'],
      publishedAt: new Date('2024-11-25'),
      readTime: 7,
      isPremium: false,
      status: 'PUBLISHED',
      templateId: coachTemplate.id,
      seriesId: conteSeries.id,
      seriesPart: 2
    }
  })

  await prisma.articleZone.createMany({
    data: [
      { articleId: article2.id, zone: 'READ', visible: true },
      { articleId: article2.id, zone: 'coach', visible: true }
    ]
  })

  // Create some premium content
  const premiumArticle = await prisma.article.create({
    data: {
      title: 'Модерна тактическа схема 4-3-3: Детайли и приложение',
      slug: 'modern-4-3-3-formation-details',
      excerpt: 'Подробен анализ на една от най-използваните формации в съвременния футбол и как да я приложите.',
      content: `
        <h2>Въведение в 4-3-3</h2>
        <p>Формацията 4-3-3 се счита за една от най-балансираните в модерния футбол. Тя предлага отлична комбинация между атакуване и защита.</p>
        
        <h2>Основна структура</h2>
        <p>Детайлен анализ на всяка позиция и роля...</p>
      `,
      featuredImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop',
      authorId: coachUser.id,
      category: 'TACTICS',
      tags: ['4-3-3', 'формация', 'тактика', 'схема', 'позиции'],
      publishedAt: new Date('2024-01-10'),
      readTime: 12,
      isPremium: true,
      premiumReleaseDate: new Date('2024-02-10'), // Becomes free after 1 month
      status: 'PUBLISHED',
      templateId: coachTemplate.id
    }
  })

  await prisma.articleZone.create({
    data: {
      articleId: premiumArticle.id,
      zone: 'coach',
      visible: true,
      requiresSubscription: true,
      freeAfterDate: new Date('2024-02-10')
    }
  })

  // Create some analytics data
  await prisma.articleView.create({
    data: {
      articleId: article1.id,
      userId: coachUser.id,
      sessionId: 'session-123',
      viewDuration: 240,
      completionPercent: 85,
      referrer: 'https://google.com',
      deviceType: 'desktop',
      ipAddress: '127.0.0.1'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('\nCreated:')
  console.log('- 2 Article Templates')
  console.log('- 2 Users (admin@footballzone.bg, coach@footballzone.bg)')
  console.log('- 1 Article Series (Antonio Conte Philosophy)')
  console.log('- 3 Articles (2 free, 1 premium)')
  console.log('- Article zone assignments')
  console.log('- Sample analytics data')
  
  console.log('\nLogin credentials:')
  console.log('Admin: admin@footballzone.bg / admin123')
  console.log('Coach: coach@footballzone.bg / coach123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })