"use client";
import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (!context) {
                return;
            }

            let clicked = false;
            let startX = 0;
            let startY = 0;

            canvas.addEventListener("mousedown", (e) => {
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
            })
            canvas.addEventListener("mouseup", (e) => {
                clicked = false;
                console.log(e.clientX);
                console.log(e.clientY);
            })
            canvas.addEventListener("mousemove", (e) => {
                if (clicked) {
                    let width = e.clientX - startX;
                    let height = e.clientY - startY;

                    context.clearRect(0,0,canvas.width,canvas.height)
                    context.strokeRect(startX,startY,width,height)

                }

            })

        }
    }, [canvasRef])
    return <div>
        <canvas ref={canvasRef} height={900} width={900}
        ></canvas>
    </div>
}