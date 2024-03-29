import AppError from '../utils/AppError.js';
import JWT from 'jsonwebtoken';

export const isLoggedIn = function(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return next(new AppError("Unauthenticated, please login", 401));
    }
    try {
        const tokenDetails = JWT.verify(token, process.env.JWT_SECRET); 
        req.user = tokenDetails;
        
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