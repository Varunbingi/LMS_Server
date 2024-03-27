
import { config } from 'dotenv';
import  app from'./app.js';
import ConnectToDB from './Config/DbConnection.js';

config();

const PORT= process.env.PORT||5011;


app.listen(PORT,async()=>{
     await ConnectToDB()
    console.log(`server running at port ${PORT}`);
})