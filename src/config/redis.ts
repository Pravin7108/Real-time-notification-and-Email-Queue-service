import {Redis} from "ioredis";


const redisConfig={
    host:process.env.REDIS_HOST || "127.0.0.1",
    port:parseInt(process.env.REDIS_PORT || "6379", 10),
    maxRetriesPerRequest:null,
    enableReadyCheck:true,
    lazyConnect:false
};


let redis = null;

async function redisConnection(){
    try {

        redis = new Redis(redisConfig);

        redis.on("connect",()=>console.log("Redis is connected"));
        redis.on("ready",()=>console.log("Redis is ready"));
        redis.on("error",()=>console.log("Error from redis"))

        return redis;
        
    } catch (error: any) {
        console.log("Error while connecting Redis :",error.message)
    }
};

export {redisConfig,redisConnection}