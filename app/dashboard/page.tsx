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
  live: boolean;
  user: {
    email: string,
    id: string,
    name: string,
  },
  userId: string;
}

export default function Dashboard() {
  const router = useRouter();
  const session = useSession();


  const [newRoom, setNewRoom] = useState({ name: '', genre: '' })
  const [myRooms, setMyRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const user = await fetch('/api/user');
        const response = await fetch(`/api/rooms/myrooms?user_id=${user}`);
        const roomData = await response.json();
        setMyRooms(roomData.myRooms);
      } catch (e) {
        console.error("Error fetching live rooms: ", e);
      }
    };

    fetchMyRooms();
  }, []);


  const handleCreateRoom = (field: string, value: string) => {
    setNewRoom((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoom)
    });

    const roomData = await response.json();

    if (response.ok) {
      router.push(`/room/${roomData.room.id}`);
    } else {
      console.error("Failed to create room");
    }
  }

  const goLive = async(roomId: string) => {
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
      router.push(`/room/${roomData.data.id}`);
    } else {
      console.error("Failed to go live");
    }


  }

  const genres = [
    "Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Classical", "Electronic", "Blues",
    "Reggae", "Folk", "Metal", "Punk", "Soul", "Funk", "Disco", "Techno", "House", "Ambient",
    "Indie", "Alternative", "Grunge", "Rap", "Latin", "World", "Lo-fi", "Trap", "Dubstep"
  ]

  // console.log(session.data?.user)
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Redirect_To_Home />
      <Appbar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              className="flex-grow bg-gray-800 border-gray-700 text-white"
              placeholder="Search for a room..."
            />
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <Radio className="mr-2 h-4 w-4" /> Search
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> Create Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Create a New Room</DialogTitle>
                  <DialogDescription>
                    Set up your room and start streaming music!
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input
                      id="room-name"
                      placeholder="Enter room name"
                      value={newRoom.name}
                      onChange={(e) => handleCreateRoom('name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-genre">Genre</Label>
                    <Select
                      value={newRoom.genre}
                      onValueChange={(value) => handleCreateRoom('genre', value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black">
                    Create Room
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRooms.map((room) => (
              <Card key={room.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{room.name}</CardTitle>
                  <CardDescription className="text-gray-400">{room.genre}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-400">
                      <Radio className="mr-2 h-4 w-4" />
                      <span>{room.live ? 'Live' : 'Offline'}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <User className="mr-2 h-4 w-4" />
                      <span>0 listeners</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => goLive(room.id)}
                    className='w-full mt-4 bg-red-600 hover:bg-red-700 bg-green-500 hover:bg-green-600 text-white font-semibold'
                  >
                    Go live
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main >
      <footer className="py-6 px-4 md:px-6 border-t border-gray-800">
        <p className="text-sm text-gray-400 text-center">© 2024 Muzer. All rights reserved.</p>
      </footer>
    </div >
  )
}

// toggle for going live
// header for your rooms