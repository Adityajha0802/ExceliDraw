import {z} from "zod";

export const CreateUserSchema=z.object({
    username:z.string().min(3).max(20),
    email:z.email(),
    firstName:z.string().min(3).max(25),
    lastName:z.string().min(1).max(10),
    password:z.string()
})



export const SigninSchema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})


export const CreateRoomSchema=z.object({
    name:z.string().min(3).max(100)
})
