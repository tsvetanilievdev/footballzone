// Template System Types - Inspired by WordPress and Drupal best practices

export interface TemplateField {
  id: string
  name: string
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'video' | 'file' | 'select' | 'checkbox' | 'number' | 'date' | 'url'
  label: string
  description?: string
  required: boolean
  placeholder?: string
  defaultValue?: any
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  options?: { value: string; label: string }[] // For select fields
}

export interface TemplateSection {
  id: string
  name: string
  label: string
  description?: string
  collapsible: boolean
  defaultExpanded: boolean
  fields: TemplateField[]
}

export interface TemplateLayout {
  id: string
  name: string
  description: string
  preview: string // URL to preview image
  structure: {
    header: boolean
    sidebar: boolean
    footer: boolean
    columns: 1 | 2 | 3
    maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }
}

export interface TemplateStyle {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    muted: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    fontSize: 'sm' | 'md' | 'lg'
    lineHeight: 'tight' | 'normal' | 'relaxed'
  }
  spacing: {
    padding: 'sm' | 'md' | 'lg'
    margin: 'sm' | 'md' | 'lg'
  }
  borders: {
    radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
    width: 'none' | 'thin' | 'medium' | 'thick'
  }
}

export interface Template {
  id: string
  name: string
  slug: string
  description: string
  category: 'universal' | 'editorial' | 'technical' | 'visual' | 'interactive' | 'academic'
  version: string
  author: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  
  // Template Configuration
  layout: TemplateLayout
  style: TemplateStyle
  sections: TemplateSection[]
  
  // Usage Restrictions
  allowedZones: string[] // Empty array means all zones allowed
  requiredPermissions: string[]
  
  // SEO and Metadata
  seoFields: {
    metaDescription: boolean
    ogImage: boolean
    structuredData: boolean
  }
  
  // Media Settings
  mediaSettings: {
    featuredImage: {
      required: boolean
      maxSize: number // in MB
      allowedFormats: string[]
      aspectRatio?: string
    }
    gallery: {
      enabled: boolean
      maxImages: number
      maxSize: number
    }
    video: {
      enabled: boolean
      platforms: ('youtube' | 'vimeo' | 'native')[]
      maxVideos: number
    }
    documents: {
      enabled: boolean
      allowedFormats: string[]
      maxSize: number
    }
  }
  
  // Advanced Features
  features: {
    comments: boolean
    likes: boolean
    sharing: boolean
    printing: boolean
    bookmarking: boolean
    relatedArticles: boolean
    tableOfContents: boolean
    estimatedReadTime: boolean
    progressIndicator: boolean
  }
  
  // Template Preview
  preview: {
    thumbnail: string
    screenshots: string[]
    demoUrl?: string
  }
}

export interface TemplateUsage {
  templateId: string
  articleId: string
  zoneId: string
  usedAt: Date
  customizations?: Record<string, any>
}

export interface TemplateStatistics {
  templateId: string
  usageCount: number
  zoneBreakdown: Record<string, number>
  averageRating: number
  lastUsed: Date
  popularFields: string[]
}

// Content Type Definition - What the template produces
export interface TemplatedContent {
  templateId: string
  templateVersion: string
  data: Record<string, any> // Field values
  renderedHtml: string
  metadata: {
    wordCount: number
    estimatedReadTime: number
    imageCount: number
    videoCount: number
  }
}