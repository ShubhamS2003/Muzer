import Image from "next/image";
import { Appbar } from "../components/Appbar";
import { Button } from "@/components/ui/button"
import { Redirect } from "../components/redirect";



export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <Appbar />
            <Redirect />
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-purple-400">
                        Welcome to Muzer
                    </h1>
                    <p className="mx-auto max-w-[600px] text-gray-300 text-xl">
                        Discover, create, and share music like never before.
                    </p>
                    <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold text-lg px-8 py-3">
                        Start Listening
                    </Button>
                </div>
            </main>
        </div>
    );
}

