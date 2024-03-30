import { Router } from "express";
import { buySubscription, cancelSubscription, getAllPayments, getRazorpayKey, verifySubscription } from "../Controllers/paymentController.js";
import { authorizedRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
const paymentRouter=Router();

paymentRouter.route('/razorpay-key').get(isLoggedIn,getRazorpayKey);
paymentRouter.route('/subscribe').post(isLoggedIn,buySubscription);
paymentRouter.route('/verify').post(isLoggedIn,verifySubscription);
paymentRouter.route('/unscbscribe').post(isLoggedIn,cancelSubscription);
paymentRouter.route('/').get(isLoggedIn,authorizedRoles('ADMIN'),getAllPayments)

export default paymentRouter;