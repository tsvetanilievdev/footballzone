import db from '../config/database'
import { TemplateCategory } from '@prisma/client'

interface TemplateData {
  name: string
  description?: string
  category: TemplateCategory
  settings: any
  isDefault?: boolean
}

export class TemplateService {
  /**
   * Get all templates
   */
  async getTemplates() {
    try {
      const templates = await db.articleTemplate.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return templates
    } catch (error) {
      console.error('Error getting templates:', error)
      throw new Error('Failed to fetch templates')
    }
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: string) {
    try {
      const template = await db.articleTemplate.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      if (!template) {
        throw new Error('Template not found')
      }

      return template
    } catch (error) {
      console.error('Error getting template:', error)
      throw new Error('Failed to fetch template')
    }
  }

  /**
   * Create new template
   */
  async createTemplate(templateData: TemplateData, createdBy?: string) {
    try {
      const template = await db.articleTemplate.create({
        data: {
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          settings: templateData.settings,
          isDefault: templateData.isDefault || false,
          createdBy
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return template
    } catch (error) {
      console.error('Error creating template:', error)
      throw new Error('Failed to create template')
    }
  }

  /**
   * Update template
   */
  async updateTemplate(id: string, updateData: Partial<TemplateData>) {
    try {
      const template = await db.articleTemplate.update({
        where: { id },
        data: updateData,
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return template
    } catch (error) {
      console.error('Error updating template:', error)
      throw new Error('Failed to update template')
    }
  }

  /**
   * Delete template
   */
  async deleteTemplate(id: string) {
    try {
      // Check if template is being used by any articles
      const articlesUsingTemplate = await db.article.count({
        where: { templateId: id }
      })

      if (articlesUsingTemplate > 0) {
        throw new Error('Cannot delete template that is being used by articles')
      }

      await db.articleTemplate.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error deleting template:', error)
      throw new Error('Failed to delete template')
    }
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: TemplateCategory) {
    try {
      const templates = await db.articleTemplate.findMany({
        where: {
          OR: [
            { category },
            { category: 'universal' }
          ]
        },
        orderBy: {
          isDefault: 'desc'
        }
      })

      return templates
    } catch (error) {
      console.error('Error getting templates by category:', error)
      throw new Error('Failed to fetch templates by category')
    }
  }

  /**
   * Get default templates
   */
  async getDefaultTemplates() {
    try {
      const templates = await db.articleTemplate.findMany({
        where: { isDefault: true },
        orderBy: {
          category: 'asc'
        }
      })

      return templates
    } catch (error) {
      console.error('Error getting default templates:', error)
      throw new Error('Failed to fetch default templates')
    }
  }
}
