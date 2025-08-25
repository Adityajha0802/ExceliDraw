import { JWT_SECRET } from "@repo/backend-common/config";
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";


export const Middleware=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers["authorization"];

    try{ 
        const decodeduser=jwt.verify(token as string,JWT_SECRET);
        //@ts-ignore
        req.userId=decodeduser.id;
        next();
    }
    catch(e){
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}