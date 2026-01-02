import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QS } from '@/app/models/questions';
import { User } from '@/app/models/user';
import { Comment } from '@/app/models/comment';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    const { userId, text } = body;

    try {
        const question = await QS.findOne({ id: parseInt(id) });
        if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Create independent comment
        const newComment = await Comment.create({
            text,
            author: user._id,
            userName: user.name, // Cache name
            question: question._id
        });

        return NextResponse.json({ success: true, comment: newComment });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
