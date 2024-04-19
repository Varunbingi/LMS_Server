import { Schema, model } from "mongoose";
const paymentSChema=new Schema({
    razorpay_payment_id:{
        type:String,
        require:true,
    },
    razorpay_subscription_id:{
        type:String,
        required:true
    },
    razorpay_signature:{
        type:String,
        required:true
    }
})
const Payment=model('Payment',paymentSChema);
export default Payment;