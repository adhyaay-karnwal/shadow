/**
 * Placeholder for future Postgres -> SQLite migration.
 * For now: skips if DATABASE_URL is Postgres; logs warning.
 */
import { prisma } from '../src';

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  console.warn('Postgres-to-SQLite migration is not yet implemented. Please export data manually.');
  process.exit(0);
} else {
  console.log('No Postgres DATABASE_URL found. Skipping migration.');
  process.exit(0);
}