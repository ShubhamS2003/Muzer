import { getServerSession } from "next-auth";
// import { Authenticate } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod"
import { authOptions } from "@/lib/authenticate";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        NextResponse.json(
            {
                message: "Not Authorized"
            },
            {
                status: 404
            }
        )
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json(
            {
                message: "Unauthorized"
            },
            {
                status: 400
            }
        )
    }

    try {
        const myRooms = await prismaClient.room.findMany({
            where: {
                userId: user.id,
                // live: false
            }
        })

        return NextResponse.json({ myRooms });
    } catch (e) {
        return NextResponse.json(
            {
                message: "Error while fetching your rooms"
            },
            {
                status: 403
            }
        )
    }
}