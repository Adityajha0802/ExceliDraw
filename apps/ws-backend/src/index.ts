import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,req) {

  const url=req.url;

  if(!url){
    return;
  }

  const queryParams=new URLSearchParams(url.split('?')[1]);
  const token=queryParams.get("token")
  const decodedUser=jwt.verify(token as string,JWT_SECRET);

  if(typeof decodedUser == "string"){
    ws.close();
    return;
  }
  if(!decodedUser ||!decodedUser.id){
    ws.close();
    return;
  }
  
  ws.on('message', function message(data) {
    ws.send('pong');
  });
 
});

