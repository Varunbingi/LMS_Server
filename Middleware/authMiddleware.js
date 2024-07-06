import AppError from '../utils/AppError.js';
import JWT from 'jsonwebtoken';

export const isLoggedIn = function(req, res, next) {
    
    const token = (req.cookies && req.cookies.token) || null;
    
    
    try {
        const tokenDetails = JWT.verify(token, process.env.JWT_SECRET); 
        req.user = tokenDetails;
        console.log(tokenDetails)
        
        next();
    } catch (error) {
        return next(new AppError("Unauthenticated, please login", 401));
    }
};

export const authorizedRoles = (...roles) => (req, res, next) => {
    const currentRole = req.user.role;
    
    if (!roles.includes(currentRole)) {
        return next(new AppError("you don't have permission to access this route", 403))
    }
    next();
}
export const authorizedSubscriber=async(req,res,next)=>{
    const subscriptionStatus=req.user.subscription.status;
    const currentRole=req.user.role;
    if(currentRole!=="ADMIN" && subscriptionStatus!=="active"){
        return next(new AppError("Plaease subscribe to course",403))
    }
    next();

}