import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../Components/ChatRoom";

async function GetRoomId(slug:string){
    const response=await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id;
}


export default async function Room({
    params
}:{
    params:{
        slug:string
    }
}){
    const slug=(await params).slug;
    const roomId=await GetRoomId(slug);

    return <ChatRoom id={roomId}></ChatRoom>;
}