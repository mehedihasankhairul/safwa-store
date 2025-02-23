import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';
import GoogleProvider from 'next-auth/providers/google'; // Example provider; use others as needed

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Use Prisma with MongoDB
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers (e.g., Email, GitHub, etc.) as needed
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'user'; // Add role to session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Generate a secret (e.g., `openssl rand -hex 32`)
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };