import mongoose, { Schema, Document } from "mongoose";

export interface ITurn {
    problem: string;
    solution_1: string;
    solution_2: string;
    judge: {
        solution_1_score: number;
        solution_2_score: number;
        solution_1_reasoning: string;
        solution_2_reasoning: string;
    };
}

export interface IBattle extends Document {
    user: mongoose.Types.ObjectId;
    problem: string;
    solution_1: string;
    solution_2: string;
    judge: {
        solution_1_score: number;
        solution_2_score: number;
        solution_1_reasoning: string;
        solution_2_reasoning: string;
    };
    turns: ITurn[];
    createdAt: Date;
}

const BattleSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: String, required: true },
    solution_1: { type: String, required: true },
    solution_2: { type: String, required: true },
    judge: {
        solution_1_score: { type: Number, required: true },
        solution_2_score: { type: Number, required: true },
        solution_1_reasoning: { type: String, required: true },
        solution_2_reasoning: { type: String, required: true },
    },
    turns: {
        type: [
            {
                problem: String,
                solution_1: String,
                solution_2: String,
                judge: {
                    solution_1_score: Number,
                    solution_2_score: Number,
                    solution_1_reasoning: String,
                    solution_2_reasoning: String,
                },
            },
        ],
        default: [],
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBattle>("Battle", BattleSchema);
