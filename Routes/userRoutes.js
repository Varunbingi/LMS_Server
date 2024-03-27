import  express from 'express';
import  { register,login,logout,getUser } from '../Controllers/userController.js';
import { isLoggedIn } from '../Middleware/authMiddleware.js';
const userRouter=express.Router();



userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/me',isLoggedIn,getUser);

export default userRouter;