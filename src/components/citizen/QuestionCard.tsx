import { ArrowBigUp, Share2, MessageSquare, Trash2 } from 'lucide-react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface QuestionCardProps {
    question: Question;
    onUpvote: (id: number) => void;
    onDelete: (id: number) => void;
}

export function QuestionCard({ question, onUpvote, onDelete }: QuestionCardProps) {
    const { user } = useAuth();

    // Status colors mapping
    const statusColors = {
        'New': 'bg-blue-50 text-blue-700 ring-blue-600/20',
        'Under Review': 'bg-amber-50 text-amber-700 ring-amber-600/20',
        'Trending': 'bg-purple-50 text-purple-700 ring-purple-600/20',
        'Merged/Consolidated': 'bg-rose-50 text-rose-700 ring-rose-600/20'
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
            <Link href={`/question/${question.id}`} className="flex-1 p-6 block">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-600 py-1 px-2 bg-primary-50 rounded-md">
                        {question.category}
                    </span>
                    <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full ring-1 ring-inset uppercase tracking-wide",
                        statusColors[question.status] || "bg-gray-100 text-gray-600"
                    )}>
                        {question.status}
                    </span>
                </div>

                <h4 className="font-bold text-gray-900 text-lg mb-3 leading-snug group-hover:text-primary-700 transition-colors">
                    {question.title}
                </h4>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3">
                    {question.desc}
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <MessageSquare className="w-3 h-3" />
                    <span>{question.comments?.length || 0} comments</span>
                </div>
            </Link>

            <div className="px-6 pb-6 pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpvote(question.id)}
                            disabled={!user}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 font-bold text-sm",
                                !user ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" :
                                    "bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white hover:shadow-md hover:shadow-orange-200 shadow-sm"
                            )}
                            title={!user ? "Login to vote" : "Upvote"}
                        >
                            <ArrowBigUp className="w-5 h-5" />
                            <span>{question.votes.toLocaleString()}</span>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/question/${question.id}`} className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors">
                            <MessageSquare className="w-4 h-4" />
                        </Link>
                        {user?.id === question.author && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (confirm("Are you sure you want to delete this question?")) {
                                        onDelete(question.id);
                                    }
                                }}
                                className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-full transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <button className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
