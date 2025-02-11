import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { authOptions } from "@/lib/authenticate";

// const YT_REGEX = new RegExp("/^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/");


const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;


const CreateStreamSchema = z.object({
    url: z.string(),
    room_id: z.string()
})


export async function POST(req: NextRequest) {
    try{

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


        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);

        if(!isYt) {
            return NextResponse.json({
                message: "Wrong url format"
            }, {
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1];

        const videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = videoDetails.thumbnail.thumbnails;
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);



        await prismaClient.stream.create({      
            data: {
                userId: user.id,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: videoDetails.title ?? "Video title not found",
                smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url)
                 ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                roomId: data.room_id
            }
        });

        return NextResponse.json({
            message: "Stream added"
        })
    }    catch(e){
        return NextResponse.json({
            message: "Error while adding data"
        }, {
            status: 411
        })
    }
}

export async function GET(req: NextRequest) {
    const room_id = req.nextUrl.searchParams.get("room_id");
    const streams = await prismaClient.stream.findMany({
        where: {
            roomId: room_id ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}


