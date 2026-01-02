import mongoose, { Schema, models } from "mongoose";

export const QuestionSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['Infrastructure', 'Healthcare', 'Education', 'Economy']
        },
        desc: { type: String, required: true },
        votes: { type: Number, default: 1 },
        status: {
            type: String,
            default: 'New',
            enum: ['New', 'Under Review', 'Trending', 'Merged/Consolidated']
        },
    },
    { timestamps: true }
);

export const QS = models.Question || mongoose.model("Question", QuestionSchema);
