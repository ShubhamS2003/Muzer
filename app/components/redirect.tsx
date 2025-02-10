"use client"

import { error } from "console";
import { useSession } from "next-auth/react"
import { usePathname, useRouter, redirect } from "next/navigation";
import { useEffect } from "react"


export function Redirect(){
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        if(session?.data?.user) {
            router.push("/dashboard");
        }
    }, [session])
    return null;
}

export function Redirect_To_Home(){
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        if(!session?.data?.user) {
            router.push("/home");
        }
    }, [session])
    return null;
}

export function Redirect_Handler(){
    const router = useRouter();
    router.push("/home");
    return null;
}

// TODO: Redirect to the landing page when the user logs out

