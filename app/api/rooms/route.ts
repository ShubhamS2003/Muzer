import { getServerSession } from "next-auth";
// import { Authenticate } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod"
import { authOptions } from "@/lib/authenticate";
import { redirect } from "next/navigation";

const CreateRoomSchema = z.object({
    genre: z.string(),
    name: z.string()
})

export async function POST(req: NextRequest) {
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

    // NextResponse.json({message: "Hi there!"}, {status: 200 });

    // console.log(session);

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    // console.log(user);

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
        const data = CreateRoomSchema.parse(await req.json());
        const room = await prismaClient.room.create({
            data: {
                userId: user.id,
                genre: data.genre,
                name: data.name
            }
        })

        // console.log(room);

        return NextResponse.json(
            {
                message: "Room created",
                room
            }
        )
    } catch (e) {
        return NextResponse.json(
            {
                message: "Error while creating room"
            },
            {
                status: 403
            }
        )
    }


}

export async function GET(req: NextRequest) {
    try {
        const roomId = req.nextUrl.searchParams.get("room_id");
        // console.log(roomId);
        const room = await prismaClient.room.findUnique({
            where: {
                id: roomId ?? ""
            },
            include: {
                user: true
            }
        })

        // console.log(room);

        return NextResponse.json(
            {
                room
            }
        )
    } catch (e) {
        return NextResponse.json(
            {
                message: "Error while creating room"
            }
        )
    }
}
