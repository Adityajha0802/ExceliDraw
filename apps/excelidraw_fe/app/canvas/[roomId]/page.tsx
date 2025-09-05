"use client";
import { InitDraw } from "@/Draw";
import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            InitDraw(canvas);

        }
    }, [canvasRef])
    return <div>
        <canvas ref={canvasRef} height={800} width={1600}
        ></canvas>
    </div>
}