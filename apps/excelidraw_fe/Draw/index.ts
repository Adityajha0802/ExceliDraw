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
    centerX: number,
    centerY: number,
    radius: number
} | {
    type: "line",
    X: number,
    Y: number,
    endX: number,
    endY: number
} | {
    type: "arrow",
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
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
    canvas.height = window.innerHeight

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
        startX = e.offsetX;
        startY = e.offsetY;
    })
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        let shape: Shape | null = null;
        //@ts-ignore
        const currentTool = window.currentTool;
        if (currentTool == "rectangle") {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            }

        } else if (currentTool == "circle") {
            const radius = Math.abs(Math.max(width, height) / 2);
            shape = {
                type: "circle",
                centerX: startX + width / 2,
                centerY: startY + height / 2,
                radius: radius
            }
        } else if (currentTool == "line") {
            shape = {
                type: "line",
                X: startX,
                Y: startY,
                endX: e.offsetX,
                endY: e.offsetY
            }
        } else if (currentTool == "arrow") {
            shape = {
                type: "arrow",
                fromX: startX,
                fromY: startY,
                toX: e.offsetX,
                toY: e.offsetY
            }
        }
        if (!shape) {
            return
        }
        try {
            existingShapes.push(shape);
        } catch (e) {
            console.log(e);
        }

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }))
    })
    canvas.addEventListener('mousemove', e => {
        if (clicked) {
            let width = e.offsetX - startX;
            let height = e.offsetY - startY;
            ClearCanvas(context, canvas, existingShapes)
            context.strokeStyle = "rgba(255,255,255)";
            //@ts-ignore
            const currentTool = window.currentTool;
            if (currentTool == "rectangle") {
                context.strokeRect(startX, startY, width, height);

            } else if (currentTool == "circle") {
                const rad = Math.abs(Math.max(width, height) / 2);
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const radius = rad;
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, Math.PI * 2);
                context.stroke();
                context.closePath();

            }
            else if (currentTool == "line") {
                const X = startX;
                const Y = startY;
                const endX = e.offsetX;
                const endY = e.offsetY;
                context.beginPath();
                context.moveTo(X, Y);
                context.lineTo(endX, endY);
                context.stroke();
            }
            else if (currentTool == "arrow") {
                
                const fromX = startX;
                const fromY = startY;
                const toX = e.offsetX;
                const toY = e.offsetY;
                var headlen = 20;
                var dx = toX - fromX;
                var dy = toY - fromY;
                var angle = Math.atan2(dy, dx);
                context.beginPath()
                context.moveTo(fromX, fromY);
                context.lineTo(toX, toY);
                context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 8), toY - headlen * Math.sin(angle - Math.PI / 8));
                context.moveTo(toX, toY);
                context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 8), toY - headlen * Math.sin(angle + Math.PI / 8));
                context.stroke();
            }
        }
        
    }

    )
}



function ClearCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes?.map((shape) => {
        if (shape?.type == "rect") {
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);

        } else if (shape?.type == "circle") {
            context.beginPath();
            context.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            context.stroke();
            context.closePath();

        } else if (shape?.type == "line") {
            context.beginPath();
            context.moveTo(shape.X, shape.Y);
            context.lineTo(shape.endX, shape.endY);
            context.stroke();

        } else if (shape?.type == "arrow") {
            var headlen = 20; // length of head in pixels
                var dx = shape.toX - shape.fromX;
                var dy = shape.toY - shape.fromY;
                var angle = Math.atan2(dy, dx);
                context.beginPath()
                context.moveTo(shape.fromX, shape.fromY);
                context.lineTo(shape.toX, shape.toY);
                context.lineTo(shape.toX - headlen * Math.cos(angle - Math.PI / 8), shape.toY - headlen * Math.sin(angle - Math.PI / 8));
                context.moveTo(shape.toX, shape.toY);
                context.lineTo(shape.toX - headlen * Math.cos(angle + Math.PI / 8), shape.toY - headlen * Math.sin(angle + Math.PI / 8));
                context.stroke();

        }

    })

}

async function getExistingShapes(roomId: string) {

    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages?.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}

