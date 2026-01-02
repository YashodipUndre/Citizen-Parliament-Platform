import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            default: 'citizen',
            enum: ['citizen', 'mp', 'admin']
        },
        constituency: { type: String }, // Optional: link user to a district
    },
    { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
