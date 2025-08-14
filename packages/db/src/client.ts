import { PrismaClient } from '@prisma/client'
import path from 'path'

// Try to require Electron's app if available
function ensureElectronPrisma() {
  let userData: string | undefined = undefined
  try {
    // Try to use electron.app.getPath if running in Electron main
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const electron = require('electron')
    userData = electron.app?.getPath?.('userData')
  } catch {}
  if (userData) {
    process.env.DATABASE_URL = `file:${path.join(userData, 'db.sqlite')}`
  } else if (process.env.DATABASE_URL == null) {
    // Fallback for CLI/dev: .localdb in project root
    process.env.DATABASE_URL = `file:${path.resolve(process.cwd(), '.localdb', 'db.sqlite')}`
  }
}

ensureElectronPrisma()

export const prisma = new PrismaClient()
export const db = prisma

export * from '@prisma/client'
