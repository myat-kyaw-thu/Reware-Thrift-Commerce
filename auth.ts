/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { authConfig } from './auth.config';
import { comparePassword } from './lib/encrypt';


export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials:', credentials);

        if (
          !credentials ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string' ||
          credentials.password.trim() === ''
        ) {
          console.log('Invalid credentials input');
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || typeof user.password !== 'string') {
          console.log('User not found or missing password');
          return null;
        }

        const isMatch = await comparePassword(credentials.password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
          console.log('Password does not match');
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      ,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === 'NO_NAME') {
          token.name = user.email?.split('@')[0] ?? 'User';

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
