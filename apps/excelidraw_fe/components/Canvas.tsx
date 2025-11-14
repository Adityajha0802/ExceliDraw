"use client";

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Circle, Hand, LogOut, RectangleHorizontalIcon, SlashIcon } from "lucide-react";
import { Icon } from "./Icons";
import { Draw } from "@/Draw/Draw";
import { useRouter } from "next/navigation";

export type Tool = "rectangle" | "circle" | "line" | "arrow" | "panning" | "leave";
export function Canvas({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [draw, setDraw] = useState<Draw>()
    const [currentTool, setCurrentTool] = useState<Tool>("panning");
    const router = useRouter();

    useEffect(() => {
        draw?.setTool(currentTool);
        if (currentTool === "leave") {
        socket.send(JSON.stringify({
            type: "leave_room",
            roomId: roomId
        }));
        
        router.push("/dashboard");
    }
    }, [currentTool, draw])


    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const d = new Draw(canvas, roomId, socket);
            setDraw(d);

            return () => {
                d.destroy();
            }
        }

    }, [canvasRef])

    return <div style={{
        height: "100vh",
        overflow: "hidden",
    }}>
        <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool} />
        <>{currentTool === "panning" ? <canvas className="cursor-pointer" ref={canvasRef}></canvas> : <canvas className="cursor-crosshair" ref={canvasRef}></canvas>}
        </>
    </div>

}

function ToolBar({ currentTool, setCurrentTool }: {
    currentTool: Tool,
    setCurrentTool: (s: Tool) => void
}) {
    return <div className="m-1 flex justify-center text-allign">
        <Icon icon={<Hand />} onClick={() => {
            setCurrentTool("panning")
        }} activated={currentTool === "panning"} />
        <Icon icon={<Circle />} onClick={() => {
            setCurrentTool("circle")
        }} activated={currentTool === "circle"} />
        <Icon icon={<RectangleHorizontalIcon />} onClick={() => {
            setCurrentTool("rectangle")
        }} activated={currentTool === "rectangle"} />
        <Icon icon={<SlashIcon />} onClick={() => {
            setCurrentTool("line")
        }} activated={currentTool === "line"} />
        <Icon icon={<ArrowRight />} onClick={() => {
            setCurrentTool("arrow")
        }} activated={currentTool === "arrow"} />
        <Icon icon={<LogOut color="red"/>} onClick={() => {
            setCurrentTool("leave")
        }} activated={currentTool === "leave"} />
    </div>
}