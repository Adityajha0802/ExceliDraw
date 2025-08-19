import {z} from "zod";

export const CreateUserSchema=z.object({
    username:z.string().min(3).max(20),
    firstName:z.string().min(3).max(25),
    lastName:z.string().min(3).max(10),
    password:z.string()
})

export type Signup=z.infer<typeof CreateUserSchema>;

export const SigninSchema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})
export type Signin=z.infer<typeof SigninSchema>;

export const CreateRoomSchema=z.object({
    name:z.string().min(3).max(20)  
})
export type Room=z.infer<typeof CreateRoomSchema>;