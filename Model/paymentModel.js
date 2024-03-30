import { Schema, model } from "mongoose";
const paymentSChema=new Schema({
    payment_id:{
        type:String,
        require:true,
    },
    subscription_id:{
        type:String,
        required:true
    },
    signture:{
        type:String,
        required:true
    }
})
const Payment=model('Payment',paymentSChema);
export default Payment;