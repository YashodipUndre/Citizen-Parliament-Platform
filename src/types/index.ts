export type QuestionCategory = 'Infrastructure' | 'Healthcare' | 'Education' | 'Economy';
export type QuestionStatus = 'New' | 'Under Review' | 'Trending' | 'Merged/Consolidated';

export interface Comment {
    _id: string; // MongoDB ID
    text: string;
    userName: string;
    author: string; // User ID
    createdAt: string;
}

export interface Question {
    id: number;
    title: string;
    category: QuestionCategory;
    desc: string;
    votes: number;
    status: QuestionStatus;
    comments?: Comment[];
    createdAt?: string;
}
