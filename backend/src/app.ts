import express from "express"
import cors from "cors"
import runGraph from "./ai/graph.ai.js"
import connectDB from "./config/db.js"
import Battle from "./models/battle.model.js"

connectDB();

const app = express()

app.use(cors())
app.use(express.json())

app.post("/api/battle", async (req, res) => {
    try {
        const { problem } = req.body
        if (!problem || typeof problem !== "string" || !problem.trim()) {
            res.status(400).json({ error: "A problem statement is required." })
            return
        }
        const result = await runGraph(problem.trim())
        
        // Save battle to MongoDB
        const newBattle = new Battle({
            problem: problem.trim(),
            solution_1: result.solution_1,
            solution_2: result.solution_2,
            judge: result.judge
        })
        await newBattle.save()

        res.json(result)
    } catch (err: any) {
        console.error("Graph error:", err)
        res.status(500).json({ error: err?.message ?? "Internal server error" })
    }
})

app.get("/api/battles", async (req, res) => {
    try {
        const battles = await Battle.find().sort({ createdAt: -1 }).limit(15)
        res.json(battles)
    } catch (err: any) {
        console.error("Fetch battles error:", err)
        res.status(500).json({ error: "Failed to fetch battle history" })
    }
})

export default app