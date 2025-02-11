import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";

const UpvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if(!session?.user?.email){
        return NextResponse.json(
            {
            message: "Unauthorized"
            }, 
            {
                status: 403
            }
        )
    }

    //4465


    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if(!user){
        return NextResponse.json(
            {
                message: "Unauthorized"
            }
        )
    } 

    try {
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
    } catch(e) {
        return NextResponse.json(
            {
                message: "Error while downvoting"
            },
            {
                status: 403
            }
        )
    }


}

