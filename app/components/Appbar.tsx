"use client";

import { sign } from "crypto";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { Music, SignalIcon, User, Settings, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth";


export function Appbar() {
  // console.log("Appbar is rendering");
  const session = useSession();
  // console.log(session.data?.user?.image);
  // console.log(session.data?.user?.email);
  return <div>
    <header className="px-4 lg:px-6 h-16 flex items-center">
      <Link className="flex items-center justify-center text-purple-400" href="/">
        <Music className="h-6 w-6" />
        <span className="ml-2 text-2xl font-bold">Muzer</span>
      </Link>
      <nav className="ml-auto items-center flex gap-4 sm:gap-6">

        <Link href="/live-rooms" passHref>
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
            Live Rooms
          </Button>
        </Link>

        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
          Pricing
        </Button>
      </nav>
      {!session.data?.user && <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signIn()}>SignIn</Button>}
      {/* {session.data?.user && <Button className="ml-4 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signOut()}>Logout</Button>} */}
      <div className="w-px h-6 bg-gray-800 mx-2" />
      {session.data?.user && <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.data?.user?.image || "/placeholder.svg"} alt="User" />
              {/* User image not rendering */}
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      }

    </header>
  </div>
}

// className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white" border-b border-gray-800