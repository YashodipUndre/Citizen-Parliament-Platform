import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QS } from '@/app/models/questions';
import { Comment } from '@/app/models/comment';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const id = (await params).id;

    try {
        const question = await QS.findOne({ id: parseInt(id) }).lean();
        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        // Fetch comments separately
        const comments = await Comment.find({ question: question._id }).sort({ createdAt: -1 });
        return NextResponse.json({ ...question, comments });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
