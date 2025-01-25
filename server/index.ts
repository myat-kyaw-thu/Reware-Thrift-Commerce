import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@/server/schema';

const sql = neon(process.env.DATABASE_URL as string);
export const db = drizzle({ client: sql}, {schema, logger: true});

