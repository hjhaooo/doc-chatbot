import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/utils/mongodb';

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.JWT_SECRET ?? '',
  adapter: MongoDBAdapter(clientPromise),
  //remove the code below to allow any email domain to sign in
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return (
          profile?.email?.endsWith(process.env.ALLOWED_EMAIL_DOMAIN ?? '') ??
          false
        );
      }
      return true;
    },
  },
  //remove the code above to allow any email domain to sign in
});
