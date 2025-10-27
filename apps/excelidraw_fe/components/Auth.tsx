"use client";

import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";

export const Auth = ({
    isSignin
}: {
    isSignin: boolean
}) => {

    const [mounted,setMounted]=useState(false);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        setMounted(true);
        setLoading(false)
    },[])

    if(!mounted || loading){
        return <div className="h-screen w-screen flex justify-center items-center ">
            <LoaderIcon size={36} />
        </div>
    }

    return <div className="h-screen w-screen flex justify-center items-center">
        <div className="rounded-lg p-6 min-h-80 min-w-80 shadow-lg bg-white">
            <div className="text-blue-800 flex justify-center m-2  text-4xl italic font-semibold">
                {isSignin ? "Sign In" : "Sign Up"}
            </div>
            <div className="text-black flex justify-center items-center m-2  text-sm">
                {isSignin ? "Enter your credentials to access your account" : "Create your account"}
            </div>
            <div>
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md shadow-md " placeholder="username" type="text" />
            </div>
            {!isSignin && (
                <div>
                    <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md shadow-md" placeholder="email" type="email" />
                </div>
            )}
            <div>
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md shadow-md " placeholder="password (6+ characters)" type="password" />
            </div>
            <div >
                <Button className="text-lg p-3 m-1 mt-2 bg-blue-600 text-white  w-full rounded-md font-normal cursor-pointer border border-gray-600 shadow-lg" children={isSignin ? "Sign In" : "Sign Up"} />
            </div>
        </div>
    </div>
}
