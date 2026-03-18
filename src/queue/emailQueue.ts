
import { Queue } from "bullmq";
import { redisConfig } from "../config/redis";
import { DataTypes } from "../services/nodemailer";

 async function emailQueue(){

    let Queue_Name = process.env.QUEUE_NAME as string;

    const queue = new Queue(Queue_Name,{
        connection:redisConfig,
        defaultJobOptions:{
            attempts:3,
            backoff:{
                type:"exponential",
                delay:5000
            },
            removeOnComplete:{
                age:24 * 3600
            },
            removeOnFail:{
                age:3 * 24 * 3600
            }
        }
    });

    queue.on("error",(err)=>{
        console.log("Error on mail queueing",err.message)
    })

    return queue;
}


async function enQueueEmail(data:DataTypes){

    const queue = await emailQueue();
    const job = queue.add("send_email",data,{});
    return job;

}


async function getQueueCounts(){
    const queue = await emailQueue();
    const [waiting,active,completed,failed] = await Promise.all([
         queue.getWaitingCount(),
         queue.getActiveCount(),
         queue.getCompletedCount(),
         queue.getFailedCount()
    ]);

    return {waiting,active,completed,failed}
}


export {emailQueue,enQueueEmail,getQueueCounts};