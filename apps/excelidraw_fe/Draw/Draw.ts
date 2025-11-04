import { Tool } from "@/components/Canvas"
import { getExistingShapes } from "./ExistingShape"

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

type DragState = {
    start: point;
    end: point;
    offset: point;
    active: boolean;
}

function subtract(p1: point, p2: point): point {
    return { x: ((p2.x) - (p1.x)), y: ((p2.y) - (p1.y)) };
}

function add(p1: point, p2: point): point {
    return { x: ((p2.x) + (p1.x)), y: ((p2.y) + (p1.y)) };
}

function scaling(p1: point, n: number): point {
    return { x: (p1.x) * n, y: (p1.y) * n };
}

export class Draw {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private socket: WebSocket;
    private zoom: number;
    private center: point;
    private offset: point;
    private drag: DragState;
    private clicked: boolean;
    private startX: number;
    private startY: number;
    private currentTool: Tool = "circle";

    private getmouse(e: MouseEvent): point {
        const x = (e.offsetX - this.center.x) * this.zoom - this.offset.x;
        const y = (e.offsetY - this.center.y) * this.zoom - this.offset.y;
        return { x, y };
    }

    private getoffset(): point {
        return add(this.offset, this.drag.offset)
    }


    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.zoom = 1;
        this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.offset = scaling(this.center, -1);
        this.drag = {
            start: { x: 0, y: 0 } as point,
            end: { x: 0, y: 0 } as point,
            offset: { x: 0, y: 0 } as point,
            active: false
        }
        this.clicked = false;
        this.startX = 0;
        this.startY = 0;
        this.initDraw();
        this.socketHandlers();
        this.canvasHandler();
        this.initMouseHandlers();
    }


    setTool(tool: Tool) {
        this.currentTool = tool;
    }
    async initDraw() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.ClearCanvas();
    }

    socketHandlers() {
        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type == "chat") {
                const parsedShape = JSON.parse(data.message);
                this.existingShapes.push(parsedShape.shape);
                this.ClearCanvas();
            }

        }
    }

    ClearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "rgba(0,0,0)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(this.center.x, this.center.y);
        this.context.scale(1 / this.zoom, 1 / this.zoom);
        const offsett = this.getoffset();
        this.context.translate(offsett.x, offsett.y)

        this.existingShapes?.map((shape) => {
            if (shape?.type == "rect") {
                this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);

            } else if (shape?.type == "circle") {
                this.context.beginPath();
                this.context.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                this.context.stroke();
                this.context.closePath();

            } else if (shape?.type == "line") {
                this.context.beginPath();
                this.context.moveTo(shape.X, shape.Y);
                this.context.lineTo(shape.endX, shape.endY);
                this.context.stroke();

            } else if (shape?.type == "arrow") {
                var headlen = 20; // length of head in pixels
                var dx = shape.toX - shape.fromX;
                var dy = shape.toY - shape.fromY;
                var angle = Math.atan2(dy, dx);
                this.context.beginPath()
                this.context.moveTo(shape.fromX, shape.fromY);
                this.context.lineTo(shape.toX, shape.toY);
                this.context.lineTo(shape.toX - headlen * Math.cos(angle - Math.PI / 6), shape.toY - headlen * Math.sin(angle - Math.PI / 6));
                this.context.moveTo(shape.toX, shape.toY);
                this.context.lineTo(shape.toX - headlen * Math.cos(angle + Math.PI / 6), shape.toY - headlen * Math.sin(angle + Math.PI / 6));
                this.context.stroke();


            }

        })

        this.context.restore();

    }

    canvasHandler() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight
        window.onresize = (e: UIEvent) => {
            e.preventDefault();
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.ClearCanvas();
        }
    }

    MouseWheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        const direction = Math.sign(e.deltaY);
        const step = 0.1;
        const oldZoom = this.zoom;
        this.zoom += direction * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
        // Calculate mouse position relative to canvas
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Calculate the world position under the mouse before zoom
        const currentOffset = this.getoffset();
        const worldX = (mouseX - this.center.x) * oldZoom - currentOffset.x;
        const worldY = (mouseY - this.center.y) * oldZoom - currentOffset.y;

        // Calculate the world position under the mouse after zoom
        const newWorldX = (mouseX - this.center.x) * this.zoom - currentOffset.x;
        const newWorldY = (mouseY - this.center.y) * this.zoom - currentOffset.y;

        // Adjust offset to keep the same world point under the mouse
        this.offset.x += newWorldX - worldX;
        this.offset.y += newWorldY - worldY;
        this.ClearCanvas();
    }

    MouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = this.getmouse(e).x;
        this.startY = this.getmouse(e).y;
        const currentTool = this.currentTool;
        if (currentTool == "panning") {
            this.drag.start = this.getmouse(e);
            this.drag.active = true;

        }
    }

    MouseUphandler = (e: MouseEvent) => {
        this.clicked = false;
        const width = this.getmouse(e).x - this.startX;
        const height = this.getmouse(e).y - this.startY;

        let shape: Shape | null = null;
        const currentTool = this.currentTool;
        if (currentTool == "rectangle") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            }

        } else if (currentTool == "circle") {
            const radius = Math.abs(Math.max(width, height) / 2);
            shape = {
                type: "circle",
                centerX: this.startX + width / 2,
                centerY: this.startY + height / 2,
                radius: radius
            }
        } else if (currentTool == "line") {
            shape = {
                type: "line",
                X: this.startX,
                Y: this.startY,
                endX: this.getmouse(e).x,
                endY: this.getmouse(e).y
            }
        } else if (currentTool == "arrow") {
            shape = {
                type: "arrow",
                fromX: this.startX,
                fromY: this.startY,
                toX: this.getmouse(e).x,
                toY: this.getmouse(e).y
            }
        }
        else if (currentTool == "panning") {
            if (this.drag.active) {
                this.offset = add(this.offset, this.drag.offset);
                this.drag = {
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
            this.existingShapes.push(shape);
            this.ClearCanvas();
        } catch (e) {
            console.log(e);
        }

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }

    MouseMoveHandler = (e: MouseEvent) => {
        const currentTool = this.currentTool;
        if (this.clicked) {
            let width = this.getmouse(e).x - this.startX;
            let height = this.getmouse(e).y - this.startY;

            this.ClearCanvas();
            this.context.strokeStyle = "rgba(255,255,255)";

            this.context.save();
            this.context.translate(this.center.x, this.center.y);
            this.context.scale(1 / this.zoom, 1 / this.zoom);
            const offsett = this.getoffset();
            this.context.translate(offsett.x, offsett.y)

            if (currentTool == "panning") {
                if (this.drag.active) {
                    this.drag.end = this.getmouse(e);
                    this.drag.offset = subtract(this.drag.end, this.drag.start);
                }
            }

            if (currentTool == "rectangle") {
                this.context.strokeRect(this.startX, this.startY, width, height);

            } else if (currentTool == "circle") {
                const rad = Math.abs(Math.max(width, height) / 2);
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                const radius = rad;
                this.context.beginPath();
                this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.context.stroke();
                this.context.closePath();

            }
            else if (currentTool == "line") {
                const X = this.startX;
                const Y = this.startY;
                const endX = this.getmouse(e).x;
                const endY = this.getmouse(e).y;
                this.context.beginPath();
                this.context.moveTo(X, Y);
                this.context.lineTo(endX, endY);
                this.context.stroke();
            }
            else if (currentTool == "arrow") {

                const fromX = this.startX;
                const fromY = this.startY;
                const toX = this.getmouse(e).x;
                const toY = this.getmouse(e).y;
                var headlen = 20;
                var dx = toX - fromX;
                var dy = toY - fromY;
                var angle = Math.atan2(dy, dx);
                this.context.beginPath()
                this.context.moveTo(fromX, fromY);
                this.context.lineTo(toX, toY);
                this.context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
                this.context.moveTo(toX, toY);
                this.context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
                this.context.stroke();
            }

            this.context.restore();
        }
    }

    initMouseHandlers() {

        this.canvas.addEventListener("wheel", this.MouseWheelHandler);
        this.canvas.addEventListener("mousedown", this.MouseDownHandler);
        this.canvas.addEventListener("mouseup", this.MouseUphandler);
        this.canvas.addEventListener('mousemove', this.MouseMoveHandler);

    }

    destroy() {

        this.canvas.removeEventListener("wheel", this.MouseWheelHandler);
        this.canvas.removeEventListener("mousedown", this.MouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.MouseUphandler);
        this.canvas.removeEventListener('mousemove', this.MouseMoveHandler);
    }
}