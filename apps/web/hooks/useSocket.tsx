import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";


export function useSocket(){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>();

    useEffect( ()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MTQ4MzcwfQ.4H4tvO-AGo0I8FPPACK7H37fxwyIyaKcam_tCZbxN2Y`);
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return {
        loading,
        socket
    };
}