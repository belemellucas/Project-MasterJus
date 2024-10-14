import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const prisma = new PrismaClient()

export const authOptions = {

    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied

                if (!credentials.email || !credentials.password) {
                    return null;
                }

                // user in DB

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    permissions: user?.permissions,
                    imgUser: user?.imgUser
                }


            }
        })
    ],

    callbacks: {

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    username: token.username,
                    role: token.role,
                    permissions: token?.permissions,
                    imgUser: token?.imgUser
                }
            }

        },

        async jwt({ token, user }) {

            // after login jwt token and get the user data from here

            if (user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    permissions: user?.permissions,
                    imgUser: user?.imgUser
                }
            }
            return token
        }
    },

    pages: {
        signIn: '/login'
    },

    debug: process.env.NODE_ENV === 'development',
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET
    },
    secret: process.env.NEXTAUTH_SECRET


}