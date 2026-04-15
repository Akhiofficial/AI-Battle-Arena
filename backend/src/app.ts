import express from "express"
import cors from "cors"
import runGraph from "./ai/graph.ai.js"
import connectDB from "./config/db.js"
import Battle from "./models/battle.model.js"
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages"

connectDB();

const app = express()

app.use(cors())
app.use(express.json())

app.post("/api/battle", async (req, res) => {
    try {
        const { problem, battleId } = req.body
        if (!problem || typeof problem !== "string" || !problem.trim()) {
            res.status(400).json({ error: "A problem statement is required." })
            return
        }

        let history: BaseMessage[] = []
        let existingBattle = null

        if (battleId) {
            existingBattle = await Battle.findById(battleId)
            if (existingBattle) {
                // Construct history from initial problem and all turns
                history.push(new HumanMessage(existingBattle.problem))
                history.push(new AIMessage(`Solution 1: ${existingBattle.solution_1}\nSolution 2: ${existingBattle.solution_2}\nJudge Verdict: ${existingBattle.judge.solution_1_reasoning}\n${existingBattle.judge.solution_2_reasoning}`))

                for (const turn of existingBattle.turns) {
                    history.push(new HumanMessage(turn.problem))
                    history.push(new AIMessage(`Solution 1: ${turn.solution_1}\nSolution 2: ${turn.solution_2}\nJudge Verdict: ${turn.judge.solution_1_reasoning}\n${turn.judge.solution_2_reasoning}`))
                }
            }
        }

        const result = await runGraph(problem.trim(), history)
        
        const turnData = {
            problem: problem.trim(),
            solution_1: result.solution_1,
            solution_2: result.solution_2,
            judge: result.judge
        }

        if (existingBattle) {
            // Append to existing battle
            existingBattle.turns.push(turnData)
            // Update top-level fields to the latest turn for sidebar visibility/compat
            existingBattle.solution_1 = result.solution_1
            existingBattle.solution_2 = result.solution_2
            existingBattle.judge = result.judge
            await existingBattle.save()
            res.json(existingBattle)
        } else {
            // Create new battle
            const newBattle = new Battle({
                ...turnData,
                turns: [turnData] // Include first turn in the array for easy rendering
            })
            await newBattle.save()
            res.json(newBattle)
        }

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