const http = require("http");
const express = require("express");
import dot from "dotenv";
dot.config();
import cors from "cors";
import {redisConnection} from "./config/redis";
import {Server as SocketIOServer} from "socket.io";
import { initSocket } from "./services/socket";
import { initWorker } from "./workers/emailWorkers";
import { router } from "./routes/notificationRouter";

const app = express();
app.use(express.json());
app.use(cors());


app.use('/notifications',router);

const server = http.createServer(app);


const io = new SocketIOServer(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
    transports:["websocket","polling"]
});


let PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    await redisConnection();
    await initSocket(io);
    await initWorker();
    console.log(`Server is running at ${PORT}`);
});
