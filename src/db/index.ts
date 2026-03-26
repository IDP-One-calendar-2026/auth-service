import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: `file:${import.meta.env.DATABASE_URL || './auth.db'}`,
});

export const db = drizzle(client, { schema });
