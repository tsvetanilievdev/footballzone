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