import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import battleRoutes from "./routes/battle.routes.js"

connectDB();

const app = express()

app.use(cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"], 
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Add COOP header for Google Sign-in to work in popups
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

// Routes
app.use("/api/auth", authRoutes)
app.use("/api", battleRoutes)

export default app