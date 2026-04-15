import { StateGraph, StateSchema, START, END, type GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { cohereModel, geminiModel, mistralModel } from "./models.ai.js";
import { createAgent, providerStrategy } from "langchain";
import { HumanMessage, BaseMessage, AIMessage } from "@langchain/core/messages";

const state = new StateSchema({
    problem: z.string().default(""),
    history: z.array(z.custom<BaseMessage>()).default([]),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default("")
    })
})

const solutionNode: GraphNode<typeof state> = async (state) => {
    const messages = [...state.history, new HumanMessage(state.problem)];

    const [mistralResponse, cohereResponse] = await Promise.all([
        mistralModel.invoke(messages),
        cohereModel.invoke(messages)
    ])
 
    return {
        solution_1: mistralResponse.content as string,
        solution_2: cohereResponse.content as string
    }
}

const judgeNode: GraphNode<typeof state> = async (state) => {
    const { problem, solution_1, solution_2, history } = state

    const judge = createAgent({
        model: geminiModel,
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
            solution_1_reasoning: z.string().default(""),
            solution_2_reasoning: z.string().default("")
        })),
        systemPrompt: "You are a judge tasked with evaluating the solutions generated. Please provide a score out of 10 for each solution, along with your reasoning. Consider the conversation history if provided."
    })

    const judgeResponse = await judge.invoke({
        messages: [
            ...history,
            new HumanMessage({
                content: `Problem: ${problem}
            Solution 1: ${solution_1}
            Solution 2: ${solution_2} 
            please evaluate the solutions based on the problem and previous context, and provide scores and reasoning.`
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

export default async function runGraph(problem: string, history: BaseMessage[] = []) {
    const result = await graph.invoke({
        problem: problem,
        history: history
    })
    return result
}



