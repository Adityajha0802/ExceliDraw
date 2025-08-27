import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer, WebSocket } from 'ws';
import jwt from "jsonwebtoken";
import {client} from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: number;
}

const users: User[] = [];


function UserCheck(token: string | null): number | null {

  try {
    const decodedUser = jwt.verify(token as string, JWT_SECRET);

    if (typeof decodedUser == "string") {
      return null;
    }
    if (!decodedUser || !decodedUser.id) {
      return null;
    }

    return decodedUser.id;
  } catch (e) {
    return null;
  }

}

wss.on('connection', function connection(ws, req) {

  const url = req.url;

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get("token");
  const userId = UserCheck(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    ws: ws,
    rooms: [],
    userId: userId,
  })


  ws.on('message',async function message(data) {

    try {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === "join_room") {
        const user = users.find(x => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
      }

      if (parsedData.type === "leave_room") {
        const user = users.find(x => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms = user.rooms.filter(x => x === parsedData.room)
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await client.chat.create({
          data:{
            message:message,
            roomId:roomId,
            userId:userId
          }
        })

        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId: roomId
            }))
          }
        })
      }
    } catch (e) {
      return;
    }
  });

});

