import {z} from "zod";

export const CreateUserSchema=z.object({
    username:z.string().min(5).max(20),
    email:z.email("Invalid email address"),
    password:z.string().min(5).max(25)
})


export const SigninSchema=z.object({
    username:z.string().min(5).max(20),
    password:z.string().min(5).max(25)
})


export const CreateRoomSchema=z.object({
    roomName:z.string().min(3).max(100)
})
