
import { config } from 'dotenv';
import  app from'./app.js';
import ConnectToDB from './Config/DbConnection.js';
import cloudinary from 'cloudinary'
config();

const PORT= process.env.PORT||5011;
cloudinary.v2.config(
    {
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    }
)

app.listen(PORT,async()=>{
     await ConnectToDB()
    console.log(`server running at port ${PORT}`);
})