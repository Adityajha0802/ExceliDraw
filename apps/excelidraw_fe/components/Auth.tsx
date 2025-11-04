"use client";

import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useEffect, useRef, useState } from "react";
import { LoaderIcon } from "lucide-react";
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
        return <div className="h-screen w-screen flex justify-center items-center ">
            <LoaderIcon size={36} />
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

            router.push("/dashboard")
            toast.success("You are logged in !");

        } catch (e) {
            toast.error("Invalid usename or password !")
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

            router.push("/signin")
            toast.success("Your account has been created successfully!")


        } catch (e) {
            toast.error("Incorrect credentials!")
        }


    }



    return <div className="bg-slate-900 h-screen w-screen overflow-hidden ">
        <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" />
        <div className="flex justify-center mt-8 font-bold text-white text-4xl italic ">
            {isSignin?"Welcome Back !":"Welcome to Collaborative Draw application"}
        </div>

        <div className="text-blue-800 flex justify-center items-center m-2  text-2xl">
                {isSignin ? "Enter your credentials to access your account" : "Create your account"}
            </div>
        <div className="flex justify-center items-center">
        <div className="mt-16 rounded-lg p-6 min-h-72 min-w-80 shadow-lg bg-white">
            <div className="text-blue-900 flex justify-center m-2  text-4xl italic font-semibold">
                {isSignin ? "Sign In" : "Sign Up"}
            </div>
            <div>
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md shadow-md " reference={usernameRef} placeholder="username" type="text" />
            </div>
            {!isSignin && (
                <div>
                    <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md shadow-md" reference={emailRef} placeholder="email" type="text" />
                </div>
            )}
            <div>
                <Input className="p-2 m-1 placeholder-gray-500 text-black border border-gray-200 w-full rounded-md shadow-md " reference={passwordRef} placeholder="password (5+ characters)" type="password" />
            </div>
            <div >
                <Button onClick={() => {
                    { isSignin ? Signin() : Signup() }
                }} className="text-lg p-3 m-1 mt-3 bg-blue-700 text-white  w-full rounded-md font-normal cursor-pointer border border-gray-600 shadow-lg" children={isSignin ? "Sign In" : "Sign Up"} />
            </div>
        </div>
        </div>
    </div>
}
