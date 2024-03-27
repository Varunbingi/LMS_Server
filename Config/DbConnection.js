import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const ConnectToDB = async () => {
    try {
    
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/lcm";

        const { connection } = await mongoose.connect(MONGO_URL);

        if (connection) {
            console.log(`MongoDB connected: ${connection.host}`);
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default ConnectToDB;
