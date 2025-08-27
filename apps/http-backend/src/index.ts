import express from "express";
import { client } from "@repo/db/client"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Middleware } from "#middleware.js";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"

const app = express();
app.use(express.json())

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
                username: parsedData.data?.username,
                email: parsedData.data?.email,
                firstName: parsedData.data.firstName,
                lastName: parsedData.data.lastName,
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
                slug: parsedData.data.name,
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
    const roomId = Number(req.params.roomId);

    const messages = await client.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})
app.listen(3001);