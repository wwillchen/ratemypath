/* eslint-disable prefer-promise-reject-errors */
import { createHash } from 'crypto';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

// boilerplate route from 
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'bruno@gmailcom',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        if (!credentials?.password || !credentials?.email) {
          return Promise.reject('No Username or Password');
        }
        const hash = createHash('sha256')
          .update(credentials.password)
          .digest('hex');
        const user = {
          email: credentials.email,
          password: hash,
        };
        console.log(user);
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/get-user`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        console.log(res.status);
        const js = await res.json();
        console.log(js);
        if (js.error) {
          return Promise.reject('Server Error');
        }

        if (!js.exists) {
          return Promise.reject('Create Account. Existing one does not exist');
        }

        if (!js.auth) {
          // Any object returned will be saved in `user` property of the JWT
          return null;
        }
        // If you return null then an error will be displayed advising the user to check their details.
        return {
          id: js.id,
          email: credentials.email,
        };

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
