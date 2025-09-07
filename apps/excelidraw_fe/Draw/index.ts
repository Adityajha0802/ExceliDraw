import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    x: number,
    y: number,
    radius: number
} | {
    type:"line",
    x:number,
    y:number,
    p:number,
    q:number
}
export async function InitDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {

    const context = canvas.getContext("2d");

    const existingShapes: Shape[] = await getExistingShapes(roomId);

    if (!context) {
        return;
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type == "chat") {
            const parsedShape = JSON.parse(data.message);
            existingShapes.push(parsedShape.shape);
            ClearCanvas(context, canvas, existingShapes);
        }

    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.onresize = (e: UIEvent) => {
        e.preventDefault();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ClearCanvas(context, canvas, existingShapes);
    }

    ClearCanvas(context, canvas, existingShapes);

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
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        
        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        }
    
        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }))
        

    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            let width = e.clientX - startX;
            let height = e.clientY - startY;
            ClearCanvas(context, canvas, existingShapes)
            context.strokeRect(startX, startY, width, height)
            context.strokeStyle = "rgba(255,255,255)"
        }

    })
}

function ClearCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type == "rect") {
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
            context.strokeStyle = "rgba(255,255,255)"
        }
    })



}

async function getExistingShapes(roomId: string) {

    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}