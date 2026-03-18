import { Worker,Job } from "bullmq";
import { SendEmail } from "../services/nodemailer";
import {redisConfig} from "../config/redis"
import { emitNotification } from "../services/socket";


async function processEmailToSend(job:Job){

    const {to,subject,message} = job.data;

    emitNotification({
        email:to,
        status:"processing",
        jobId:job.id as string
    });

    await SendEmail({to,subject,message});

    emitNotification({
        email:to,
        status:"sent",
        jobId:job.id as string
    })

}


export async function initWorker(){

    let Queue_Name = process.env.QUEUE_NAME as string;

    const worker = new Worker(Queue_Name,processEmailToSend,{
        connection:redisConfig,
        concurrency:5,
        limiter:{
            duration:1000,
            max:10
        }
    });

    worker.on("active",(job)=>{
        console.log("Job active "+job.id)
    })

    worker.on("completed",(job)=>{
        console.log("Job completed "+job.id)
    })
    worker.on("failed",(job:any)=>{
        let lastAttempt = job?.attemptsMade >= job?.opts?.attempts || 1;

        if(lastAttempt){

            emitNotification({
                email:job.data.to,
                status:"failed",
                jobId:job.id
            });
        }else{

            emitNotification({
                email:job.data.to,
                status:"retrying",
                jobId:job.id
            });

        }
    });

    worker.on("error",(job:any)=>{
        console.log("Worker error",job.id)
    })

}