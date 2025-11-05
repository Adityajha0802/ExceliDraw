"use client";

import { BACKEND_URL } from "@/config";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const DashboardComponent = () => {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const joinroomRef = useRef<HTMLInputElement>(null);
    const createroomRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        setMounted(true);
        setLoading(false)
    }, [])

    if (!mounted || loading) {
        return <div className="h-screen w-screen flex justify-center items-center ">
            <LoaderIcon size={36} />
        </div>
    }

    async function join_room() {
        const roomslug = joinroomRef.current?.value.trim();

        try {
            const res = await axios.get(`${BACKEND_URL}/room/${roomslug}`, {
                headers: {
                    "authorization": localStorage.getItem("token")
                }
            })

            console.log(res);

            const roomId = res.data.roomId;

            router.push(`/canvas/${roomId}`);
            toast.success(`Welcome to ${roomslug}`);

        } catch (e) {
            toast.error("Room doesnot exists!");
        }
    }

    async function create_Room() {
        const roomName = createroomRef.current?.value.trim();

        try {
            const res = await axios.post(`${BACKEND_URL}/room`, {
                roomName: roomName
            },
                {
                    headers: {
                        "authorization": localStorage.getItem("token")
                    }
                })

            console.log(res);

            const roomId = res.data.roomId;
            
            router.push(`/canvas/${roomId}`)
            toast.success(`${roomName} has been created!`);

        } catch (e) {
            toast.error("Room already exists!");
        }
    }

    return <div className="bg-slate-900 h-screen w-screen overflow-hidden">
        <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
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
                    <Input className=" mt-2 w-full rounded-md  p-2 shadow-md border border-gray-700" placeholder="slug" type="text" reference={joinroomRef} />
                </div>
                <div>
                    <Button onClick={() => {
                        join_room()
                    }} className="mt-1 w-36 border border-gray-800 cursor-pointer p-3 bg-blue-700 text-white rounded-md text-md font-medium " children={"Join Room"} />
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
                    <Input className="w-full rounded-md mt-2  p-2 shadow-md border border-gray-700" placeholder="Enter room name" reference={createroomRef} type="text" />
                </div>
                <div>
                    <Button onClick={() => {
                        create_Room()
                    }} className="mt-1 border border-gray-800 w-full cursor-pointer p-3 bg-purple-700 text-white rounded-md text-md font-medium " children={"Create Room"} />
                </div>
            </div>
        </div>
    </div>
}