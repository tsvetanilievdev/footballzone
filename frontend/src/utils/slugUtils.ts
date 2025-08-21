// Utility functions for generating URL-safe slugs from Bulgarian text

const cyrillicToLatin: { [key: string]: string } = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 
  'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 
  'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 
  'ь': 'y', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
  'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
  'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A',
  'Ь': 'Y', 'Ю': 'Yu', 'Я': 'Ya'
}

/**
 * Converts Bulgarian/Cyrillic text to URL-safe slug
 * @param text - The text to convert to slug
 * @param maxLength - Maximum length of the slug (default: 50)
 * @returns URL-safe slug
 */
export function generateSlug(text: string, maxLength: number = 50): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  // Convert Cyrillic to Latin
  let slug = text
    .split('')
    .map(char => cyrillicToLatin[char] || char)
    .join('')

  // Convert to lowercase and clean up
  slug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens

  // Ensure minimum length
  if (slug.length < 3) {
    const timestamp = Date.now().toString().slice(-6)
    slug = slug ? `${slug}-${timestamp}` : `article-${timestamp}`
  }

  // Truncate if too long
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength).replace(/-[^-]*$/, '') // Remove partial word at end
  }

  return slug
}

/**
 * Generates a unique slug by appending a number if the slug already exists
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 */
export function makeSlugUnique(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  let counter = 1
  let uniqueSlug = `${baseSlug}-${counter}`
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
  }

  return uniqueSlug
}

/**
 * Validates if a slug meets the requirements (3+ characters, URL-safe)
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false
  }

  // Must be at least 3 characters
  if (slug.length < 3) {
    return false
  }

  // Must contain only lowercase letters, numbers, and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false
  }

  // Cannot start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false
  }

  // Cannot have consecutive hyphens
  if (slug.includes('--')) {
    return false
  }

  return true
}