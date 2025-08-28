"use client"

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function Home() {

  const router=useRouter();
  const[roomId,setroomId]=useState("");
  return (
    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      height:"100vh",
      width:"100vw"
    }}>
      <div>
      <input style={{
        padding:8,
        margin:1
      }} value={roomId} onChange={(e)=>{
        setroomId(e.target.value)
      }}type="text" placeholder="RoomId" ></input>
      <div>
        <button style={{
          margin:1,
          padding:10,
          backgroundColor:"blue"
        }} onClick={()=>{
          router.push(`/room/${roomId}`)
        }}>Join Room</button>
      </div>
      </div>
    </div>
  );
}
