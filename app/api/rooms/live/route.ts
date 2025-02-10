import { getServerSession } from "next-auth";
// import { Authenticate } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod"
import { authOptions } from "@/lib/authenticate";
import { redirect } from "next/navigation";
import LiveRoom from "@/app/live-rooms/page";

export async function GET(req: NextRequest) {
    try {
        const liveRooms = await prismaClient.room.findMany({
            where: {
                live: true
            },
            include: {
                user: true
            }
        });

        if (liveRooms.length === 0) {
            NextResponse.json({
                message: "No live rooms"
            })
        }

        // conso/le.log(liveRooms);

        return NextResponse.json({ liveRooms });
    } catch (e) {
        return NextResponse.json(
            { message: "Error while fetching rooms" },
            { status: 500 }
        );
    };
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { roomId } = body

        const room = await prismaClient.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            return NextResponse.json(
                { success: false, message: 'Room not found' },
                { status: 404 }
            );
        }

        const streamUpdate = await prismaClient.room.update({
            where: {
                id: roomId
            },
            data: {
                live: !room.live
            }
        })

        // console.log(streamUpdate);

        return NextResponse.json(
            { success: true, data: streamUpdate },
            { status: 200 }
          );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {success: false, message: "Something went wrong"},
            {status: 500}
        )
    }
}