import mongoose, { Schema, models } from "mongoose";

const CommentSchema = new Schema(
    {
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        userName: { type: String }, // Cache name to avoid massive populates
    },
    { timestamps: true }
);

export const Comment = models.Comment || mongoose.model("Comment", CommentSchema);
