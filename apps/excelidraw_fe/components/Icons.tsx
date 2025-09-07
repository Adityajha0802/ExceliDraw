import { ReactNode } from "react";


export  function Icon({
    icon,
    activated,
    onClick
}:{
    icon:ReactNode,
    activated:Boolean,
    onClick:()=>void
}){
    return <div onClick={onClick} className={`rounded-full  m-2 p-1 cursor-pointer bg-black hover:bg-gray ${activated?"text-blue-700":"text-white"}`}>
        {icon}
    </div>
}