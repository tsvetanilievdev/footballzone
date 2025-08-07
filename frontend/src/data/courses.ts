import { Course } from '@/types'

export const allCourses: Course[] = [
  // Coach Course 1
  {
    id: 'coach-tactical-mastery',
    title: 'Тактическо майсторство - Модерни футболни формации',
    slug: 'tactical-mastery-modern-formations',
    description: 'Изучете най-модерните тактически подходи и формации в съвременния футбол.',
    longDescription: `
      Този курс е предназначен за футболни треньори, които искат да подобрят своите тактически знания и да научат как да прилагат модерни футболни формации. 
      
      Ще разгледаме различни тактически системи като 4-3-3, 3-5-2, 4-2-3-1 и много други. Ще анализираме как най-успешните отбори в света използват тези формации и как можете да ги адаптирате към вашия отбор.
      
      Курсът включва практически упражнения, видео анализи на мачове и интерактивни сесии за планиране на тренировки.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    instructor: {
      name: 'Проф. Димитър Петров',
      bio: 'Бивш национален отбор на България, треньор с над 20 години опит в професионалния футбол.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      credentials: [
        'UEFA Pro лиценз',
        'Магистър по спортни науки',
        'Бивш треньор на ЦСКА София',
        'Консултант в БФС'
      ]
    },
    category: 'coach',
    level: 'intermediate',
    duration: '8 седмици',
    lessonsCount: 24,
    studentsCount: 187,
    rating: 4.8,
    reviews: 42,
    price: 299,
    currency: 'BGN',
    isPremium: true,
    isPopular: true,
    isBestseller: false,
    tags: ['тактика', 'формации', 'модерен футбол', 'стратегия'],
    skills: [
      'Анализ на модерни футболни формации',
      'Създаване на тактически план за мач',
      'Адаптиране на тактиката според противника',
      'Използване на видео анализ за подобрение на играта',
      'Управление на различни игрови ситуации'
    ],
    requirements: [
      'Основни знания по футбол',
      'Опит като треньор (желателно)',
      'Достъп до интернет за онлайн лекции'
    ],
    targetAudience: [
      'Футболни треньори на всички нива',
      'Бивши професионални играчи',
      'Студенти по спортни науки',
      'Футболни ентусиасти'
    ],
    curriculum: [
      {
        id: 'lesson-1',
        title: 'Въведение в модерната тактика',
        description: 'История и еволюция на футболните формации',
        duration: 45,
        type: 'video',
        content: 'https://example.com/video/intro-modern-tactics',
        isPreview: true,
        order: 1
      },
      {
        id: 'lesson-2',
        title: 'Формация 4-3-3: Принципи и приложение',
        description: 'Подробен анализ на формацията 4-3-3',
        duration: 60,
        type: 'video',
        content: 'https://example.com/video/4-3-3-formation',
        isPreview: false,
        order: 2
      },
      {
        id: 'lesson-3',
        title: 'Практически упражнения за 4-3-3',
        description: 'Тренировъчни методи за усвояване на формацията',
        duration: 40,
        type: 'assignment',
        content: 'Създайте тренировъчен план за 90 минути',
        isPreview: false,
        order: 3
      }
    ],
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
    status: 'published',
    enrollmentCount: 187,
    completionRate: 78
  },

  // Coach Course 2
  {
    id: 'coach-youth-development',
    title: 'Развитие на младите футболисти - Методики и подходи',
    slug: 'youth-development-methods',
    description: 'Научете как да развивате техниката и менталността на младите играчи.',
    longDescription: `
      Специализиран курс за треньори, работещи с деца и юноши. Фокусът е върху правилното физическо и ментално развитие на младите футболисти.
      
      Ще разгледаме различни възрастови групи, специфичните им нужди и как да адаптираме тренировките според тях. Курсът покрива и важни теми като детска психология, мотивация и предотвратяване на травми.
      
      Включени са реални примери от успешни младежки академии и интервюта с експерти в областта.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop',
    instructor: {
      name: 'Мария Стоянова',
      bio: 'Специалист по детско развитие и футболен треньор в академията на Левски София.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c234bf?w=150&h=150&fit=crop&crop=face',
      credentials: [
        'UEFA B лиценз',
        'Магистър по детска психология',
        '15 години опит с младежки отбори',
        'Сертифициран специалист по детско развитие'
      ]
    },
    category: 'coach',
    level: 'all',
    duration: '6 седмици',
    lessonsCount: 18,
    studentsCount: 234,
    rating: 4.9,
    reviews: 67,
    price: 249,
    currency: 'BGN',
    isPremium: true,
    isPopular: false,
    isBestseller: true,
    tags: ['младежи', 'развитие', 'детска психология', 'методики'],
    skills: [
      'Планиране на тренировки за различни възрастови групи',
      'Мотивационни техники за деца',
      'Предотвратяване на травми при младите играчи',
      'Развитие на техническите умения',
      'Работа с родители и младежки отбори'
    ],
    requirements: [
      'Любов към работата с деца',
      'Основни познания по футбол',
      'Търпение и отдаденост'
    ],
    targetAudience: [
      'Треньори на младежки отбори',
      'Родители на млади футболисти',
      'Учители по физическо възпитание',
      'Футболни координатори'
    ],
    curriculum: [
      {
        id: 'youth-lesson-1',
        title: 'Възрастови особености в футбола',
        description: 'Физическо и ментално развитие по възрастови групи',
        duration: 50,
        type: 'video',
        content: 'https://example.com/video/youth-development-basics',
        isPreview: true,
        order: 1
      },
      {
        id: 'youth-lesson-2',
        title: 'Мотивация и психология при децата',
        description: 'Как да мотивираме младите играчи',
        duration: 45,
        type: 'video',
        content: 'https://example.com/video/youth-motivation',
        isPreview: false,
        order: 2
      }
    ],
    publishedAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
    status: 'published',
    enrollmentCount: 234,
    completionRate: 85
  },

  // Player Course 1
  {
    id: 'player-technical-skills',
    title: 'Техническо усъвършенстване - От основи до майстторство',
    slug: 'technical-skills-mastery',
    description: 'Подобрете своята техника с професионални упражнения и методи.',
    longDescription: `
      Този курс е създаден специално за играчи, които искат да подобрят своите технически умения. От основни движения до сложни трикове - всичко е обяснено стъпка по стъпка.
      
      Ще научите как правилно да контролирате топката, как да подавате точно, как да стреляте ефективно и как да се движите с топка. Курсът включва над 50 различни упражнения за всяка техническа елемент.
      
      Всяко упражнение е демонстрирано от професионални играчи и е обяснено от експерти. Включени са и съвети за самостоятелна тренировка у дома.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    instructor: {
      name: 'Христо Янев',
      bio: 'Бивш играч на националния отбор на България, специалист по техническа подготовка.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      credentials: [
        'Бивш играч на Левски и ЦСКА',
        '73 мача за националния отбор',
        'Специалист по техническа подготовка',
        'UEFA A лиценз'
      ]
    },
    category: 'player',
    level: 'all',
    duration: '10 седмици',
    lessonsCount: 30,
    studentsCount: 456,
    rating: 4.7,
    reviews: 128,
    price: 199,
    currency: 'BGN',
    isPremium: true,
    isPopular: true,
    isBestseller: false,
    tags: ['техника', 'умения', 'тренировка', 'подобрение'],
    skills: [
      'Перфектен контрол на топката с двата крака',
      'Точни подавания на кратки и дълги разстояния',
      'Ефективно стреляне с различни техники',
      'Дриблинг и движение с топка',
      'Въздушна игра и удари с глава'
    ],
    requirements: [
      'Основни познания по футбол',
      'Достъп до футболна топка',
      'Желание за подобрение'
    ],
    targetAudience: [
      'Аматьорски играчи',
      'Полупрофесионални футболисти',
      'Юноши, които искат да се развиват',
      'Любители на футбола'
    ],
    curriculum: [
      {
        id: 'tech-lesson-1',
        title: 'Основи на контрола на топката',
        description: 'Правилна постановка и първо докосване',
        duration: 35,
        type: 'video',
        content: 'https://example.com/video/ball-control-basics',
        isPreview: true,
        order: 1
      },
      {
        id: 'tech-lesson-2',
        title: 'Техника на подаването',
        description: 'Кратки и дълги подавания',
        duration: 40,
        type: 'video',
        content: 'https://example.com/video/passing-technique',
        isPreview: false,
        order: 2
      }
    ],
    publishedAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10'),
    status: 'published',
    enrollmentCount: 456,
    completionRate: 72
  }
]

export const getCoachesCourses = (): Course[] => {
  return allCourses.filter(course => course.category === 'coach')
}

export const getPlayersCourses = (): Course[] => {
  return allCourses.filter(course => course.category === 'player')
}

export const getAllCourses = (): Course[] => {
  return allCourses
}

export const getCourseBySlug = (slug: string): Course | undefined => {
  return allCourses.find(course => course.slug === slug)
}

export const getFeaturedCourses = (): Course[] => {
  return allCourses.filter(course => course.isPopular || course.isBestseller).slice(0, 3)
}