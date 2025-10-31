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

type point = { x: number, y: number };

function subtract(p1: point, p2: point): point {
    return { x: ((p2.x) - (p1.x)), y: ((p2.y) - (p1.y)) };
}

function add(p1: point, p2: point): point {
    return { x: ((p2.x) + (p1.x)), y: ((p2.y) + (p1.y)) };
}

function scaling(p1: point, n: number): point {
    return { x: (p1.x) * n, y: (p1.y) * n };
}
export async function InitDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const context = canvas.getContext("2d");

    let zoom: number = 1;

    const center: point = { x: canvas.width / 2, y: canvas.height / 2 }

    let offset: point = scaling(center,-1);

    let drag = {
        start: { x: 0, y: 0 } as point,
        end: { x: 0, y: 0 } as point,
        offset: { x: 0, y: 0 } as point,
        active: false
    }
    const existingShapes: Shape[] = await getExistingShapes(roomId);
    if (!context) {
        return;
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type == "chat") {
            const parsedShape = JSON.parse(data.message);
            existingShapes.push(parsedShape.shape);
            ClearCanvas(context, canvas, existingShapes, zoom, offset, getoffset, center);
        }

    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight

    window.onresize = (e: UIEvent) => {
        e.preventDefault();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ClearCanvas(context, canvas, existingShapes, zoom, offset, getoffset, center);
    }

    ClearCanvas(context, canvas, existingShapes, zoom, offset, getoffset, center);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    function getmouse(e: MouseEvent) {
        const x = (e.offsetX - center.x) *zoom - offset.x;
        const y = (e.offsetY- center.y) *zoom - offset.y;
        return { x, y };
    }

    function getoffset(): point {
        return add(offset, drag.offset)
    }

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const direction = Math.sign(e.deltaY);
        const step = 0.1;
        const oldZoom = zoom;
        zoom += direction * step;
        zoom = Math.max(1, Math.min(5, zoom));
        // Calculate mouse position relative to canvas
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Calculate the world position under the mouse before zoom
        const currentOffset = getoffset();
        const worldX = (mouseX - center.x) * oldZoom - currentOffset.x;
        const worldY = (mouseY - center.y) * oldZoom - currentOffset.y;

        // Calculate the world position under the mouse after zoom
        const newWorldX = (mouseX - center.x) * zoom - currentOffset.x;
        const newWorldY = (mouseY - center.y) * zoom - currentOffset.y;

        // Adjust offset to keep the same world point under the mouse
        offset.x += newWorldX - worldX;
        offset.y += newWorldY - worldY;
        ClearCanvas(context, canvas, existingShapes, zoom, offset, getoffset, center);
        console.log(zoom);
    })

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = getmouse(e).x;
        startY = getmouse(e).y;
        //@ts-ignore
        const currentTool = window.currentTool;
        if (currentTool == "panning") {
                drag.start = getmouse(e);
                drag.active = true;
            
        }
    })
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = getmouse(e).x - startX;
        const height = getmouse(e).y - startY;

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
                endX: getmouse(e).x,
                endY: getmouse(e).y
            }
        } else if (currentTool == "arrow") {
            shape = {
                type: "arrow",
                fromX: startX,
                fromY: startY,
                toX: getmouse(e).x,
                toY: getmouse(e).y
            }
        }
        else if (currentTool == "panning") {
            if (drag.active) {
                offset = add(offset, drag.offset);
                drag = {
                    start: { x: 0, y: 0 } as point,
                    end: { x: 0, y: 0 } as point,
                    offset: { x: 0, y: 0 } as point,
                    active: false
                }
            }
        }
        if (!shape) {
            return
        }
        try {
            existingShapes.push(shape);
            ClearCanvas(context, canvas, existingShapes, zoom, offset, getoffset, center);
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
        //@ts-ignore
        const currentTool = window.currentTool;
        if (clicked) {
            let width = getmouse(e).x - startX;
            let height = getmouse(e).y - startY;

            ClearCanvas(context, canvas, existingShapes, zoom, offset, getoffset, center)
            context.strokeStyle = "rgba(255,255,255)";

            context.save();
            context.translate(center.x, center.y);
            context.scale(1 / zoom, 1 / zoom);
            const offsett = getoffset();
            context.translate(offsett.x, offsett.y)

            if (currentTool == "panning") {
                if (drag.active) {
                    drag.end = getmouse(e);
                    drag.offset = subtract(drag.end, drag.start);
                }
            }

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
                const endX = getmouse(e).x;
                const endY = getmouse(e).y;
                context.beginPath();
                context.moveTo(X, Y);
                context.lineTo(endX, endY);
                context.stroke();
            }
            else if (currentTool == "arrow") {

                const fromX = startX;
                const fromY = startY;
                const toX = getmouse(e).x;
                const toY = getmouse(e).y;
                var headlen = 20;
                var dx = toX - fromX;
                var dy = toY - fromY;
                var angle = Math.atan2(dy, dx);
                context.beginPath()
                context.moveTo(fromX, fromY);
                context.lineTo(toX, toY);
                context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
                context.moveTo(toX, toY);
                context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
                context.stroke();
            }

            context.restore();
        }

    }

    )
}



function ClearCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[], zoom: number, offset: point, getoffset: () => point, center: point) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(center.x, center.y);
    context.scale(1 / zoom, 1 / zoom);
    const offsett = getoffset();
    context.translate(offsett.x, offsett.y)

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
            context.lineTo(shape.toX - headlen * Math.cos(angle - Math.PI / 6), shape.toY - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(shape.toX, shape.toY);
            context.lineTo(shape.toX - headlen * Math.cos(angle + Math.PI / 6), shape.toY - headlen * Math.sin(angle + Math.PI / 6));
            context.stroke();


        }

    })

    context.restore();

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

