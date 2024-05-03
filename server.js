
import { config } from 'dotenv';
import  app from'./app.js';
import ConnectToDB from './Config/DbConnection.js';
import cloudinary from 'cloudinary';
import Razorpay from "razorpay";
config();

const PORT= process.env.PORT||5011;
cloudinary.v2.config(
    {
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    }
)
 export const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET_KEY
})

app.listen(PORT,async()=>{
     await ConnectToDB()
    console.log(`server running at port ${PORT}`);
})
app.get('/',(req,res)=>{
    return res.json({
        suceess:true,
        message:"server is running"
    })
})