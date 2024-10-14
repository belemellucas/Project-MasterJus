import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { authOptions } from "@/app/utils/authOptions"


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
