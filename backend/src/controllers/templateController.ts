import { Request, Response, NextFunction } from 'express'
import { TemplateService } from '../services/templateService'

const templateService = new TemplateService()

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Article template management
 */

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all article templates
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
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
 *                     $ref: '#/components/schemas/ArticleTemplate'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export const getTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await templateService.getTemplates()

    res.json({
      success: true,
      data: templates
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     summary: Get template by ID
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ArticleTemplate'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const getTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const template = await templateService.getTemplate(id)

    res.json({
      success: true,
      data: template
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create new template
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Modern Article Template
 *               description:
 *                 type: string
 *                 example: A modern template for articles
 *               category:
 *                 type: string
 *                 enum: [read, coach, player, parent, universal]
 *                 example: universal
 *               settings:
 *                 type: object
 *                 description: Template configuration
 *     responses:
 *       201:
 *         description: Template created successfully
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
 *                   example: Template created successfully
 *                 data:
 *                   $ref: '#/components/schemas/ArticleTemplate'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const createTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templateData = req.body
    const userId = req.user?.userId

    const template = await templateService.createTemplate(templateData, userId)

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /templates/{id}:
 *   put:
 *     summary: Update template
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Template Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               settings:
 *                 type: object
 *                 description: Updated template configuration
 *     responses:
 *       200:
 *         description: Template updated successfully
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
 *                   example: Template updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/ArticleTemplate'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const template = await templateService.updateTemplate(id, updateData)

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: template
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /templates/{id}:
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
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
 *                   example: Template deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await templateService.deleteTemplate(id)

    res.json({
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
