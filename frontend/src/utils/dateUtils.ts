/**
 * Date utility functions for handling date formatting in the FootballZone application
 */

export interface FormattedDate {
  day: number
  month: string
}

/**
 * Formats a date (string or Date object) for display in cards and components
 * @param date - Date object or ISO string
 * @returns Object with day number and abbreviated month name
 */
export const formatDate = (date: Date | string): FormattedDate => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date)
    return { day: 1, month: 'Jan' }
  }
  
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('en', { month: 'short' })
  
  return { day, month }
}

/**
 * Formats a date for Bulgarian locale display
 * @param date - Date object or ISO string
 * @returns Formatted date string in Bulgarian format
 */
export const formatDateBG = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDateBG:', date)
    return 'Неизвестна дата'
  }
  
  return new Intl.DateTimeFormat('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

/**
 * Formats a date for short Bulgarian locale display
 * @param date - Date object or ISO string
 * @returns Short formatted date string
 */
export const formatDateShortBG = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDateShortBG:', date)
    return 'Неизвестна'
  }
  
  return new Intl.DateTimeFormat('bg-BG', {
    month: 'short',
    day: 'numeric'
  }).format(dateObj)
}

/**
 * Formats a date for relative time display (e.g., "2 days ago")
 * @param date - Date object or ISO string
 * @returns Relative time string in Bulgarian
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatRelativeTime:', date)
    return 'преди време'
  }
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'преди малко'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `преди ${minutes} мин${minutes !== 1 ? '.' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `преди ${hours} час${hours !== 1 ? 'а' : ''}`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `преди ${days} д${days !== 1 ? 'ни' : 'ен'}`
  } else {
    return formatDateShortBG(dateObj)
  }
}

/**
 * Parses a date string or Date object and ensures it's a valid Date
 * @param date - Date object or ISO string
 * @returns Valid Date object
 */
export const parseDate = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to parseDate:', date)
    return new Date() // Return current date as fallback
  }
  
  return dateObj
}

/**
 * Safe date formatter that handles invalid dates gracefully
 * @param date - Date object, ISO string, or any date value
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string or fallback
 */
export const safeFormatDate = (
  date: any, 
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'bg-BG'
): string => {
  try {
    const dateObj = parseDate(date)
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }).format(dateObj)
  } catch (error) {
    console.warn('Date formatting error:', error, 'for date:', date)
    return 'Неизвестна дата'
  }
}

/**
 * Safe conversion to datetime-local input format
 * @param date - Date object, ISO string, or any date value
 * @returns datetime-local string or empty string if invalid
 */
export const toDateTimeLocalValue = (date: any): string => {
  try {
    if (!date) return ''
    const dateObj = parseDate(date)
    return dateObj.toISOString().slice(0, 16)
  } catch (error) {
    console.warn('Error converting to datetime-local:', error, 'for date:', date)
    return ''
  }
}

/**
 * Safe conversion to date input format
 * @param date - Date object, ISO string, or any date value
 * @returns date string (YYYY-MM-DD) or empty string if invalid
 */
export const toDateInputValue = (date: any): string => {
  try {
    if (!date) return ''
    const dateObj = parseDate(date)
    return dateObj.toISOString().split('T')[0]
  } catch (error) {
    console.warn('Error converting to date input:', error, 'for date:', date)
    return ''
  }
}