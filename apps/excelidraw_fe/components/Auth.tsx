"use client";

import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";

export const Auth = ({
    isSignin
}: {
    isSignin: boolean
}) => {

    const [mounted,setMounted]=useState(false);

    useEffect(()=>{
        setMounted(true);
    },[])

    if(!mounted){
        return null;
    }

    return <div className="h-screen w-screen flex justify-center items-center">
        <div className="rounded-lg p-6 min-h-80 min-w-80 shadow-lg bg-white">
            <div className="text-blue-700 flex justify-center m-2  text-4xl italic font-semibold">
                {isSignin ? "Sign In" : "Sign Up"}
            </div>
            <div className="text-black flex justify-center items-center m-2  text-sm">
                {isSignin ? "Enter your credentials to access your account" : "Create your account"}
            </div>
            <div>
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="username" type="text" />
            </div>
            {!isSignin && (
                <div>
                    <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="email" type="email" />
                </div>
            )}
            <div>
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="password (6+ characters)" type="password" />
            </div>
            <div >
                <Button className="text-lg p-3 m-1 mt-2 bg-blue-700 text-white  w-full rounded-md font-medium cursor-pointer" children={isSignin ? "Sign In" : "Sign Up"} />
            </div>
        </div>
    </div>
}
