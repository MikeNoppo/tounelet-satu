import path from 'path'
import { uploadBlob, deleteBlob, extractBlobNameFromUrl } from './azure-storage'

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
}

export interface UploadOptions {
  folder: 'banners' | 'gallery' | 'potentials' | 'structure' | 'posts'
  maxSize?: number
  allowedTypes?: string[]
  customFilename?: string
}

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export async function validateFile(file: File, options?: { maxSize?: number; allowedTypes?: string[] }): Promise<ValidationResult> {
  const maxSize = options?.maxSize || UPLOAD_CONFIG.maxFileSize
  const allowedTypes = options?.allowedTypes || UPLOAD_CONFIG.allowedTypes

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB` 
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipe file tidak diperbolehkan. Hanya JPG, PNG, GIF, WEBP' 
    }
  }

  const ext = path.extname(file.name).toLowerCase()
  if (!UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
    return { 
      valid: false, 
      error: 'Ekstensi file tidak valid' 
    }
  }

  return { valid: true }
}

export async function uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
  try {
    const validation = await validateFile(file, {
      maxSize: options.maxSize,
      allowedTypes: options.allowedTypes
    })

    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const baseFilename = options.customFilename || `${timestamp}`
    
    const filename = `${baseFilename}${ext}`.replace(/[^a-zA-Z0-9.-]/g, '_')
    const blobName = `${options.folder}/${filename}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const url = await uploadBlob(buffer, blobName, file.type)

    return { success: true, url }
  } catch (error) {
    console.error('Upload file error:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    if (!url) {
      return false
    }

    const blobName = extractBlobNameFromUrl(url)
    if (!blobName) {
      return false
    }
    
    return await deleteBlob(blobName)
  } catch (error) {
    console.error('Delete file error:', error)
    return false
  }
}
