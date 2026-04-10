import { StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { cohereModel, geminiModel, mistralModel } from "./models.ai.js";
import { createAgent, providerStrategy } from "langchain";
import { HumanMessage } from "@langchain/core/messages";

/**
 * StateSchema for the graph nodes (basically structure of nodes) used to defined format of data 
 * 
 * typescript use to defined types so here we are defineding format type etc 
 */
const state = new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default("")
    })
})

// type defined 
const solutionNode: GraphNode<typeof state> = async (state) => {

    const [mistralResponse, cohereResponse] = await Promise.all([
        mistralModel.invoke(state.problem),
        cohereModel.invoke(state.problem)
    ])

    return {
        solution_1: mistralResponse.text,
        solution_2: cohereResponse.text
    }
}

const judgeNode: GraphNode<typeof state> = async (state) => {

    const { problem, solution_1, solution_2 } = state

    const judge = createAgent({
        model: geminiModel,
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
            solution_1_reasoning: z.string().default(""),
            solution_2_reasoning: z.string().default("")
        })),
        systemPrompt: "You are a judge tasked with evaluting the solutions generate, Please Provide a score out of 10 for each solution, along with your reasoning for the scores"
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage({
                content: `Problem: ${problem}
            Solution 1: ${solution_1}
            Solution 2: ${solution_2} 
            please evalute the solutions and provide scores and reasoning. `
            })
        ]
    })

    const { solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning } = judgeResponse.structuredResponse

    return {
        judge: {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning
        }
    }
}

const graph = new StateGraph(state)

    .addNode("solution_node", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution_node")
    .addEdge("solution_node", "judge_node")
    .addEdge("judge_node", END)
    .compile()

export default async function runGraph(problem: string) {
    const result = await graph.invoke({
        problem: problem
    })
    return result
}


