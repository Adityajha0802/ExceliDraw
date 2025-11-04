"use client";

import { useEffect, useRef, useState } from "react"
import {  ArrowRight, Circle, Hand, RectangleHorizontalIcon, SlashIcon } from "lucide-react";
import { Icon } from "./Icons";
import { Draw } from "@/Draw/Draw";

export type Tool = "rectangle" | "circle" | "line" | "arrow" | "panning";
export function Canvas({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [draw,setDraw]=useState<Draw>()
    const [currentTool, setCurrentTool] = useState<Tool>("circle");

    useEffect(() => {
        draw?.setTool(currentTool);
    }, [currentTool,draw])


    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const d = new Draw(canvas,roomId,socket);
            setDraw(d);

            return ()=>{
                d.destroy();
            }
        }

    }, [canvasRef])

    return <div style={{
        height: "100vh",
        overflow: "hidden",
    }}>
        <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool} />
        <canvas className="cursor-crosshair" ref={canvasRef}></canvas>
    </div>

}

function ToolBar({ currentTool, setCurrentTool }: {
    currentTool: Tool,
    setCurrentTool: (s: Tool) => void
}) {
    return <div className="m-1 flex justify-center text-allign">
        <Icon icon={<Circle />} onClick={() => {
            setCurrentTool("circle")
        }} activated={currentTool === "circle"} />
        <Icon icon={<RectangleHorizontalIcon />} onClick={() => {
            setCurrentTool("rectangle")
        }} activated={currentTool === "rectangle"} />
        <Icon icon={<SlashIcon />} onClick={() => {
            setCurrentTool("line")
        }} activated={currentTool === "line"} />
        <Icon icon={<ArrowRight/>} onClick={() => {
            setCurrentTool("arrow")
        }} activated={currentTool === "arrow"} />
        <Icon icon={<Hand/>} onClick={() => {
            setCurrentTool("panning")
        }} activated={currentTool === "panning"} />
    </div>
}