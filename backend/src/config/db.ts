import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        if (!config.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }
        await mongoose.connect(config.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (err: any) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

export default connectDB;
