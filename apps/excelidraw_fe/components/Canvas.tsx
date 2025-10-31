"use client";
import { InitDraw } from "@/Draw";
import { useEffect, useRef, useState } from "react"

import { ArrowBigDown, ArrowBigDownDashIcon, ArrowLeftCircle, ArrowRight, Circle, Eraser, Hand, LetterText, MoveRight, RectangleHorizontalIcon, SlashIcon, Text } from "lucide-react";
import { Icon } from "./Icons";

type shape = "rectangle" | "circle" | "line" | "arrow" | "panning";
export function Canvas({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentTool, setCurrentTool] = useState<shape>("circle");

    useEffect(() => {
        //@ts-ignore
        window.currentTool = currentTool;
    }, [currentTool])


    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            InitDraw(canvas, roomId, socket);
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
    currentTool: shape,
    setCurrentTool: (s: shape) => void
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