/**
 * User Profile & Settings Routes
 */

import express from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { rateLimit } from 'express-rate-limit'

const router = express.Router()
const prisma = new PrismaClient()

// Rate limiting
const settingsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Твърде много заявки за настройки. Опитайте отново след 15 минути.' }
})

const passwordChangeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { error: 'Твърде много опити за смяна на парола. Опитайте отново след 1 час.' }
})

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  bio: z.string().max(500).optional()
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Паролите не съвпадат',
  path: ['confirmPassword']
})

const updateSettingsSchema = z.object({
  emailNotifications: z.object({
    newArticles: z.boolean().optional(),
    seriesUpdates: z.boolean().optional(),
    premiumContent: z.boolean().optional(),
    newsletter: z.boolean().optional(),
    marketing: z.boolean().optional()
  }).optional(),
  pushNotifications: z.object({
    browser: z.boolean().optional(),
    mobile: z.boolean().optional()
  }).optional(),
  preferences: z.object({
    language: z.enum(['bg', 'en']).optional(),
    timezone: z.string().max(50).optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional()
  }).optional()
})

// GET /api/v1/users/profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Неоторизиран достъп' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Потребителят не е намерен' })
    }

    const totalViews = await prisma.articleView.count({
      where: { userId }
    })

    return res.json({
      user,
      stats: {
        totalViews,
        totalComments: 0,
        recentViews: []
      }
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return res.status(500).json({ error: 'Вътрешна грешка на сървъра' })
  }
})

// PUT /api/v1/users/profile
router.put('/profile', requireAuth, settingsRateLimit, validateRequest(updateProfileSchema), async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Неоторизиран достъп' })
    }

    const { name, email, bio } = req.body

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ 
          error: 'Този имейл адрес вече се използва от друг потребител' 
        })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        bio: bio || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return res.json({
      message: 'Профилът е обновен успешно',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return res.status(500).json({ error: 'Вътрешна грешка на сървъра' })
  }
})

// PUT /api/v1/users/password
router.put('/password', requireAuth, passwordChangeRateLimit, validateRequest(changePasswordSchema), async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Неоторизиран достъп' })
    }

    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Потребителят не е намерен' })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Текущата парола не е правилна' })
    }

    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    return res.json({
      message: 'Паролата е променена успешно'
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return res.status(500).json({ error: 'Вътрешна грешка на сървъра' })
  }
})

// GET /api/v1/users/settings
router.get('/settings', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Неоторизиран достъп' })
    }

    let userSettings = await prisma.userSettings.findUnique({
      where: { userId }
    })

    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId,
          emailNotifications: {
            newArticles: true,
            seriesUpdates: true,
            premiumContent: true,
            newsletter: false,
            marketing: false
          },
          pushNotifications: {
            browser: false,
            mobile: false
          },
          preferences: {
            language: 'bg',
            timezone: 'Europe/Sofia',
            theme: 'light'
          }
        }
      })
    }

    return res.json({
      settings: {
        emailNotifications: userSettings.emailNotifications,
        pushNotifications: userSettings.pushNotifications,
        preferences: userSettings.preferences
      }
    })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return res.status(500).json({ error: 'Вътрешна грешка на сървъра' })
  }
})

// PUT /api/v1/users/settings
router.put('/settings', requireAuth, settingsRateLimit, validateRequest(updateSettingsSchema), async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Неоторизиран достъп' })
    }

    const { emailNotifications, pushNotifications, preferences } = req.body

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        emailNotifications: emailNotifications || undefined,
        pushNotifications: pushNotifications || undefined,
        preferences: preferences || undefined,
        updatedAt: new Date()
      },
      create: {
        userId,
        emailNotifications: emailNotifications || {
          newArticles: true,
          seriesUpdates: true,
          premiumContent: true,
          newsletter: false,
          marketing: false
        },
        pushNotifications: pushNotifications || {
          browser: false,
          mobile: false
        },
        preferences: preferences || {
          language: 'bg',
          timezone: 'Europe/Sofia',
          theme: 'light'
        }
      }
    })

    return res.json({
      message: 'Настройките са обновени успешно',
      settings: {
        emailNotifications: updatedSettings.emailNotifications,
        pushNotifications: updatedSettings.pushNotifications,
        preferences: updatedSettings.preferences
      }
    })
  } catch (error) {
    console.error('Error updating user settings:', error)
    return res.status(500).json({ error: 'Вътрешна грешка на сървъра' })
  }
})

// DELETE /api/v1/users/account
router.delete('/account', requireAuth, passwordChangeRateLimit, async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Неоторизиран достъп' })
    }

    const { password } = req.body
    if (!password) {
      return res.status(400).json({ error: 'Паролата е задължителна за изтриване на акаунта' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true, email: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Потребителят не е намерен' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неправилна парола' })
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return res.json({
      message: 'Акаунтът е изтрит успешно'
    })
  } catch (error) {
    console.error('Error deleting user account:', error)
    return res.status(500).json({ error: 'Вътрешна грешка на сървъра' })
  }
})

export default router