import { Server,Socket } from "socket.io";

interface NotificationTypes{
    email:string;
    status:string;
    jobId:string
}

let io: Server | null = null;

async function initSocket(socket:Server){
    try {

        io = socket;
    
        io.on("connection",(socket:Socket)=>{
            const clientId = socket.id;
    
            console.log("Web socket connected with id :",clientId);
    
            socket.on("disconnect",(reason)=>{
                console.log("Web Socket disconnected",{clientId,reason})
            });
    
        })
        
    } catch (error:any) {
        console.log(error);
        throw new Error("Error while connecting socket : "+ error.message);
    }

};


async function emitNotification({email,status,jobId}:NotificationTypes){

    if(!io) return;
    
    const payload = {email,status,jobId,timestamp:new Date().toISOString()}

    io.emit("notification-status",payload)

    io.to(`email:${email}`).emit("notification-status",payload);

}


export {initSocket,emitNotification};