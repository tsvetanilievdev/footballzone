import { Request, Response, NextFunction } from 'express'
import { MediaService } from '../services/mediaService'

const mediaService = new MediaService()

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media file management
 */

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload media file
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               folder:
 *                 type: string
 *                 description: Folder to upload to
 *                 example: articles
 *               altText:
 *                 type: string
 *                 description: Alternative text for images
 *                 example: Football tactics diagram
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *                 example: football,tactics,diagram
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *                       format: uri
 *                     type:
 *                       type: string
 *                       enum: [IMAGE, VIDEO, PDF, DOC, EXCEL, AUDIO]
 *                     size:
 *                       type: integer
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       413:
 *         description: File too large
 */
export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const { folder, altText, tags } = req.body
    const uploadedBy = req.user?.userId

    const media = await mediaService.uploadFile(
      req.file,
      {
        folder,
        altText,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        uploadedBy
      }
    )

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: media
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @swagger
 * /media:
 *   get:
 *     summary: Get media files
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [IMAGE, VIDEO, PDF, DOC, EXCEL, AUDIO]
 *         description: Filter by file type
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Filter by folder
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in filename and tags
 *     responses:
 *       200:
 *         description: Media files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MediaFile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export const getMediaFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const type = req.query.type as string
    const folder = req.query.folder as string
    const search = req.query.search as string

    const result = await mediaService.getMediaFiles({
      page,
      limit,
      type,
      folder,
      search
    })

    res.json({
      success: true,
      data: result.files,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @swagger
 * /media/{id}:
 *   get:
 *     summary: Get media file by ID
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media file ID
 *     responses:
 *       200:
 *         description: Media file retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MediaFile'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const getMediaFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const media = await mediaService.getMediaFile(id)

    res.json({
      success: true,
      data: media
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @swagger
 * /media/{id}:
 *   put:
 *     summary: Update media file
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               altText:
 *                 type: string
 *                 example: Updated alt text
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [football, tactics, updated]
 *     responses:
 *       200:
 *         description: Media file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Media file updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/MediaFile'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const updateMediaFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const media = await mediaService.updateMediaFile(id, updateData)

    res.json({
      success: true,
      message: 'Media file updated successfully',
      data: media
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @swagger
 * /media/{id}:
 *   delete:
 *     summary: Delete media file
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media file ID
 *     responses:
 *       200:
 *         description: Media file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Media file deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const deleteMediaFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await mediaService.deleteMediaFile(id)

    res.json({
      success: true,
      message: 'Media file deleted successfully'
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * @swagger
 * /media/folders:
 *   get:
 *     summary: Get media folders
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Folders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       fileCount:
 *                         type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export const getMediaFolders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folders = await mediaService.getMediaFolders()

    res.json({
      success: true,
      data: folders
    })
  } catch (error) {
    return next(error)
  }
}
