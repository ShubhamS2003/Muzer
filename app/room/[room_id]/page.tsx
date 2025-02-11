"use client"

import { Appbar } from "@/app/components/Appbar";
import { Redirect_To_Home } from "@/app/components/redirect";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, User, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Room {
    id: string;
    name: string;
    genre: string;
    live: boolean
    user: {
        email: string,
        id: string,
        name: string,
    },
    userId: string;
}

interface Stream {
    id: string
}

export default function RoomPage({ params }: { params: { room_id: string } }) {
    const router = useRouter();
    const { room_id } = params
    const { data: session } = useSession();
    const searchParams = useSearchParams();

    const [newroom, setNewroom] = useState<Room | null>(null);

    const [queue, setQueue] = useState<Stream[]>([]);

    useEffect(() => {
        // if (!session) {
        //     router.push("/home");
        // }

        if (room_id) {
            const fetchRoomData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/rooms?room_id=${room_id}`);
                    // console.log(response);
                    if (!response.ok) {
                        throw new Error("Failed to fetch room data");
                    }
                    const jsonResponse = await response.json();
                    console.log(jsonResponse.room);
                    setNewroom(jsonResponse.room);

                } catch (e) {
                    console.error(e);
                }
            };

            fetchRoomData();
        }
    }, [router, session, room_id]);

    const goLive = async (roomId: string) => {
        // console.log(roomId);
        const response = await fetch(`/api/rooms/live`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId })
        })

        const roomData = await response.json();
        // console.log(roomData);

        if (response.ok) {
            router.push(`/dashboard`);
        } else {
            console.error("Failed to end stream");
        }
    }

    if (!session) {
        return null;
    }

    if (!newroom) {
        return <p>Loading room details...</p>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Recheck the redirection */}
            <Redirect_To_Home />
            <Appbar />
            {newroom.live == true &&
                <main className="mb-6 flex flex-col items-center">
                    <div className="flex items-center mb-2">
                        <Music className="h-8 w-8 text-purple-400 mr-2" />
                        <h1 className="text-2xl font-bold text-purple-400">{newroom.name}</h1>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center mb-4">
                        <User className="mr-1 h-3 w-3" />
                        Hosted by {newroom.user.name}
                    </p>
                    <div className="flex justify-center w-full">
                        {session.user?.email == newroom.user.email && <Button onClick={() => goLive(room_id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                            End stream
                        </Button>}
                        {session.user?.email != newroom.user.email && <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold">
                            Leave Room
                        </Button>}
                    </div>
                </main>
            }
            {newroom.live == false &&
                <main className="mb-6 flex flex-col items-center">
                    <p>Room is not Live</p>
                </main>
            }
            <footer className="py-6 px-4 md:px-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 text-center">© 2024 Muzer. All rights reserved.</p>
            </footer>
        </div>
    );
}




