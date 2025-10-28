"use client";

import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useEffect, useRef, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";

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
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const res = await axios.post(`${BACKEND_URL}/signin`, {
            username,
            password
        })

        const jwt = res.data.token;
        localStorage.setItem("token", jwt)
        console.log(res);

        router.push("/dashboard")

        alert("You are logged in !!");
    }


    async function Signup() {
        const username = usernameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        const res =await axios.post(`${BACKEND_URL}/signup`, {
            username,
            email,
            password
        })

        console.log(res);

        router.push("/signin")

        alert("Your account has been created successfully !!");
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
                }} className="text-lg p-3 m-1 mt-2 bg-blue-600 text-white  w-full rounded-md font-normal cursor-pointer border border-gray-600 shadow-lg" children={isSignin ? "Sign In" : "Sign Up"} />
            </div>
        </div>
    </div>
}
