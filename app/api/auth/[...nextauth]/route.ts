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

                // Credentials check
                const allowedEmails = ['info@xyreholdings.com', 'adrian@xyreholdings.com'];
                const envPassword = process.env.AUTH_PASSWORD;
                const defaultPassword = 'XyreHoldings76!@';

                // Allow login if password matches Env var (if set/changed) OR the default hardcoded one
                const isValidPassword = (envPassword && envPassword !== 'CHANGE_ME' && credentials.password === envPassword) ||
                    (credentials.password === defaultPassword);

                if (allowedEmails.includes(credentials.email.toLowerCase()) && isValidPassword) {
                    return {
                        id: '1',
                        email: credentials.email,
                        name: 'Xyre Holdings Admin'
                    };
                }

                console.log('Login failed for:', credentials.email);
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
export { handler as GET, handler as POST };
