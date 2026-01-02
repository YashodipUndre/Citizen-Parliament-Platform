import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QS } from '@/app/models/questions';
import { Comment } from '@/app/models/comment';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "default_dev_secret_do_not_use_in_prod";
const secret = new TextEncoder().encode(JWT_SECRET);

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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const id = (await params).id;

    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;

        const question = await QS.findOne({ id: parseInt(id) });
        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        if (question.author !== userId) {
            return NextResponse.json({ error: "You are not authorized to delete this question" }, { status: 403 });
        }

        // Delete question and associated comments
        await QS.deleteOne({ _id: question._id });
        await Comment.deleteMany({ question: question._id });

        return NextResponse.json({ success: true, message: "Question deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized or invalid session" }, { status: 401 });
    }
}
