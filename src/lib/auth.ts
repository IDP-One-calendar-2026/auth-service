import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { jwt } from 'better-auth/plugins';
import { db } from '../db';
import * as schema from '../db/schema';

const extraTrustedOrigins = import.meta.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? import.meta.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',').map((o: string) => o.trim())
  : [];

export const auth = betterAuth({
  secret: import.meta.env.BETTER_AUTH_SECRET,
  baseURL: import.meta.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      ...schema,
    },
  }),
  trustedOrigins: [
    import.meta.env.VITE_UI_URL,
    import.meta.env.VITE_API_URL,
    ...extraTrustedOrigins,
  ],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt(),
  ],
});

export type AuthType = typeof auth.$Infer.Session.user;
