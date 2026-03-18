import { Router } from "express";
import { getQueueCounts,enQueueEmail } from "../queue/emailQueue";
import { emitNotification } from "../services/socket";

export const router = Router();


router.post('/email',async(req,res)=>{
    try {

        const {to,subject,message} = req.body;

        if(!to || !subject || !message){
            return res.status(400).json({success:false,message:"Missing fields to send an email"});
        };

       const job = await enQueueEmail({to,subject,message});

       emitNotification({email:to,status:"queued",jobId:job.id as string});

       console.log("Email queued and job id is", job.id);

       return res.status(202).json({success:true,message:"Email is queued for sending"})

        
    } catch (error:any) {
        return res.status(500).json({success:false,message:error.message})
    }
});


router.get('/queue-status',async(_,res)=>{
    try {

        const counts = await getQueueCounts();
        return res.status(200).json({success:true,counts})
        
    } catch (error:any) {
        return res.status(500).json({success:false,message:error.message})
    }
});