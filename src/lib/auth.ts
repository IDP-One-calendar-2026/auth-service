import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { jwt } from 'better-auth/plugins';
import { db } from '../db';
import * as schema from '../db/schema';

export const auth = betterAuth({
  baseURL: import.meta.env.BETTER_AUTH_URL || 'http://localhost:3001',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      ...schema,
    },
  }),
  trustedOrigins: [import.meta.env.VITE_UI_URL, import.meta.env.VITE_API_URL],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt(),
  ],
});

export type AuthType = typeof auth.$Infer.Session.user;
