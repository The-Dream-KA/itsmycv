import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Secure token generation and verification for CV URLs
const ENCRYPTION_KEY = process.env.CV_ENCRYPTION_KEY || 'default-key-change-in-production-32b' // Must be 32 bytes
const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

export function encryptCVId(cvId: string, userId: string): string {
  try {
    // Create a payload with CV ID, user ID, and timestamp
    const payload = JSON.stringify({
      cvId,
      userId,
      timestamp: Date.now()
    })

    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0'))
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(payload, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Combine IV and encrypted data, then base64url encode
    const combined = iv.toString('hex') + ':' + encrypted
    return Buffer.from(combined).toString('base64url')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt CV ID')
  }
}

export function decryptCVToken(token: string): { cvId: string; userId: string } | null {
  try {
    // Decode base64url
    const combined = Buffer.from(token, 'base64url').toString('utf8')
    const [ivHex, encrypted] = combined.split(':')

    if (!ivHex || !encrypted) {
      return null
    }

    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0'))
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    const payload = JSON.parse(decrypted)

    // Validate timestamp (token valid for 7 days)
    const tokenAge = Date.now() - payload.timestamp
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    if (tokenAge > sevenDays) {
      console.warn('Token expired')
      return null
    }

    return {
      cvId: payload.cvId,
      userId: payload.userId
    }
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}
