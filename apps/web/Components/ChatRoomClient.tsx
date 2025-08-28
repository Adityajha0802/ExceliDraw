"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

export  function ChatRoomClient({
    messages,
    id
}:{
    messages:{message:string}[],
    id:string
}){
    const [chats,setChat]=useState(messages);
    const [currentmessage,setcurrentmessage]=useState("");
    const {loading,socket}=useSocket();

    useEffect(()=>{
        if(socket){
            socket.send(JSON.stringify({
                type:"join_room",
                roomId:id
            }))
        }

    },[socket,id])

    useEffect(()=>{
        if(!loading && socket){
            socket.onmessage=(event)=>{
                const parsedData=JSON.parse(event.data);
                if(parsedData.type==="chat"){
                    setChat(c=>[...c,{message:parsedData.message}])
                }
            }        
        }

    },[loading,socket])

    return <div style={{
        height:"100vh",
        width:"100vw"
    }}>
        {chats.map(m=><div style={{
            padding:2,
            margin:2, 
            color:"white"
        }}>
        {m.message}</div>)}

        <div style={{
            display:"flex",           
            position:"fixed",
            bottom:0,
            left:0,
            right:0,
            margin:2
        }}>
            <div>
            <input style={{width:"90vw",
                padding:8
            }} value={currentmessage} onChange={(e)=>{
                setcurrentmessage(e.target.value)
            }}></input>
            </div>
            <div>
                <button style={{
                    padding:8,
                    width:"10vw",
                    backgroundColor:"green"
                }} onClick={()=>{
                    socket?.send(JSON.stringify({
                        type:"chat",
                        roomId:id,
                        message:currentmessage
                    }))

                    setcurrentmessage("");
                }}>Send</button>
            </div>
        </div>
    </div>
}