import bcrypt from 'bcryptjs'
import env from '@/config/environment'

export class PasswordService {
  private static instance: PasswordService
  private saltRounds = env.BCRYPT_SALT_ROUNDS

  static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService()
    }
    return PasswordService.instance
  }

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
    } catch (error) {
      throw new Error('Password hashing failed')
    }
  }

  /**
   * Verify a password against hash
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
      throw new Error('Password verification failed')
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    // Common patterns to avoid
    const commonPatterns = [
      /^(.)\1{7,}$/, // Same character repeated
      /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
      /^(password|123456|qwerty|abc123|admin|football|guest)/i
    ]
    
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains common patterns that are not secure')
        break
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Generate a secure random password
   */
  generateRandomPassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const allChars = uppercase + lowercase + numbers + symbols
    
    let password = ''
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  /**
   * Check if password needs rehashing (when salt rounds change)
   */
  needsRehash(hashedPassword: string): boolean {
    try {
      const rounds = bcrypt.getRounds(hashedPassword)
      return rounds !== this.saltRounds
    } catch {
      return true // If we can't determine rounds, assume it needs rehashing
    }
  }
}

export const passwordService = PasswordService.getInstance()