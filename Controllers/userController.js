import User  from "../Model/userModel.js";
import AppError from '../utils/AppError.js';
import cloudinary from "cloudinary";
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'

const cookieOptions={
    secure:true,
    maxAge:24*60*1000,
    httpOnly:true

}

 export const register=async(req,res,next)=>{
    const {fullName,email,password,role}=req.body;

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
        role,
        avatar:{
            public_id:email,
            secure_url:"https://www.pngitem.com/pimgs/m/78-786293_1240-x-1240-0-avatar-profile-icon-png.png",
        },

    })
    if(!User){
        return next(new AppError("Registration failed try again",400));
    }
    
    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'face',
                crop:'fill',
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                //remove file from local server
                fs.rm(`uploads/${req.file.filename}`);
            }
        }
        catch(e){
            return next(new AppError(e.message||"file not uploaded,please try again"))
        }
    }
    
    await user.save();
    const token=await user.generateJWTToken();

res.cookie('token',token,cookieOptions);
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
export const forgotPassword=async(req,res,next)=>{
    const {email}=req.body;
    if(!email){
        return next(new AppError("Email is required",400))
    }
    const user=await User.findOne({email});
    if(!user){
        return next(
            new AppError("email is not registered"),400
        )
    }
    const resetToken=await user.generatePasswordToken();
    await user.save();
    const resetPasswordUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    const subject="Reset Password";
    const message=`you can reset password by clicking <a href=${resetPasswordUrl} target="_blanck">Reset your password </a>\n If the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n  If you have any issue try again`
    console.log(resetPasswordUrl);
    try{
       await sendEmail(email,subject,message);
       res.status(200).json({
        success:true,
        message:`Reset password token has been sent to ${email} successfully!`
       }) 
    }
    catch(e){
        user.forgotPasswordExpiry=undefined;
        user.forgotPasswordToken=undefined;
        await user.save();
        return next(new AppError(e.message,500))
    }
}
export const resetPassword=async(req,res,next)=>{
    const {resetToken}=req.params;
    const {password}=req.body;
    const forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    const user=await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt: Date.now()}
    })
    if(!user){
        return next(new AppError('Token is invalid or expired ,please try again'),400)
    }
    user.password=password;
    user.forgotPasswordExpiry=undefined;
    user.forgotPasswordToken=undefined;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Password changed successfully"
    })
}

export const changePassword=async(req,res,next)=>{
    const {oldPassword,newPassword}=req.body;
    const {id}=req.user;
    if(!oldPassword || !newPassword){
        return next(new AppError("All fileds required",400))
    }
    const user=await User.findById(id).select('+password');

    if(!user){
        return next(new AppError("user doesn't exist",400))
    }
    const isPasswordVaild=await user.comparePassword(oldPassword);
    if(!isPasswordVaild){
        return next(new AppError("Password doesn't match"),400);
    }
    user.password=newPassword;
    await user.save();
    user.password=undefined;
    res.status(200).json({
        success:true,
        message:"Password changed successfully"
    })
}

export const updateUser=async(req,res,next)=>{
    const {fullName}=req.body;
    const {id}=req.user;
    const user=await User.findById(id);
    if(!user){
        return next(new AppError("user does not exist"),400)
    }
    if(req.fullName){
        user.fullName=fullName;
    }
    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
    if(req.file){
        try{
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'face',
                crop:'fill',
            });
            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;
                //remove file from local server
                fs.rm(`uploads/${req.file.filename}`);
            }
        }
        catch(e){
            return next(new AppError(e.message||"file not uploaded,please try again"))
        }
    }
    await user.save();
    res.status(200).json({
        success:true,
        message:"User details updated successfully!"
    })

}

