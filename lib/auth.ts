import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins';
import { db } from '#server/utils/use.db.connection';

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({}),
  ],
  logger: {
    level: 'debug',
  },
  advanced: {
    cookiePrefix: 'pkit-pijp',
  },
});

export type Session = typeof auth.$Infer.Session;
