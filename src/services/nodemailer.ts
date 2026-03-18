import nodemailer from "nodemailer";


export interface DataTypes{
    to:string,
    subject:string,
    message:string
}


async function SendEmail({to,subject,message}:DataTypes){
    try {

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.NODEMAILER_USER,
                pass:process.env.NODEMAILER_PASS
            }
        });

       const info = await transporter.sendMail({
            to,subject,text:message
        });

        return info;
        
    } catch (error) {
        console.log(error)
    }
};

export {SendEmail};