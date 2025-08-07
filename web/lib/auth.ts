// web/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('AUTH_OPTIONS: "authorize" function called.');
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          console.log('AUTH_OPTIONS: Credentials VALID. Returning user.');
          return { id: '1', name: 'Admin' };
        }
        console.log('AUTH_OPTIONS: Credentials INVALID.');
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('AUTH_OPTIONS: "jwt" callback called.', { token, user });
      return token;
    },
  },
};