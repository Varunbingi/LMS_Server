import User  from "../Model/userModel.js";
import AppError from '../utils/AppError.js';


const cookieOptions={
    secure:true,
    maxAge:24*60*1000,
    httpOnly:true

}

 export const register=async(req,res,next)=>{
    const {fullName,email,password}=req.body;

    if(!fullName || !email || !password){
        return next(new AppError('All fileds are required',400))
    }
    const userExist=await User.findOne({email});
    if(userExist){
        return next(new AppError('Email already registered'),400);
    }
    const user=await User.create({
        fullName,
        email,
        password,
        avater:{
            public_id:email,
            secure_url:"https://www.pngitem.com/pimgs/m/78-786293_1240-x-1240-0-avatar-profile-icon-png.png",
        },

    })
    if(!User){
        return next(new AppError("Registration failed try again",400));
    }
    await user.save();
    user.password=undefined;
    res.status(200).json({
        success:true,
        message:"user registration successfull",
        user,
    })


}

 export const login=async(req,res)=>{
const {email,password}=req.body;
if(!email||!password){
    return next(new AppError("all fileds are required",400));
}
const user=await User.findOne({email}).select(+password);
if(!user|| !user.comparePassword(password)){
    return next(new AppError("Email or password doesn't match",400));
}
const token=await user.generateJWTToken();
user.password=undefined;
res.cookie('token',token,cookieOptions);
res.status(201).json({
    success:true,
    message:"User registered successfully"
})

}
export const logout=(req,res)=>{
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"user logged out successfully"
    })

}
export const getUser=async(req,res)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        message:"user details",
        user
    })
}

