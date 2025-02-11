import { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google"
import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";

export const authOptions : NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
      })
    ],
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      async signIn(params) {
        if(!params.user.email){
          return false;
        }
        try{
          await prismaClient.user.create({
            data: {
              email: params.user.email,
              provider: "Google",
              name: params.user.name ?? "Muzi",
              imageUrl: params.user.image ?? ""
            }
          })
        } catch(e) {
          NextResponse.json(
            {
              message: "Error while signing up"
            },
            {
              status: 403
            }
          )

          // console.error("Error while signing up", e);
          // return false;
        }
        return true;
      },
    },
    debug: true
}