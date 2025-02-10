import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authenticate";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }