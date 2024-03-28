import nodemailer from 'nodemailer'
const sendEmail=async function (email,subject,message){
    let transporter=nodemailer.createTransport({
        host:"smtp.ethereal.email",
        port:587,
        secure:false,
        auth:{
            user:"maddison53@ethereal.email",
            pass:"jn7jnAPss4f63QBp6D",
        }
    })
    await transporter.sendMail({
        from:"bingivarun27@gmail.com",
        to:email,
        subject:subject,
        html:message,
    })
}
export default sendEmail;