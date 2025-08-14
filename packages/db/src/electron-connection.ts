import { PrismaClient } from '@prisma/client';
import path from 'path';

let prisma: PrismaClient | undefined;

function isElectron() {
  // Both main and renderer
  return !!(process && process.versions && process.versions.electron);
}

function getUserDataPath(): string {
  if (isElectron()) {
    // Main process: require('electron').app.getPath('userData')
    // Renderer: require('electron').remote.app.getPath('userData')
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const electron = require('electron');
      const app = electron.app || (electron.remote && electron.remote.app);
      if (app) return app.getPath('userData');
    } catch (e) {
      // fallback
    }
  }
  // fallback for dev/CLI
  return path.resolve(process.cwd(), '.localdb');
}

export function ensureElectronPrisma(): PrismaClient {
  if (!prisma) {
    if (isElectron()) {
      const userData = getUserDataPath();
      const dbPath = path.join(userData, 'shade.db');
      process.env.DATABASE_URL = `file:${dbPath}`;
    } else if (!process.env.DATABASE_URL) {
      // fallback for dev CLI: .localdb/shade.db
      const dbPath = path.resolve(process.cwd(), '.localdb', 'shade.db');
      process.env.DATABASE_URL = `file:${dbPath}`;
    }
    prisma = new PrismaClient();
  }
  return prisma;
}