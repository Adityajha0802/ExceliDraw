"use client";

import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useEffect, useRef, useState } from "react";
import { LoaderIcon, Pencil, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Auth = ({
    isSignin
}: {
    isSignin: boolean
}) => {

    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        setLoading(false)
    }, [])

    if (!mounted || loading) {
        return <div className="h-screen w-screen flex justify-center items-center bg-slate-950">
            <LoaderIcon size={36} className="animate-spin text-blue-500" />
        </div>
    }

    async function Signin() {
        const username = usernameRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();

        try {
            const res = await axios.post(`${BACKEND_URL}/signin`, {
                username,
                password
            })

            const jwt = res.data.token;
            localStorage.setItem("token", jwt)
            console.log(res);

            toast.success("You are logged in!");
            router.push("/dashboard")

        } catch (e) {
            toast.error("Invalid username or password!")
        }
    }

    async function Signup() {
        const username = usernameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();

        try {
            const res = await axios.post(`${BACKEND_URL}/signup`, {
                username,
                email,
                password
            })

            console.log(res);

            toast.success("Your account has been created successfully!")
            router.push("/signin")

        } catch (e) {
            toast.error("Incorrect credentials. Username or Password must be at least 5 characters long!")
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
                        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-xl">
                            {isSignin ? (
                                <Users className="w-8 h-8 text-white" />
                            ) : (
                                <Pencil className="w-8 h-8 text-white" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {isSignin ? "Welcome Back!" : "Join Us"}
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        {isSignin 
                            ? "Enter your credentials to access your account" 
                            : "Create your account to start collaborating"}
                    </p>
                </div>

                {/* Auth Form */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <Input 
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                reference={usernameRef} 
                                placeholder="Enter your username" 
                                type="text" 
                            />
                        </div>

                        {!isSignin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <Input 
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    reference={emailRef} 
                                    placeholder="Enter your email" 
                                    type="email" 
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <Input 
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                reference={passwordRef} 
                                placeholder="Enter your password (5+ characters)" 
                                type="password" 
                            />
                        </div>

                        <Button 
                            onClick={() => {
                                isSignin ? Signin() : Signup()
                            }} 
                            className="w-full py-3 mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSignin ? "Sign In" : "Create Account"}
                        </Button>
                    </div>

                    {/* Toggle Auth Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            {isSignin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => router.push(isSignin ? "/signup" : "/signin")}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                {isSignin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    Collaborative Draw - Create together in real-time
                </p>
            </div>
        </div>
    );
}