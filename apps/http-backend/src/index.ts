import express from "express";
import {client} from "@repo/db/client"
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import { Middleware } from "#middleware.js";
import {CreateUserSchema, Signup, } from "@repo/common/types"

const app=express();
 
app.use(express.json())

app.post("/signup",async(req,res)=>{
    //@ts-ignore
   const data:Signup=CreateUserSchema.safeParse(req.body)
   if(!data){
        res.status(403).json({
            message:"Incorrect inputs"        
        })
        return;
   }
    await client.user.create({
        data:{
            username:data.username,
            firstName:data.firstName,
            lastName:data.lastName,
            password:data.password
        }
    })

    res.json({
        message:"You have SignedUp"
    })
})

app.post("/signin",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const user= await client.user.findUnique(username);

    if(user){
        const token= jwt.sign({
            id:user.id
        },JWT_SECRET)

        res.json({
            message:"You are logged in",
            token:token
        })
    }
    else{
        res.status(403).json({
            message:"Error while signing in"
        })
    }
    
})

app.post("/room",Middleware,async(req,res)=>{
    
    const roomName = req.body.roomName;
    //@ts-ignore
    const id=req.userId;

    await client.room.create({
        data:{
            name:roomName,
            username:id.username
        }
    })

    res.json({
        message:"Room created"  
    })

})
app.listen(3001);