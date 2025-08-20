import db from '../config/database'
import { MediaType } from '@prisma/client'
import path from 'path'
import fs from 'fs/promises'

interface MediaFilters {
  page: number
  limit: number
  type?: string
  folder?: string
  search?: string
}

interface UploadOptions {
  folder?: string
  altText?: string
  tags?: string[]
  uploadedBy?: string
}

export class MediaService {
  private uploadPath = process.env.UPLOAD_PATH || './uploads'

  /**
   * Upload a file
   */
  async uploadFile(file: Express.Multer.File, options: UploadOptions = {}) {
    try {
      const { folder = 'general', altText, tags = [], uploadedBy } = options

      // Determine file type based on mimetype
      const fileType = this.getFileType(file.mimetype)
      
      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(file.originalname)
      const filename = `${timestamp}_${Math.random().toString(36).substring(7)}${ext}`
      
      // Create folder structure
      const folderPath = path.join(this.uploadPath, folder)
      await fs.mkdir(folderPath, { recursive: true })
      
      // File path and URL
      const filePath = path.join(folderPath, filename)
      const fileUrl = `/uploads/${folder}/${filename}`
      
      // For now, we'll simulate file upload (in production, use proper file storage)
      // await fs.writeFile(filePath, file.buffer)

      // Save to database
      const mediaFile = await db.mediaFile.create({
        data: {
          filename,
          originalName: file.originalname,
          filePath,
          fileUrl,
          fileType,
          fileSize: file.size,
          mimeType: file.mimetype,
          altText,
          tags,
          uploadedBy
        },
        include: {
          uploader: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return {
        id: mediaFile.id,
        filename: mediaFile.filename,
        originalName: mediaFile.originalName,
        url: mediaFile.fileUrl,
        type: mediaFile.fileType,
        size: mediaFile.fileSize,
        mimeType: mediaFile.mimeType,
        altText: mediaFile.altText,
        tags: mediaFile.tags,
        createdAt: mediaFile.createdAt,
        uploader: mediaFile.uploader
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  /**
   * Get media files with filtering
   */
  async getMediaFiles(filters: MediaFilters) {
    const { page, limit, type, folder, search } = filters
    const offset = (page - 1) * limit

    try {
      // Build where clause
      const where: any = {}

      if (type) {
        where.fileType = type as MediaType
      }

      if (folder) {
        where.filePath = {
          contains: `/${folder}/`
        }
      }

      if (search) {
        where.OR = [
          {
            filename: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            originalName: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            tags: {
              hasSome: [search]
            }
          }
        ]
      }

      // Get total count
      const total = await db.mediaFile.count({ where })

      // Get files
      const files = await db.mediaFile.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          uploader: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return {
        files,
        total
      }
    } catch (error) {
      console.error('Error getting media files:', error)
      throw new Error('Failed to fetch media files')
    }
  }

  /**
   * Get media file by ID
   */
  async getMediaFile(id: string) {
    try {
      const mediaFile = await db.mediaFile.findUnique({
        where: { id },
        include: {
          uploader: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      if (!mediaFile) {
        throw new Error('Media file not found')
      }

      return mediaFile
    } catch (error) {
      console.error('Error getting media file:', error)
      throw new Error('Failed to fetch media file')
    }
  }

  /**
   * Update media file
   */
  async updateMediaFile(id: string, updateData: { altText?: string; tags?: string[] }) {
    try {
      const mediaFile = await db.mediaFile.update({
        where: { id },
        data: updateData,
        include: {
          uploader: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return mediaFile
    } catch (error) {
      console.error('Error updating media file:', error)
      throw new Error('Failed to update media file')
    }
  }

  /**
   * Delete media file
   */
  async deleteMediaFile(id: string) {
    try {
      const mediaFile = await db.mediaFile.findUnique({
        where: { id }
      })

      if (!mediaFile) {
        throw new Error('Media file not found')
      }

      // Delete file from filesystem (in production)
      // try {
      //   await fs.unlink(mediaFile.filePath)
      // } catch (error) {
      //   console.warn('Could not delete file from filesystem:', error)
      // }

      // Delete from database
      await db.mediaFile.delete({
        where: { id }
      })
    } catch (error) {
      console.error('Error deleting media file:', error)
      throw new Error('Failed to delete media file')
    }
  }

  /**
   * Get media folders
   */
  async getMediaFolders() {
    try {
      // Extract folder names from file paths
      const files = await db.mediaFile.findMany({
        select: {
          filePath: true
        }
      })

      const folderCounts: Record<string, number> = {}

      files.forEach(file => {
        const pathParts = file.filePath.split('/')
        if (pathParts.length > 1) {
          const folder = pathParts[pathParts.length - 2] // Get folder name
          folderCounts[folder] = (folderCounts[folder] || 0) + 1
        }
      })

      return Object.entries(folderCounts).map(([name, fileCount]) => ({
        name,
        fileCount
      }))
    } catch (error) {
      console.error('Error getting media folders:', error)
      throw new Error('Failed to fetch media folders')
    }
  }

  /**
   * Determine file type from mimetype
   */
  private getFileType(mimetype: string): MediaType {
    if (mimetype.startsWith('image/')) {
      return MediaType.IMAGE
    } else if (mimetype.startsWith('video/')) {
      return MediaType.VIDEO
    } else if (mimetype === 'application/pdf') {
      return MediaType.PDF
    } else if (mimetype.includes('document') || mimetype.includes('word')) {
      return MediaType.DOC
    } else if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) {
      return MediaType.EXCEL
    } else if (mimetype.startsWith('audio/')) {
      return MediaType.AUDIO
    } else {
      return MediaType.PDF // Default fallback
    }
  }

  /**
   * Validate file upload
   */
  validateFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg',
      'audio/wav'
    ]

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 50MB limit'
      }
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: 'File type not allowed'
      }
    }

    return { isValid: true }
  }
}
