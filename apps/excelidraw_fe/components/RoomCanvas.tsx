"use client";
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";


export  const  RoomCanvas=({roomId}:{roomId:string})=>{
    
    const [socket,setSocket]=useState<WebSocket | null>(null);

        useEffect(()=>{
            const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU3MTY2MzkwfQ.A0hZtio_f_jni7eDXF09uC21TKwgN16zHaeobgQ0Ov0`);

            ws.onopen=()=>{
                setSocket(ws);
                ws.send(JSON.stringify({
                    type:"join_room",
                    roomId
                }))
            }
        },[])


        if(!socket){
            return <div>
                Connecting to server...
            </div>
        }
        return <div>
            <Canvas socket={socket} roomId={roomId}/>
        </div>

}