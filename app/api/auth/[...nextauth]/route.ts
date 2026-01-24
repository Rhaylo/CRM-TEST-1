<<<<<<< HEAD

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

=======
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Check credentials
                const validEmail = 'info@xyreholdings.com';
                const validPassword = process.env.AUTH_PASSWORD || 'XyreHoldings76!@';

                if (credentials.email === validEmail && credentials.password === validPassword) {
                    return {
                        id: '1',
                        email: 'info@xyreholdings.com',
                        name: 'Xyre Holdings Admin'
                    };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
export { handler as GET, handler as POST };
