import { Template, TemplateStatistics } from '@/types/templates'

// Unified template data source - Single source of truth
export const mockTemplates: (Template & { stats: TemplateStatistics })[] = [
  {
    id: 'tactical-analysis',
    name: 'Тактически анализ',
    slug: 'tactical-analysis',
    description: 'Професионален темплейт за задълбочени тактически анализи с диаграми и схеми',
    category: 'coach',
    version: '2.1.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    isActive: true,
    allowedZones: ['coach'], // Coach zone
    requiredPermissions: [],
    layout: {
      id: 'tactical-layout',
      name: 'Tactical Layout',
      description: 'Two-column layout with sidebar',
      preview: '/images/templates/tactical-layout.png',
      structure: {
        header: true,
        sidebar: true,
        footer: true,
        columns: 2,
        maxWidth: 'xl'
      }
    },
    style: {
      id: 'tactical-style',
      name: 'Professional Green',
      colors: {
        primary: '#059669',
        secondary: '#065f46',
        accent: '#10b981',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'lg',
        margin: 'md'
      },
      borders: {
        radius: 'md',
        width: 'thin'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 5,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 10,
        maxSize: 3
      },
      video: {
        enabled: true,
        platforms: ['youtube', 'vimeo'],
        maxVideos: 5
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf', 'doc'],
        maxSize: 10
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/tactical-thumb.png',
      screenshots: ['/images/templates/tactical-1.png', '/images/templates/tactical-2.png'],
      demoUrl: '/demo/tactical-analysis'
    },
    stats: {
      templateId: 'tactical-analysis',
      usageCount: 45,
      zoneBreakdown: { 'coach': 35, 'read': 8, 'admin': 2 },
      averageRating: 4.8,
      lastUsed: new Date('2024-01-15'),
      popularFields: ['main-content', 'tactical-diagram', 'video-analysis']
    }
  },
  {
    id: 'training-session',
    name: 'Тренировъчна сесия',
    slug: 'training-session',
    description: 'Интерактивен темплейт за тренировъчни планове с чеклисти и прогрес',
    category: 'coach',
    version: '1.5.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12'),
    isActive: true,
    allowedZones: ['coach', 'player'],
    requiredPermissions: [],
    layout: {
      id: 'training-layout',
      name: 'Training Layout',
      description: 'Single column with interactive elements',
      preview: '/images/templates/training-layout.png',
      structure: {
        header: true,
        sidebar: false,
        footer: true,
        columns: 1,
        maxWidth: 'lg'
      }
    },
    style: {
      id: 'training-style',
      name: 'Active Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#1d4ed8',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'normal'
      },
      spacing: {
        padding: 'md',
        margin: 'md'
      },
      borders: {
        radius: 'lg',
        width: 'medium'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: false
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 3,
        allowedFormats: ['jpg', 'png'],
        aspectRatio: '4:3'
      },
      gallery: {
        enabled: false,
        maxImages: 0,
        maxSize: 0
      },
      video: {
        enabled: true,
        platforms: ['youtube'],
        maxVideos: 3
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf'],
        maxSize: 5
      }
    },
    features: {
      comments: true,
      likes: false,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: false,
      tableOfContents: false,
      estimatedReadTime: true,
      progressIndicator: false
    },
    preview: {
      thumbnail: '/images/templates/training-thumb.png',
      screenshots: ['/images/templates/training-1.png'],
      demoUrl: '/demo/training-session'
    },
    stats: {
      templateId: 'training-session',
      usageCount: 32,
      zoneBreakdown: { 'coach': 28, 'player': 4 },
      averageRating: 4.5,
      lastUsed: new Date('2024-01-14'),
      popularFields: ['training-plan', 'equipment-list', 'exercise-video']
    }
  },
  {
    id: 'news-article',
    name: 'Новинарска статия',
    slug: 'news-article',
    description: 'Класически темплейт за новини и актуалности',
    category: 'read',
    version: '3.0.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    isActive: true,
    allowedZones: ['read'],
    requiredPermissions: [],
    layout: {
      id: 'news-layout',
      name: 'News Layout',
      description: 'Classic single column layout',
      preview: '/images/templates/news-layout.png',
      structure: {
        header: true,
        sidebar: false,
        footer: false,
        columns: 1,
        maxWidth: 'md'
      }
    },
    style: {
      id: 'news-style',
      name: 'Clean Minimal',
      colors: {
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#ef4444',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Georgia',
        bodyFont: 'Georgia',
        fontSize: 'lg',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'md',
        margin: 'lg'
      },
      borders: {
        radius: 'sm',
        width: 'none'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 2,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 5,
        maxSize: 2
      },
      video: {
        enabled: false,
        platforms: [],
        maxVideos: 0
      },
      documents: {
        enabled: false,
        allowedFormats: [],
        maxSize: 0
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: false,
      relatedArticles: true,
      tableOfContents: false,
      estimatedReadTime: true,
      progressIndicator: false
    },
    preview: {
      thumbnail: '/images/templates/news-thumb.png',
      screenshots: ['/images/templates/news-1.png'],
      demoUrl: '/demo/news-article'
    },
    stats: {
      templateId: 'news-article',
      usageCount: 78,
      zoneBreakdown: { 'read': 65, 'coach': 8, 'player': 3, 'admin': 2 },
      averageRating: 4.2,
      lastUsed: new Date('2024-01-16'),
      popularFields: ['title', 'content', 'featured-image']
    }
  },
  {
    id: 'visual-story',
    name: 'Визуална история',
    slug: 'visual-story',
    description: 'Модерен темплейт с акцент върху визуалното съдържание',
    category: 'player',
    version: '1.8.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-08'),
    isActive: false, // Inactive template
    allowedZones: ['player'],
    requiredPermissions: ['visual_editor'],
    layout: {
      id: 'visual-layout',
      name: 'Visual Story Layout',
      description: 'Full-width with parallax scrolling',
      preview: '/images/templates/visual-layout.png',
      structure: {
        header: false,
        sidebar: false,
        footer: true,
        columns: 1,
        maxWidth: 'full'
      }
    },
    style: {
      id: 'visual-style',
      name: 'Bold Modern',
      colors: {
        primary: '#7c3aed',
        secondary: '#5b21b6',
        accent: '#a855f7',
        background: '#000000',
        text: '#ffffff',
        muted: '#9ca3af'
      },
      typography: {
        headingFont: 'Montserrat',
        bodyFont: 'Inter',
        fontSize: 'lg',
        lineHeight: 'tight'
      },
      spacing: {
        padding: 'lg',
        margin: 'lg'
      },
      borders: {
        radius: 'none',
        width: 'none'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: false
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 10,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '21:9'
      },
      gallery: {
        enabled: true,
        maxImages: 20,
        maxSize: 5
      },
      video: {
        enabled: true,
        platforms: ['youtube', 'vimeo', 'native'],
        maxVideos: 10
      },
      documents: {
        enabled: false,
        allowedFormats: [],
        maxSize: 0
      }
    },
    features: {
      comments: false,
      likes: true,
      sharing: true,
      printing: false,
      bookmarking: true,
      relatedArticles: false,
      tableOfContents: false,
      estimatedReadTime: false,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/visual-thumb.png',
      screenshots: ['/images/templates/visual-1.png', '/images/templates/visual-2.png'],
      demoUrl: '/demo/visual-story'
    },
    stats: {
      templateId: 'visual-story',
      usageCount: 12,
      zoneBreakdown: { 'read': 8, 'player': 4 },
      averageRating: 3.9,
      lastUsed: new Date('2024-01-05'),
      popularFields: ['hero-image', 'gallery', 'video-hero']
    }
  },
  // NEW TEMPLATES - Modern and practical
  {
    id: 'interview-modern',
    name: 'Модерно интервю',
    slug: 'interview-modern',
    description: 'Стилизиран темплейт за интервюта с въпроси и отговори',
    category: 'read',
    version: '1.0.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    allowedZones: ['read'],
    requiredPermissions: [],
    layout: {
      id: 'interview-layout',
      name: 'Interview Layout',
      description: 'Q&A focused layout with highlighting',
      preview: '/images/templates/interview-layout.png',
      structure: {
        header: true,
        sidebar: false,
        footer: true,
        columns: 1,
        maxWidth: 'lg'
      }
    },
    style: {
      id: 'interview-style',
      name: 'Professional Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#1d4ed8',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'lg',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'lg',
        margin: 'lg'
      },
      borders: {
        radius: 'lg',
        width: 'medium'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 5,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: false,
        maxImages: 0,
        maxSize: 0
      },
      video: {
        enabled: false,
        platforms: [],
        maxVideos: 0
      },
      documents: {
        enabled: false,
        allowedFormats: [],
        maxSize: 0
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: false,
      estimatedReadTime: true,
      progressIndicator: false
    },
    preview: {
      thumbnail: '/images/templates/interview-thumb.png',
      screenshots: ['/images/templates/interview-1.png'],
      demoUrl: '/demo/interview-modern'
    },
    stats: {
      templateId: 'interview-modern',
      usageCount: 15,
      zoneBreakdown: { 'read': 15 },
      averageRating: 4.6,
      lastUsed: new Date('2024-01-19'),
      popularFields: ['title', 'content', 'featured-image']
    }
  },
  {
    id: 'player-guide',
    name: 'Ръководство за играчи',
    slug: 'player-guide',
    description: 'Интерактивен темплейт за стъпка по стъпка ръководства и упражнения',
    category: 'player',
    version: '1.0.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    allowedZones: ['player'],
    requiredPermissions: [],
    layout: {
      id: 'guide-layout',
      name: 'Guide Layout',
      description: 'Step-by-step guide with progress tracking',
      preview: '/images/templates/guide-layout.png',
      structure: {
        header: true,
        sidebar: true,
        footer: true,
        columns: 2,
        maxWidth: 'xl'
      }
    },
    style: {
      id: 'guide-style',
      name: 'Purple Progress',
      colors: {
        primary: '#7c3aed',
        secondary: '#5b21b6',
        accent: '#a855f7',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'lg',
        margin: 'md'
      },
      borders: {
        radius: 'lg',
        width: 'medium'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: false
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 5,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 8,
        maxSize: 3
      },
      video: {
        enabled: true,
        platforms: ['youtube', 'vimeo'],
        maxVideos: 3
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf'],
        maxSize: 5
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/guide-thumb.png',
      screenshots: ['/images/templates/guide-1.png', '/images/templates/guide-2.png'],
      demoUrl: '/demo/player-guide'
    },
    stats: {
      templateId: 'player-guide',
      usageCount: 8,
      zoneBreakdown: { 'player': 8 },
      averageRating: 4.8,
      lastUsed: new Date('2024-01-18'),
      popularFields: ['title', 'steps', 'progress-tracking', 'featured-image']
    }
  },
  // NEW TEMPLATES ADDED - 6 additional templates
  {
    id: 'fitness-program',
    name: 'Фитнес програма',
    slug: 'fitness-program',
    description: 'Специализиран темплейт за физическа подготовка и фитнес планове',
    category: 'player',
    version: '1.0.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    allowedZones: ['player', 'coach'],
    requiredPermissions: [],
    layout: {
      id: 'fitness-layout',
      name: 'Fitness Layout',
      description: 'Structured layout for fitness programs',
      preview: '/images/templates/fitness-layout.png',
      structure: {
        header: true,
        sidebar: true,
        footer: true,
        columns: 2,
        maxWidth: 'lg'
      }
    },
    style: {
      id: 'fitness-style',
      name: 'Energetic Orange',
      colors: {
        primary: '#ea580c',
        secondary: '#c2410c',
        accent: '#fb923c',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'normal'
      },
      spacing: {
        padding: 'lg',
        margin: 'md'
      },
      borders: {
        radius: 'lg',
        width: 'medium'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 5,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 8,
        maxSize: 3
      },
      video: {
        enabled: true,
        platforms: ['youtube', 'vimeo'],
        maxVideos: 5
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf'],
        maxSize: 5
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/fitness-thumb.png',
      screenshots: ['/images/templates/fitness-1.png'],
      demoUrl: '/demo/fitness-program'
    },
    stats: {
      templateId: 'fitness-program',
      usageCount: 23,
      zoneBreakdown: { 'player': 18, 'coach': 5 },
      averageRating: 4.6,
      lastUsed: new Date('2024-01-19'),
      popularFields: ['workout-plan', 'exercises', 'nutrition-tips']
    }
  },
  {
    id: 'match-analysis',
    name: 'Анализ на мач',
    slug: 'match-analysis',
    description: 'Детайлен темплейт за анализ на мачове с статистики и видео материали',
    category: 'coach',
    version: '2.0.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    allowedZones: ['coach', 'read'],
    requiredPermissions: [],
    layout: {
      id: 'match-analysis-layout',
      name: 'Match Analysis Layout',
      description: 'Professional layout for match breakdowns',
      preview: '/images/templates/match-layout.png',
      structure: {
        header: true,
        sidebar: true,
        footer: true,
        columns: 2,
        maxWidth: 'xl'
      }
    },
    style: {
      id: 'match-style',
      name: 'Professional Navy',
      colors: {
        primary: '#1e40af',
        secondary: '#1e3a8a',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'lg',
        margin: 'lg'
      },
      borders: {
        radius: 'md',
        width: 'thin'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 5,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 15,
        maxSize: 5
      },
      video: {
        enabled: true,
        platforms: ['youtube', 'vimeo'],
        maxVideos: 10
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf', 'doc'],
        maxSize: 10
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/match-thumb.png',
      screenshots: ['/images/templates/match-1.png', '/images/templates/match-2.png'],
      demoUrl: '/demo/match-analysis'
    },
    stats: {
      templateId: 'match-analysis',
      usageCount: 67,
      zoneBreakdown: { 'coach': 52, 'read': 15 },
      averageRating: 4.9,
      lastUsed: new Date('2024-01-20'),
      popularFields: ['match-stats', 'video-highlights', 'tactical-breakdown']
    }
  },
  {
    id: 'youth-development',
    name: 'Юношеско развитие',
    slug: 'youth-development',
    description: 'Темплейт за родители и треньори, фокусиран върху развитието на млади играчи',
    category: 'parent',
    version: '1.5.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-18'),
    isActive: true,
    allowedZones: ['parent', 'coach'],
    requiredPermissions: [],
    layout: {
      id: 'youth-layout',
      name: 'Youth Development Layout',
      description: 'Family-friendly layout with clear sections',
      preview: '/images/templates/youth-layout.png',
      structure: {
        header: true,
        sidebar: false,
        footer: true,
        columns: 1,
        maxWidth: 'md'
      }
    },
    style: {
      id: 'youth-style',
      name: 'Warm Purple',
      colors: {
        primary: '#7c3aed',
        secondary: '#6d28d9',
        accent: '#a855f7',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'lg',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'lg',
        margin: 'lg'
      },
      borders: {
        radius: 'lg',
        width: 'thin'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: false
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 3,
        allowedFormats: ['jpg', 'png'],
        aspectRatio: '4:3'
      },
      gallery: {
        enabled: true,
        maxImages: 6,
        maxSize: 2
      },
      video: {
        enabled: true,
        platforms: ['youtube'],
        maxVideos: 3
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf'],
        maxSize: 5
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: false,
      estimatedReadTime: true,
      progressIndicator: false
    },
    preview: {
      thumbnail: '/images/templates/youth-thumb.png',
      screenshots: ['/images/templates/youth-1.png'],
      demoUrl: '/demo/youth-development'
    },
    stats: {
      templateId: 'youth-development',
      usageCount: 34,
      zoneBreakdown: { 'parent': 28, 'coach': 6 },
      averageRating: 4.7,
      lastUsed: new Date('2024-01-18'),
      popularFields: ['development-tips', 'age-groups', 'safety-guidelines']
    }
  },
  {
    id: 'nutrition-guide',
    name: 'Хранителен план',
    slug: 'nutrition-guide',
    description: 'Специализиран темплейт за хранене и диетични препоръки за футболисти',
    category: 'universal',
    version: '1.2.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-17'),
    isActive: true,
    allowedZones: ['player', 'parent', 'coach'],
    requiredPermissions: [],
    layout: {
      id: 'nutrition-layout',
      name: 'Nutrition Layout',
      description: 'Clean layout optimized for meal plans and recipes',
      preview: '/images/templates/nutrition-layout.png',
      structure: {
        header: true,
        sidebar: true,
        footer: false,
        columns: 2,
        maxWidth: 'lg'
      }
    },
    style: {
      id: 'nutrition-style',
      name: 'Fresh Green',
      colors: {
        primary: '#16a34a',
        secondary: '#15803d',
        accent: '#22c55e',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'md',
        margin: 'md'
      },
      borders: {
        radius: 'lg',
        width: 'thin'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 3,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 12,
        maxSize: 2
      },
      video: {
        enabled: false,
        platforms: [],
        maxVideos: 0
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf'],
        maxSize: 3
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: false
    },
    preview: {
      thumbnail: '/images/templates/nutrition-thumb.png',
      screenshots: ['/images/templates/nutrition-1.png'],
      demoUrl: '/demo/nutrition-guide'
    },
    stats: {
      templateId: 'nutrition-guide',
      usageCount: 41,
      zoneBreakdown: { 'player': 20, 'parent': 15, 'coach': 6 },
      averageRating: 4.5,
      lastUsed: new Date('2024-01-17'),
      popularFields: ['meal-plans', 'recipes', 'supplements']
    }
  },
  {
    id: 'equipment-review',
    name: 'Ревю на екипировка',
    slug: 'equipment-review',
    description: 'Темплейт за детайлни ревюта на футболна екипировка и оборудване',
    category: 'read',
    version: '1.8.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-19'),
    isActive: true,
    allowedZones: ['read', 'player'],
    requiredPermissions: [],
    layout: {
      id: 'equipment-layout',
      name: 'Equipment Review Layout',
      description: 'Product-focused layout with comparison tables',
      preview: '/images/templates/equipment-layout.png',
      structure: {
        header: true,
        sidebar: true,
        footer: true,
        columns: 2,
        maxWidth: 'lg'
      }
    },
    style: {
      id: 'equipment-style',
      name: 'Modern Gray',
      colors: {
        primary: '#4b5563',
        secondary: '#374151',
        accent: '#6b7280',
        background: '#ffffff',
        text: '#000000',
        muted: '#9ca3af'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        lineHeight: 'normal'
      },
      spacing: {
        padding: 'lg',
        margin: 'md'
      },
      borders: {
        radius: 'md',
        width: 'thin'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 5,
        allowedFormats: ['jpg', 'png', 'webp'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 20,
        maxSize: 3
      },
      video: {
        enabled: true,
        platforms: ['youtube'],
        maxVideos: 3
      },
      documents: {
        enabled: false,
        allowedFormats: [],
        maxSize: 0
      }
    },
    features: {
      comments: true,
      likes: true,
      sharing: true,
      printing: false,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/equipment-thumb.png',
      screenshots: ['/images/templates/equipment-1.png', '/images/templates/equipment-2.png'],
      demoUrl: '/demo/equipment-review'
    },
    stats: {
      templateId: 'equipment-review',
      usageCount: 28,
      zoneBreakdown: { 'read': 22, 'player': 6 },
      averageRating: 4.3,
      lastUsed: new Date('2024-01-19'),
      popularFields: ['product-specs', 'rating-system', 'comparison-table']
    }
  },
  {
    id: 'rule-explanation',
    name: 'Обяснение на правила',
    slug: 'rule-explanation',
    description: 'Образователен темплейт за обяснение на футболни правила и регламенти',
    category: 'universal',
    version: '2.2.0',
    author: 'System',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16'),
    isActive: true,
    allowedZones: ['read', 'coach', 'parent'],
    requiredPermissions: [],
    layout: {
      id: 'rule-layout',
      name: 'Educational Layout',
      description: 'Step-by-step layout for rule explanations',
      preview: '/images/templates/rule-layout.png',
      structure: {
        header: true,
        sidebar: false,
        footer: true,
        columns: 1,
        maxWidth: 'md'
      }
    },
    style: {
      id: 'rule-style',
      name: 'Educational Blue',
      colors: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        background: '#ffffff',
        text: '#000000',
        muted: '#6b7280'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'lg',
        lineHeight: 'relaxed'
      },
      spacing: {
        padding: 'lg',
        margin: 'lg'
      },
      borders: {
        radius: 'md',
        width: 'thin'
      }
    },
    sections: [],
    seoFields: {
      metaDescription: true,
      ogImage: true,
      structuredData: true
    },
    mediaSettings: {
      featuredImage: {
        required: true,
        maxSize: 3,
        allowedFormats: ['jpg', 'png'],
        aspectRatio: '16:9'
      },
      gallery: {
        enabled: true,
        maxImages: 8,
        maxSize: 2
      },
      video: {
        enabled: true,
        platforms: ['youtube'],
        maxVideos: 5
      },
      documents: {
        enabled: true,
        allowedFormats: ['pdf'],
        maxSize: 5
      }
    },
    features: {
      comments: true,
      likes: false,
      sharing: true,
      printing: true,
      bookmarking: true,
      relatedArticles: true,
      tableOfContents: true,
      estimatedReadTime: true,
      progressIndicator: true
    },
    preview: {
      thumbnail: '/images/templates/rule-thumb.png',
      screenshots: ['/images/templates/rule-1.png'],
      demoUrl: '/demo/rule-explanation'
    },
    stats: {
      templateId: 'rule-explanation',
      usageCount: 56,
      zoneBreakdown: { 'read': 28, 'coach': 18, 'parent': 10 },
      averageRating: 4.8,
      lastUsed: new Date('2024-01-16'),
      popularFields: ['rule-text', 'examples', 'diagrams']
    }
  }
]

// Helper functions
export const getActiveTemplates = () => {
  const filtered = mockTemplates.filter(template => template.isActive)
  return filtered.map(convertToLegacyTemplate)
}

export const getTemplatesByZone = (zone: string) => {
  const filtered = mockTemplates.filter(template =>
    template.isActive && (template.allowedZones.length === 0 || template.allowedZones.includes(zone))
  )
  return filtered.map(convertToLegacyTemplate)
}

export const getTemplateById = (id: string) => {
  return mockTemplates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string) => {
  const filtered = mockTemplates.filter(template => template.category === category && template.isActive)
  return filtered.map(convertToLegacyTemplate)
}

// Convert Template to legacy ArticleTemplate format for backward compatibility
export const convertToLegacyTemplate = (template: Template): any => {
  const sectionsLength = template.sections?.length || 0
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    settings: {
      textLength: sectionsLength > 2 ? 'long' : sectionsLength > 1 ? 'medium' : 'short',
      allowVideos: template.mediaSettings?.video?.enabled || false,
      maxVideos: template.mediaSettings?.video?.maxVideos || 0,
      videoTypes: template.mediaSettings?.video?.platforms || [],
      allowImages: template.mediaSettings?.gallery?.enabled || template.mediaSettings?.featuredImage?.required || false,
      maxImages: (template.mediaSettings?.gallery?.maxImages || 0) + (template.mediaSettings?.featuredImage?.required ? 1 : 0),
      imageLayout: template.mediaSettings?.gallery?.enabled ? 'gallery' : 'inline',
      allowDownloads: template.mediaSettings?.documents?.enabled || false,
      downloadTypes: template.mediaSettings?.documents?.allowedFormats || [],
      allowLinks: true,
      styling: {
        layout: template.layout?.structure?.columns === 1 ? 'single-column' :
               template.layout?.structure?.columns === 2 ? 'two-column' : 'multi-column',
        fontSize: template.style?.typography?.fontSize || 'medium',
        spacing: template.style?.spacing?.padding || 'normal',
        colors: {
          primary: template.style?.colors?.primary || '#000000',
          secondary: template.style?.colors?.secondary || '#666666',
          text: template.style?.colors?.text || '#000000'
        }
      }
    }
  }
}

// Legacy support - export active templates in the old format
export const articleTemplates = getActiveTemplates()