import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './Routes/userRoutes.js'
import errorMiddleware from './Middleware/errorMiddleware.js';
import morgan from 'morgan';

import courseRouter from './Routes/courseRoutes.js';
const app=express();
app.use(express.json());
app.use(morgan('dev'))

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(cookieParser());
app.use("/api/v1/user",userRouter)
app.use("/api/v1/courses",courseRouter);
app.use('/ping',(req,res)=>{
    res.send("pong")
})
app.all("*",(req,res)=>{
    res.status(404).send("Opps!! page not found")
})
app.use(errorMiddleware)

export default app;