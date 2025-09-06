"use client";
import { InitDraw } from "@/Draw";
import { useEffect, useRef } from "react"


export function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            InitDraw(canvas,roomId,socket);
        
        }
    }, [canvasRef])

    return <>
        <canvas ref={canvasRef} height={800} width={1600}
        ></canvas>
    </>

}