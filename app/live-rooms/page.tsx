'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Music, User, Settings, HelpCircle, LogOut, Plus, Headphones, Radio } from "lucide-react"
import Link from "next/link"
import { Appbar } from '../components/Appbar'
import { useSession } from 'next-auth/react'
import { Redirect_To_Home } from '../components/redirect'
import { useRouter } from 'next/navigation'

interface Room {
    id: string;
    name: string;
    genre: string;
    user: {
        email: string,
        id: string,
        name: string,
    },
    userId: string;
}


export default function LiveRoom() {
    const [liveRooms, setLiveRooms] = useState<Room[]>([]);
    const router = useRouter();

    const joinRoom = (roomId: string) => {
        router.push(`/room/${roomId}`)
    }

    useEffect(() => {
        const fetchLiveRooms = async () => {
            try {
                const response = await fetch('/api/rooms/live');
                const roomData = await response.json();
                // console.log(roomData);
                setLiveRooms(roomData.liveRooms);
            } catch (e) {
                console.error("Error fetching live rooms: ", e);
            }
        };

        fetchLiveRooms();
    }, []);


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <Appbar />
            <main className="flex-1 p-6">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="mt-12 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">Live Rooms</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {liveRooms.map((room) => (
                                <Card key={room.id} className="bg-gray-800 border-gray-700 w-full max-w-md m-2">
                                    <CardHeader>
                                        <CardTitle className="text-white">{room.name}</CardTitle>
                                        <CardDescription className="text-gray-400">{room.genre}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-gray-400">
                                                <Headphones className="mr-2 h-4 w-4" />
                                                <span>listening</span>
                                            </div>
                                            <div className="flex items-center text-gray-400">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>{room.user.name}</span>
                                            </div>
                                        </div>
                                        <Button onClick={() => joinRoom(room.id)} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                                            Join Room
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-6 px-4 md:px-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 text-center">© 2024 Muzer. All rights reserved.</p>
            </footer>
        </div>
    )
}