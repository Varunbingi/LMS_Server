import User from "../Model/userModel.js";
import { razorpay } from "../server.js";
import AppError from "../utils/AppError.js"
import crypto from 'crypto'
import Payment from "../Model/paymentModel.js";

export const getRazorpayKey=async(req,res,next)=>{
    try{
        res.status(200).json({
            success:true,
            message:"RazorPay Api key ",
            key:process.env.RAZORPAY_KEY_ID,
        })
    }
    catch(e){
        return next(new AppError(e.message,500));
    }
} 
export const buySubscription=async (req,res,next)=>{
    
        const {id}=req.user;
        const user=await User.findById(id);
        if(!user){
            return next(new AppError("Unauthorized, please login",400))
        }
        if(user.role==="ADMIN"){
            return next(new AppError("Admin cannot purches a subscription",400))
        }
        const subscription= await razorpay.subscriptions.create({
            plan_id:process.env.RAZORPAY_PLAN_ID,
            customer_notify:1,
            total_count:12,
        })
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Subscription done",
            subscription_id:subscription.id,
            
            
        })

}
export const verifySubscription = async (req, res, next) => {
    try {
        // Extract user ID from the request
        const { id } = req.user;

        // Find the user in the database
        const user = await User.findById(id);
    

        // Check if the user exists
        if (!user) {
            return next(new AppError("Unauthorized, please login", 401));
        }

        // Extract payment details from the request body
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;
        console.log("Request Data:", req.body);

        // Generate the expected signature for verification
    
       
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY).update(`${razorpay_payment_id}|${razorpay_subscription_id}`).digest('hex');
        

        // Compare the generated signature with the received signature
        if (generatedSignature !== razorpay_signature) {
            return next(new AppError('Payment not verified, please try again', 400));
        }

        // Record payment details in the Payment collection
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        });

        // Update user record with subscription status
        user.subscription.status = 'active';
        await user.save();

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully!"
        });

    } catch (error) {
        // If any error occurs during the process, handle it
        console.error("Error:", error);
        return next(new AppError(error.message, 500));
    }
};

export const cancelSubscription=async(req,res,next)=>{
    try{
        const {id}=req.user;
        const user=await User.findById(id);
        if(!user){
            return next(new AppError("Unauthorized, please login",400))
        }
        if(user.role==="ADMIN"){
            return next(new AppError("Admin cannot cancel the subscription",400))
        }
        const subscriptionId=user.subscription.id;
        const subscription=await razorpay.subscriptions.cancel(subscriptionId);
        user.subscription.status=subscription.status;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Subscription canceled"
        })
        
    }
    catch(e){
        return next(new AppError(e.message,500))
    }

}
export const getAllPayments=async(req,res,next)=>{
    try{
        const {count}=req.query;
        const subscriptions=await razorpay.subscriptions.all({
            count:count||10,
        })
        res.status(200).json({
            success:true,
            message:"all payments",
            payments:subscriptions
        })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }
}