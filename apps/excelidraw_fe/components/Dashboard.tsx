"use client";

import { BACKEND_URL } from "@/config";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import axios from "axios";
import { LoaderIcon, DoorOpen, Plus, Users } from "lucide-react";
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
        return <div className="h-screen w-screen flex justify-center items-center bg-slate-950">
            <LoaderIcon size={36} className="animate-spin text-blue-500" />
        </div>
    }

    async function join_room() {
        const roomslug = joinroomRef.current?.value.trim();

        const res = await axios.get(`${BACKEND_URL}/room/${roomslug}`, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        })

        console.log(res);

        const roomId = res.data.roomId;

        if (roomId == undefined) {
            toast.error("Room does not exist!");
            return;
        }

        toast.success(`Welcome to ${roomslug}`);
        router.push(`/canvas/${roomId}`);

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

            toast.success(`${roomName} has been created!`);
            router.push(`/canvas/${roomId}`)

        } catch (e) {
            toast.error("Room already exists!");
        }
    }

    return (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 h-screen w-screen overflow-hidden flex items-center justify-center p-4">
            <ToastContainer 
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-xl">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Room Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Join or Create your collaborative space
                    </p>
                </div>

                {/* Dashboard Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                    {/* Join Room Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <DoorOpen className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">
                                Join Existing Room
                            </h3>
                        </div>
                        <Input 
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                            placeholder="Enter room name or slug" 
                            type="text" 
                            reference={joinroomRef} 
                        />
                        <Button 
                            onClick={() => join_room()} 
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Join Room
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">
                            OR
                        </span>
                        <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    {/* Create Room Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Plus className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">
                                Create New Room
                            </h3>
                        </div>
                        <Input 
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                            placeholder="Enter room name" 
                            reference={createroomRef} 
                            type="text" 
                        />
                        <Button 
                            onClick={() => create_Room()} 
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Create Room
                        </Button>
                    </div>
                </div>
                <p className="text-center text-slate-500 text-xs mt-6">
                    Start collaborating with your team in real-time
                </p>
            </div>
        </div>
    );
}