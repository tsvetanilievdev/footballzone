import { ArticleTemplate } from '@/types'

// Predefined template configurations
export const articleTemplates: ArticleTemplate[] = [
  // Read Zone Templates
  {
    id: 'read-minimal',
    name: 'Минимален четец',
    description: 'Кратък текст с основна снимка - за бързо четене',
    category: 'read',
    defaultContent: `
      <h2>Кратко заглавие</h2>
      <p>Въведете кратко описание на темата. Този темплейт е идеален за бързи новини и кратки обобщения.</p>
      
      <h3>Ключови точки</h3>
      <ul>
        <li>Първа важна точка</li>
        <li>Втора важна точка</li>
        <li>Трета важна точка</li>
      </ul>
      
      <p><strong>Заключение:</strong> Кратко резюме на основната идея.</p>
    `,
    settings: {
      textLength: 'short',
      allowVideos: false,
      allowImages: true,
      maxImages: 3,
      imageLayout: 'single',
      allowDownloads: false,
      allowLinks: true,
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'read-standard',
    name: 'Стандартен четец',
    description: 'Средна дължина текст с галерия от снимки',
    category: 'read',
    defaultContent: `
      <h2>Заглавие на статията</h2>
      <p>Въведение в темата. Обяснете защо тази тема е важна и какво ще научат читателите.</p>
      
      <h3>Основно съдържание</h3>
      <p>Развийте основната идея с подробности и примери. Този раздел може да съдържа няколко параграфа.</p>
      
      <h3>Практически примери</h3>
      <p>Добавете конкретни примери или случаи, които илюстрират основните точки.</p>
      
      <h3>Заключение</h3>
      <p>Обобщете основните идеи и дайте насоки за следващи стъпки или размисъл.</p>
      
      <blockquote>
        <p><em>"Важен цитат или мисъл, която подчертава основната идея на статията."</em></p>
      </blockquote>
    `,
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 2,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 8,
      imageLayout: 'gallery',
      allowDownloads: true,
      downloadTypes: ['pdf'],
      allowLinks: true,
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'read-longform',
    name: 'Дълга статия',
    description: 'Подробен анализ с богато мултимедийно съдържание',
    category: 'read',
    defaultContent: `
      <h1>Заглавие на дългата статия</h1>
      
      <h2>Въведение</h2>
      <p>Подробно въведение в темата. Обяснете контекста, важността и структурата на статията.</p>
      
      <h2>Исторически контекст</h2>
      <p>Развийте историческия фон и контекста на темата. Това помага на читателите да разберат защо темата е важна.</p>
      
      <h2>Основен анализ</h2>
      <p>Проведете задълбочен анализ на темата. Използвайте данни, примери и доказателства за да подкрепите вашите аргументи.</p>
      
      <h3>Подраздел 1</h3>
      <p>Детайлен анализ на първия аспект от темата.</p>
      
      <h3>Подраздел 2</h3>
      <p>Детайлен анализ на втория аспект от темата.</p>
      
      <h2>Практически приложения</h2>
      <p>Обяснете как теорията се прилага в практиката. Дайте конкретни примери и случаи.</p>
      
      <h2>Бъдещи перспективи</h2>
      <p>Разгледайте бъдещите тенденции и възможности в тази област.</p>
      
      <h2>Заключение</h2>
      <p>Обобщете основните точки и дайте насоки за следващи стъпки или размисъл.</p>
      
      <blockquote>
        <p><em>"Мощна цитата, която обобщава основната идея на статията."</em></p>
      </blockquote>
    `,
    settings: {
      textLength: 'extra-long',
      allowVideos: true,
      maxVideos: 5,
      videoTypes: ['youtube', 'vimeo', 'embedded'],
      allowImages: true,
      maxImages: 15,
      imageLayout: 'inline',
      allowDownloads: true,
      downloadTypes: ['pdf', 'doc', 'excel'],
      allowLinks: true,
      customSections: [
        {
          id: 'summary',
          name: 'Обобщение',
          type: 'text',
          required: true
        },
        {
          id: 'key-points',
          name: 'Ключови точки',
          type: 'stats',
          required: false
        },
        {
          id: 'timeline',
          name: 'Времева линия',
          type: 'timeline',
          required: false
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'spacious',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'read-media-rich',
    name: 'Медия-фокусиран',
    description: 'Комбинация от видео, снимки и кратък текст',
    category: 'read',
    settings: {
      textLength: 'short',
      allowVideos: true,
      maxVideos: 3,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 10,
      imageLayout: 'grid',
      allowDownloads: true,
      downloadTypes: ['pdf', 'image'],
      allowLinks: true,
      customSections: [
        {
          id: 'video-gallery',
          name: 'Видео галерия',
          type: 'media',
          required: false,
          maxItems: 3
        },
        {
          id: 'photo-story',
          name: 'Фото разказ',
          type: 'media',
          required: false,
          maxItems: 6
        }
      ],
      styling: {
        layout: 'grid',
        fontSize: 'medium',
        spacing: 'compact',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          text: '#374151'
        }
      }
    }
  },
  // Universal Templates
  {
    id: 'universal-classic',
    name: 'Класически универсален',
    description: 'Традиционен layout - подходящ за всички зони',
    category: 'universal',
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 2,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 5,
      imageLayout: 'single',
      allowDownloads: true,
      downloadTypes: ['pdf'],
      allowLinks: true,
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#6366f1',
          secondary: '#4338ca',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'universal-modern',
    name: 'Модерен универсален',
    description: 'Съвременен дизайн с градиенти и анимации',
    category: 'universal',
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 3,
      videoTypes: ['youtube', 'vimeo', 'embedded'],
      allowImages: true,
      maxImages: 8,
      imageLayout: 'gallery',
      allowDownloads: true,
      downloadTypes: ['pdf', 'doc'],
      allowLinks: true,
      customSections: [
        {
          id: 'highlight',
          name: 'Акценти',
          type: 'quote',
          required: false
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'large',
        spacing: 'spacious',
        colors: {
          primary: '#f59e0b',
          secondary: '#d97706',
          text: '#374151'
        }
      }
    }
  },
  // Coach Zone Templates
  {
    id: 'coach-tactical',
    name: 'Тактически анализ',
    description: 'Специализиран за тактически разбори с диаграми',
    category: 'coach',
    defaultContent: `
      <h2>🎯 Тактически принципи</h2>
      <p>Обяснете основните тактически принципи, които ще бъдат анализирани в тази статия.</p>
      
      <h2>⚡ Практично приложение</h2>
      <p>Обяснете как се прилагат тези принципи в реална игра. Дайте конкретни примери от мачове.</p>
      
      <h2>🔑 Ключови моменти</h2>
      <ul>
        <li><strong>Първа ключова точка:</strong> Детайлно обяснение</li>
        <li><strong>Втора ключова точка:</strong> Детайлно обяснение</li>
        <li><strong>Трета ключова точка:</strong> Детайлно обяснение</li>
      </ul>
      
      <h2>🏃 Упражнения за практикуване</h2>
      <p>Опишете конкретни упражнения, които треньорите могат да използват за практикуване на тези принципи.</p>
      
      <h3>Упражнение 1: [Име на упражнението]</h3>
      <p>Описание на упражнението, необходимите материали и продължителността.</p>
      
      <h3>Упражнение 2: [Име на упражнението]</h3>
      <p>Описание на упражнението, необходимите материали и продължителността.</p>
      
      <h2>📊 Анализ на резултатите</h2>
      <p>Обяснете как да се оценява ефективността на прилагането на тези тактики.</p>
      
      <blockquote>
        <p><em>"Важен тактически принцип или мисъл от известен треньор."</em></p>
      </blockquote>
    `,
    settings: {
      textLength: 'long',
      allowVideos: true,
      maxVideos: 4,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 12,
      imageLayout: 'inline',
      allowDownloads: true,
      downloadTypes: ['pdf', 'doc'],
      allowLinks: true,
      customSections: [
        {
          id: 'formation',
          name: 'Формация',
          type: 'media',
          required: true
        },
        {
          id: 'analysis',
          name: 'Анализ',
          type: 'text',
          required: true
        },
        {
          id: 'statistics',
          name: 'Статистики',
          type: 'stats',
          required: false
        }
      ],
      styling: {
        layout: 'two-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'coach-training',
    name: 'Тренировъчна програма',
    description: 'За упражнения и тренировъчни планове',
    category: 'coach',
    defaultContent: `
      <h2>🎯 Цели на тренировката</h2>
      <p>Опишете конкретните цели на тренировката и какво се очаква да постигнат играчите.</p>
      
      <h2>🛠️ Необходимо оборудване</h2>
      <ul>
        <li>Топки</li>
        <li>Конуси</li>
        <li>Жилетки</li>
        <li>Врати (ако е необходимо)</li>
      </ul>
      
      <h2>🏃 Структура на тренировката</h2>
      
      <h3>Затопляне (10-15 минути)</h3>
      <p>Описание на затоплянето, включително динамични разтягания и леки упражнения.</p>
      
      <h3>Основна част (30-45 минути)</h3>
      <p>Детайлно описание на основните упражнения и техники.</p>
      
      <h4>Упражнение 1: [Име на упражнението]</h4>
      <p>Описание, продължителност и ключови точки за изпълнение.</p>
      
      <h4>Упражнение 2: [Име на упражнението]</h4>
      <p>Описание, продължителност и ключови точки за изпълнение.</p>
      
      <h3>Заключение (10-15 минути)</h3>
      <p>Заключителни упражнения, разтягане и обратна връзка.</p>
      
      <h2>📝 Ключови точки за треньорите</h2>
      <ul>
        <li>Важна бележка за изпълнението</li>
        <li>Често срещани грешки и как да се избегнат</li>
        <li>Модификации за различни възрастови групи</li>
      </ul>
      
      <h2>📊 Оценка на прогреса</h2>
      <p>Обяснете как да се оценява прогреса на играчите и какво да се следи.</p>
    `,
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 6,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 10,
      imageLayout: 'grid',
      allowDownloads: true,
      downloadTypes: ['pdf', 'doc', 'excel'],
      allowLinks: true,
      customSections: [
        {
          id: 'warm-up',
          name: 'Затопляне',
          type: 'text',
          required: true
        },
        {
          id: 'main-exercises',
          name: 'Основни упражнения',
          type: 'media',
          required: true,
          maxItems: 5
        },
        {
          id: 'cool-down',
          name: 'Заключение',
          type: 'text',
          required: true
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#059669',
          secondary: '#065f46',
          text: '#374151'
        }
      }
    }
  },
  // New Read Zone Templates - Extended Collection
  {
    id: 'read-text-focused',
    name: 'Текст-фокусиран',
    description: 'Акцент върху дълъг, качествен текст с минимални медии',
    category: 'read',
    settings: {
      textLength: 'extra-long',
      allowVideos: false,
      allowImages: true,
      maxImages: 3,
      imageLayout: 'single',
      allowDownloads: true,
      downloadTypes: ['pdf', 'doc'],
      allowLinks: true,
      customSections: [
        {
          id: 'introduction',
          name: 'Въведение',
          type: 'text',
          required: true
        },
        {
          id: 'main-content',
          name: 'Основно съдържание',
          type: 'text',
          required: true
        },
        {
          id: 'conclusion',
          name: 'Заключение',
          type: 'text',
          required: true
        },
        {
          id: 'author-note',
          name: 'Бележка от автора',
          type: 'quote',
          required: false
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'large',
        spacing: 'spacious',
        colors: {
          primary: '#1f2937',
          secondary: '#374151',
          text: '#111827'
        }
      }
    }
  },
  {
    id: 'read-micro',
    name: 'Микро-статия',
    description: 'Компактна статия за бързо консумиране - идеална за мобилни',
    category: 'read',
    settings: {
      textLength: 'short',
      allowVideos: true,
      maxVideos: 1,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 2,
      imageLayout: 'single',
      allowDownloads: false,
      allowLinks: true,
      customSections: [
        {
          id: 'quick-facts',
          name: 'Бързи факти',
          type: 'stats',
          required: false,
          maxItems: 3
        },
        {
          id: 'takeaway',
          name: 'Основен извод',
          type: 'quote',
          required: true
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'compact',
        colors: {
          primary: '#10b981',
          secondary: '#059669',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'read-interactive',
    name: 'Интерактивен',
    description: 'Ангажиращо съдържание с възможности за дискусия и взаимодействие',
    category: 'read',
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 3,
      videoTypes: ['youtube', 'vimeo', 'embedded'],
      allowImages: true,
      maxImages: 8,
      imageLayout: 'gallery',
      allowDownloads: true,
      downloadTypes: ['pdf', 'image'],
      allowLinks: true,
      customSections: [
        {
          id: 'poll',
          name: 'Анкета',
          type: 'stats',
          required: false,
          maxItems: 5
        },
        {
          id: 'discussion-prompt',
          name: 'Въпрос за дискусия',
          type: 'quote',
          required: false
        },
        {
          id: 'social-share',
          name: 'Социални връзки',
          type: 'links',
          required: false
        },
        {
          id: 'related-content',
          name: 'Свързано съдържание',
          type: 'links',
          required: false,
          maxItems: 5
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#3b82f6',
          secondary: '#2563eb',
          text: '#374151'
        }
      }
    }
  },
  // Player Zone Templates
  {
    id: 'player-skills',
    name: 'Развитие на умения',
    description: 'Фокус върху техническо развитие и индивидуални умения',
    category: 'player',
    defaultContent: `
      <h2>⚽ Умение за фокус</h2>
      <p>Обяснете защо това умение е важно и как влияе на играта на футболиста.</p>
      
      <h2>🎯 Технически елементи</h2>
      <p>Разбийте умението на основните технически елементи, които трябва да се усъвършенстват.</p>
      
      <h3>Елемент 1: [Име на елемента]</h3>
      <p>Детайлно описание на първия технически елемент.</p>
      
      <h3>Елемент 2: [Име на елемента]</h3>
      <p>Детайлно описание на втория технически елемент.</p>
      
      <h2>🏃 Упражнения за практика</h2>
      <p>Опишете конкретни упражнения, които играчите могат да практикуват самостоятелно.</p>
      
      <h3>Упражнение 1: [Име на упражнението]</h3>
      <p>Описание, продължителност и ключови точки за изпълнение.</p>
      
      <h3>Упражнение 2: [Име на упражнението]</h3>
      <p>Описание, продължителност и ключови точки за изпълнение.</p>
      
      <h2>📈 Проследяване на прогреса</h2>
      <p>Обяснете как играчите могат да проследяват своя прогрес и да се мотивират.</p>
      
      <h2>💡 Съвети от професионалисти</h2>
      <blockquote>
        <p><em>"Важен съвет от известен футболист или треньор относно това умение."</em></p>
      </blockquote>
      
      <h2>🎯 Цели за развитие</h2>
      <ul>
        <li>Краткосрочна цел (1-2 седмици)</li>
        <li>Средносрочна цел (1-2 месеца)</li>
        <li>Дългосрочна цел (3-6 месеца)</li>
      </ul>
    `,
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 4,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 8,
      imageLayout: 'grid',
      allowDownloads: true,
      downloadTypes: ['pdf', 'doc'],
      allowLinks: true,
      customSections: [
        {
          id: 'skill-breakdown',
          name: 'Разбивка на уменията',
          type: 'text',
          required: true
        },
        {
          id: 'practice-drills',
          name: 'Упражнения за практика',
          type: 'media',
          required: true,
          maxItems: 5
        },
        {
          id: 'progress-tracking',
          name: 'Проследяване на прогреса',
          type: 'stats',
          required: false
        }
      ],
      styling: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#8b5cf6',
          secondary: '#7c3aed',
          text: '#374151'
        }
      }
    }
  },
  {
    id: 'player-fitness',
    name: 'Физическа подготовка',
    description: 'Тренировки и упражнения за подобряване на физическата форма',
    category: 'player',
    settings: {
      textLength: 'medium',
      allowVideos: true,
      maxVideos: 6,
      videoTypes: ['youtube', 'vimeo'],
      allowImages: true,
      maxImages: 10,
      imageLayout: 'grid',
      allowDownloads: true,
      downloadTypes: ['pdf', 'excel'],
      allowLinks: true,
      customSections: [
        {
          id: 'workout-plan',
          name: 'План за тренировка',
          type: 'text',
          required: true
        },
        {
          id: 'exercise-videos',
          name: 'Видео упражнения',
          type: 'media',
          required: true,
          maxItems: 6
        },
        {
          id: 'nutrition-tips',
          name: 'Хранителни съвети',
          type: 'text',
          required: false
        }
      ],
      styling: {
        layout: 'two-column',
        fontSize: 'medium',
        spacing: 'normal',
        colors: {
          primary: '#f97316',
          secondary: '#ea580c',
          text: '#374151'
        }
      }
    }
  }
]

// Helper functions
export function getTemplatesByCategory(category: string): ArticleTemplate[] {
  return articleTemplates.filter(template => 
    template.category === category || template.category === 'universal'
  )
}

export function getTemplateById(id: string): ArticleTemplate | undefined {
  return articleTemplates.find(template => template.id === id)
}

export function validateArticleAgainstTemplate(
  article: { 
    title: string; 
    content: string; 
    videos?: unknown[]; 
    images?: unknown[]; 
    downloads?: unknown[] 
  }, 
  template: ArticleTemplate
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check text length
  const wordCount = article.content?.split(' ').length || 0
  const { textLength } = template.settings
  
  if (textLength === 'short' && wordCount > 300) {
    errors.push('Текстът е твърде дълъг за избрания темплейт')
  } else if (textLength === 'medium' && (wordCount < 200 || wordCount > 800)) {
    errors.push('Дължината на текста не отговаря на темплейта')
  } else if (textLength === 'long' && wordCount < 600) {
    errors.push('Текстът е твърде кратък за избрания темплейт')
  }

  // Check videos
  if (!template.settings.allowVideos && article.videos && article.videos.length > 0) {
    errors.push('Темплейтът не поддържа видео съдържание')
  } else if (template.settings.maxVideos && article.videos && article.videos.length > template.settings.maxVideos) {
    errors.push(`Максимум ${template.settings.maxVideos} видеа са разрешени`)
  }

  // Check images
  if (!template.settings.allowImages && article.images && article.images.length > 0) {
    errors.push('Темплейтът не поддържа допълнителни снимки')
  } else if (template.settings.maxImages && article.images && article.images.length > template.settings.maxImages) {
    errors.push(`Максимум ${template.settings.maxImages} снимки са разрешени`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}