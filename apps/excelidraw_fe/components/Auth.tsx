"use client"

import {Input} from "@repo/ui/input";
import {Button} from "@repo/ui/button";

export const Auth=({
    isSignin
}:{
    isSignin:boolean
})=>{
    if(isSignin){
        return <div className="h-screen w-screen flex justify-center items-center">
            <div className="  fixed rounded-lg p-6 min-h-80 min-w-80 width-2px bg-white">
            <div className="text-blue-700 flex justify-center m-2  text-4xl italic font-semibold">
                Sign In
            </div>
            <div className="text-black flex justify-center items-center m-2  text-md">
                Enter your credentials to access your account
            </div>
            <div >
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="username" type="text"/> 
            </div>
            <div >
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="password (6+ characters)" type="text"/> 
            </div>
            <div >
                <Button className="text-lg p-3 m-1 bg-blue-700 text-white  w-full rounded-md text-semibold" children="Sign In"/> 
            </div>
        </div>
        </div>
    }
    else{
        return <div className="h-screen w-screen flex justify-center items-center">
            <div className="  fixed rounded-lg p-6 min-h-80 min-w-80 width-2px bg-white">
            <div className="text-blue-700 flex justify-center m-2  text-4xl italic font-semibold">
                Sign Up
            </div>
            <div className="text-black flex justify-center items-center m-2  text-md">
                Create your account
            </div>
            <div >
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="username" type="text"/> 
            </div>
            <div >
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="email" type="text"/> 
            </div>
            <div >
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md " placeholder="password (6+ characters)" type="text"/> 
            </div>
            <div >
                <Button className="text-lg p-3 m-1 bg-blue-700 text-white  w-full rounded-md text-semibold" children="Sign Up"/> 
            </div>
        </div>
        </div>
    }
}