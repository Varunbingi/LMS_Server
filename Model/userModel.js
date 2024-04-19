import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import crypto from "crypto"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Fullname required"],
        minLength: [5, "Name must have a minimum of 5 characters"],
        maxLength: [20, "Name must be less than 20 characters"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: [true, "Email already registered"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password required'],
        minLength: [8, 'Password must be at least 8 characters']
    },
    role: {
        type: String,
        required:true,
        enum: ['USER', 'ADMIN'],
        default: 'USER' 
    },
    avatar: {
        public_id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: String ,
    subscription: {
        id: { type: String },
        status: { type: String }
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { 
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    if(!this.role){
        this.role="USER";
    }
    next();
});

userSchema.methods.comparePassword = async function(plainText) {
    if (!plainText || !this.password) {
        return false; // Return false if either plaintext or hashed password is not provided
    }
    return await bcrypt.compare(plainText, this.password);
};
userSchema.methods.generatePasswordToken=async function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.forgotPasswordExpiry=Date.now()+15*60*1000; //15 min from now;
    return resetToken;
}

userSchema.methods.generateJWTToken = async function() {
    return await JWT.sign(
        {
            id: this._id,
            role: this.role,
            email: this.email,
            subscription: this.subscription, 
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'24h'
        }
    );
};

const User = model('User', userSchema);


export default User;
