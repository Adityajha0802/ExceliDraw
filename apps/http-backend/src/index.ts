import express from "express";
import { client } from "@repo/db/client"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Middleware } from "#middleware.js";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import cors from "cors";
const app = express();
app.use(express.json())
app.use(cors());

app.get("/healthcheck", async (req, res) => {
    res.send("All Okay!");
})

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        await client.user.create({
            data: {
                username: parsedData.data.username,
                email: parsedData.data.email,
                password: parsedData.data.password
            }
        })
        res.json({
            message: "You have SignedUp"
        })
    } catch (e) {
        res.status(411).json({
            message: "User already exist with this username or email"
        })
    }
})

app.post("/signin", async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const user = await client.user.findUnique({
        where: {
            username: parsedData.data.username,
            password: parsedData.data.password
        }
    }
    );

    if (user) {
        const token = jwt.sign({
            id: user?.id
        }, JWT_SECRET)

        res.json({
            token: token
        })
    }
    else {
        res.status(403).json({
            message: "User doesn't exist"
        })
    }

})

app.post("/room", Middleware, async (req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(403).json({
            message: "Incorrect inputs"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId;
    try {


        const room = await client.room.create({
            data: {
                slug: parsedData.data.roomName,
                creatorId: userId
            }
        })

        res.json({
            message: "Room created",
            roomId: room.id
        })
    } catch (e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }

})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);

        const messages = await client.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "asc"
            },
            take: 100
        });

        res.json({
            messages
        })
    } catch (e) {

        console.log(e);
        res.json({
            message: "Something went wrong"
        })
    }
})

app.get("/room/:slug", Middleware, async (req, res) => {
    const slug = req.params.slug;
    //@ts-ignore
    const userId = req.userId;
    try {
        if (userId) {
            const room = await client.room.findFirst({
                where: {
                    slug: slug
                }
            });

            res.json({
                roomId: room?.id
            })
        }
    } catch (e) {
        res.status(411).json({
            message: "You are not logged in"
        })
    }
})
app.listen(3002);
