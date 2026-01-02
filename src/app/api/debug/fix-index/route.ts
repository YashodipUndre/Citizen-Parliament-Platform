import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/app/models/user';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectDB();

        // Check current indexes
        const indexes = await User.collection.indexes();

        // Attempt to drop the specific problematic index
        // The error mentioned "username_1"
        try {
            await User.collection.dropIndex('username_1');
            return NextResponse.json({
                success: true,
                message: "Dropped username_1 index",
                indexesBefore: indexes
            });
        } catch (e: any) {
            return NextResponse.json({
                success: false,
                message: "Failed to drop index (it might not exist?)",
                error: e.message,
                indexes: indexes
            });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
