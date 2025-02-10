import { getServerSession } from "next-auth";
// import { Authenticate } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod"
import { authOptions } from "@/lib/authenticate";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                {
                    message: "Unauthorized"
                },
                {
                    status: 401
                }
            )
        }

        const user = await prismaClient.user.findFirst({
            where: { email: session.user?.email ?? "" }
        })

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json({ userId: user.id })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Error fetching user id"
            },
            {
                status: 500
            }
        )
    }
}