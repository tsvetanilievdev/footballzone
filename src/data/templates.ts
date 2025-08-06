import { ArticleTemplate } from '@/types'

// Predefined template configurations
export const articleTemplates: ArticleTemplate[] = [
  // Read Zone Templates
  {
    id: 'read-minimal',
    name: 'Минимален четец',
    description: 'Кратък текст с основна снимка - за бързо четене',
    category: 'read',
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