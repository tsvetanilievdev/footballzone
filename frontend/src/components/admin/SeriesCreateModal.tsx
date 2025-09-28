'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useCreateSeries } from '@/hooks/api/useSeries'
import { SeriesCategory } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import FormErrors from '@/components/ui/FormErrors'
import { parseValidationErrors, ErrorContextEnum } from '@/utils/errorUtils'

// Validation schema matching backend
const createSeriesSchema = z.object({
  name: z.string()
    .min(3, 'Името трябва да е поне 3 символа')
    .max(255, 'Името не може да е повече от 255 символа'),
  slug: z.string()
    .min(3, 'URL адресът трябва да е поне 3 символа')
    .regex(/^[a-z0-9-]+$/, 'URL адресът може да съдържа само малки букви, цифри и тирета'),
  description: z.string()
    .max(1000, 'Описанието не може да е повече от 1000 символа')
    .optional(),
  coverImageUrl: z.string()
    .url('Невалиден URL адрес за изображение')
    .optional()
    .or(z.literal('')),
  category: z.nativeEnum(SeriesCategory, {
    errorMap: () => ({ message: 'Моля, изберете категория' })
  }),
  totalPlannedArticles: z.number()
    .min(1, 'Минимум 1 статия')
    .max(100, 'Максимум 100 статии')
    .optional(),
  tags: z.array(z.string().max(50, 'Всеки таг може да е максимум 50 символа'))
    .max(20, 'Максимум 20 тага')
    .optional()
})

type CreateSeriesForm = z.infer<typeof createSeriesSchema>

interface SeriesCreateModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function SeriesCreateModal({ onClose, onSuccess }: SeriesCreateModalProps) {
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<any[]>([])

  const createSeries = useCreateSeries()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors, isSubmitting }
  } = useForm<CreateSeriesForm>({
    resolver: zodResolver(createSeriesSchema),
    defaultValues: {
      category: SeriesCategory.GENERAL,
      tags: []
    }
  })

  const watchedName = watch('name')
  const watchedTags = watch('tags') || []

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
      'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y',
      'ю': 'yu', 'я': 'ya'
    }

    return name
      .toLowerCase()
      .split('')
      .map(char => cyrillicToLatin[char] || char)
      .join('')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('slug', generateSlug(name))
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !watchedTags.includes(trimmedTag) && watchedTags.length < 20) {
      setValue('tags', [...watchedTags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: CreateSeriesForm) => {
    try {
      setErrors([])

      // Clean up data
      const cleanedData = {
        ...data,
        coverImageUrl: data.coverImageUrl || undefined,
        description: data.description || undefined,
        totalPlannedArticles: data.totalPlannedArticles || undefined,
        tags: data.tags && data.tags.length > 0 ? data.tags : undefined
      }

      await createSeries.mutateAsync(cleanedData)
      onSuccess()
    } catch (error: any) {
      console.error('Failed to create series:', error)
      const parsedErrors = parseValidationErrors(
        error.response?.data?.message || error.message,
        ErrorContextEnum.CONTENT_MANAGEMENT
      )
      setErrors(parsedErrors)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Създаване на серия
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <FormErrors
              errors={errors}
              context={ErrorContextEnum.CONTENT_MANAGEMENT}
              className="mb-4"
            />
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Име на серията *
            </label>
            <input
              {...register('name', { onChange: handleNameChange })}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Основи на тактиката"
            />
            {formErrors.name && (
              <p className="text-sm text-red-600 mt-1">{formErrors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              URL адрес *
            </label>
            <input
              {...register('slug')}
              type="text"
              id="slug"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="osnovi-na-taktikata"
            />
            {formErrors.slug && (
              <p className="text-sm text-red-600 mt-1">{formErrors.slug.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Автоматично се генерира от името, но може да се редактира
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Категория *
            </label>
            <select
              {...register('category')}
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={SeriesCategory.GENERAL}>Общи</option>
              <option value={SeriesCategory.COACHES}>Треньори</option>
              <option value={SeriesCategory.PLAYERS}>Играчи</option>
              <option value={SeriesCategory.TEAMS}>Отбори</option>
            </select>
            {formErrors.category && (
              <p className="text-sm text-red-600 mt-1">{formErrors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Кратко описание на серията..."
            />
            {formErrors.description && (
              <p className="text-sm text-red-600 mt-1">{formErrors.description.message}</p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              <PhotoIcon className="w-4 h-4 inline mr-1" />
              Изображение (URL)
            </label>
            <input
              {...register('coverImageUrl')}
              type="url"
              id="coverImageUrl"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formErrors.coverImageUrl && (
              <p className="text-sm text-red-600 mt-1">{formErrors.coverImageUrl.message}</p>
            )}
          </div>

          {/* Total Planned Articles */}
          <div>
            <label htmlFor="totalPlannedArticles" className="block text-sm font-medium text-gray-700 mb-2">
              Планиран брой статии
            </label>
            <input
              {...register('totalPlannedArticles', { valueAsNumber: true })}
              type="number"
              id="totalPlannedArticles"
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
            />
            {formErrors.totalPlannedArticles && (
              <p className="text-sm text-red-600 mt-1">{formErrors.totalPlannedArticles.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Тагове
            </label>

            {/* Tag Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Добави таг..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || watchedTags.length >= 20}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Tag Display */}
            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-1">
              {watchedTags.length}/20 тага. Натиснете Enter за добавяне.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
              Създай серия
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}