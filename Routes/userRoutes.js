import  express from 'express';
import  { register,login,logout,getUser, forgotPassword, resetPassword, changePassword, updateUser } from '../Controllers/userController.js';
import { isLoggedIn } from '../Middleware/authMiddleware.js';
import upload from '../Middleware/multerMiddleware.js';
const userRouter=express.Router();



userRouter.post('/register',upload.single('avatar'),register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/me',isLoggedIn,getUser);
userRouter.post('/reset',forgotPassword);
userRouter.post("/reset/:resetToken",resetPassword)
userRouter.post("/change-password",isLoggedIn,changePassword);
userRouter.put("/update",isLoggedIn,upload.single('avatar'),updateUser)


export default userRouter;