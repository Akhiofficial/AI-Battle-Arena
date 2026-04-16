import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import battleRoutes from "./routes/battle.routes.js"

dotenv.config();
connectDB();

const app = express()

app.use(cors({
    origin: true, // Allow all origins for now, or specify frontend URL
    credentials: true // Required for cookies
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api", battleRoutes)

export default app