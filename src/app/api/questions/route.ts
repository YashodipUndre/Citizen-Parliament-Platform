import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/types';
import { connectDB } from '@/lib/db';
import { QS } from '@/app/models/questions';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "default_dev_secret_do_not_use_in_prod";
const secret = new TextEncoder().encode(JWT_SECRET);
export async function GET() {
    await connectDB();

    // Aggregation to get questions with comment count
    const questions = await QS.aggregate([
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'question',
                as: 'commentsData'
            }
        },
        {
            $addFields: {
                // We map to an array of empty objects just to satisfy the TS interface which expects comments[] 
                // Alternatively, we could update the interface, but this is a quick fix to show length.
                comments: '$commentsData'
            }
        },
        {
            $project: {
                commentsData: 0
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json(questions);
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id as string;

        const body = await request.json();
        const newQuestion: Question = {
            id: Date.now(),
            title: body.title,
            category: body.category,
            desc: body.desc,
            votes: 1,
            status: 'New',
            author: userId
        };
        await QS.create(newQuestion);
        return NextResponse.json(newQuestion);
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized or invalid session" }, { status: 401 });
    }
}

export async function PUT(request: NextRequest) {
    await connectDB();
    const body = await request.json();
    const { action, id, ids } = body;

    if (action === 'upvote') {
        const q = await QS.findOne({ id: parseInt(id.toString()) });
        if (q) {
            q.votes++;
            await q.save();
        }
        const allQuestions = await QS.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, questions: allQuestions });
    }

    if (action === 'merge') {
        const selectedIds = ids as number[];
        if (!selectedIds || selectedIds.length < 2) return NextResponse.json({ error: "Select at least 2" }, { status: 400 });

        const itemsToMerge = await QS.find({ id: { $in: selectedIds } });
        if (itemsToMerge.length < 2) return NextResponse.json({ error: "No items found" }, { status: 404 });

        // Sort by ID to keep the oldest as master
        itemsToMerge.sort((a, b) => a.id - b.id);

        const totalVotes = itemsToMerge.reduce((sum, item) => sum + item.votes, 0);
        const master = itemsToMerge[0];

        // IDs to delete (all except master)
        const idsToDelete = itemsToMerge.slice(1).map(q => q.id);

        // Update Master
        await QS.findOneAndUpdate(
            { id: master.id },
            {
                votes: totalVotes,
                status: "Merged/Consolidated",
                title: master.title.startsWith("[Consolidated]") ? master.title : "[Consolidated] " + master.title
            }
        );

        // Delete merged items
        await QS.deleteMany({ id: { $in: idsToDelete } });

        const allQuestions = await QS.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, questions: allQuestions });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
