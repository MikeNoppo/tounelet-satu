import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)
const mkdir = promisify(fs.mkdir)

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

export async function saveFile(
  buffer: Buffer,
  filePath: string,
  contentType: string
): Promise<string> {
  const fullPath = path.join(UPLOAD_DIR, filePath)
  const directory = path.dirname(fullPath)
  
  await ensureDirectoryExists(directory)
  await writeFile(fullPath, buffer)
  
  return `/uploads/${filePath}`
}

export async function removeFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath)
    await unlink(fullPath)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Delete file error:', error)
    }
    return false
  }
}

export function getFileUrl(filePath: string): string {
  return `/uploads/${filePath}`
}

export function extractFilePathFromUrl(url: string): string | null {
  if (!url) return null
  
  const match = url.match(/\/uploads\/(.+)$/)
  if (match) {
    return match[1]
  }
  
  return null
}
