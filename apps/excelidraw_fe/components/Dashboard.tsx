"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { ArrowBigLeftDashIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const DashboardComponent=()=>{
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


    return <div className="h-screen w-screen overflow-hidden">
            <div className="flex justify-center mt-8 font-bold text-white text-4xl italic ">
                Room Dashboard
            </div>
            <div className="flex justify-center mt-1 font-md text-white text-md ">
                Join or Create your collaborative space
            </div>
            <div className="flex justify-center items-center">
            <div className=" mt-12 min-w-80 max-h-96 bg-slate-800 p-6 rounded-lg">
                <div className="mt-2 font-semibold text-white text-medium ">
                    Enter Room Name
                </div>
                <div>
                    <Input className=" mt-2 w-full rounded-md  p-2 shadow-md border border-gray-700" placeholder="slug" type="text"/>
                </div>
                <div>
                    <Button className="mt-1 w-36 border border-gray-800 cursor-pointer p-3 bg-blue-700 text-white rounded-md text-md font-medium " children={"Join Room"}/>
                </div>
                <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400">
                    OR
                </span>
                <div className="flex-grow border-t border-gray-600"></div>
                </div>
                <div className=" font-semibold text-white text-medium ">
                    Create New Room
                </div>
                <div>
                    <Input className="w-full rounded-md mt-2  p-2 shadow-md border border-gray-700" placeholder="Enter room name" type="text"/>
                </div>
                <div>
                    <Button className="mt-1 border border-gray-800 w-full cursor-pointer p-3 bg-purple-700 text-white rounded-md text-md font-medium " children={"Create Room"}/>
                </div>
            </div>
            </div>
    </div>
}