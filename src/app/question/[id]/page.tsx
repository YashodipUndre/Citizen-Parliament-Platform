"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Question, Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, Send, User as UserIcon, Calendar, MessageSquare, Clock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';

export default function QuestionDetail() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const id = params.id as string;
    const{logout}=useAuth();
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            const data = await api.fetchQuestionById(id);
            setQuestion(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleComment = async () => {
        if (!user || !commentText.trim()) return;
        setSubmitting(true);
        try {
            await api.addComment(id, user.id, commentText);
            setCommentText('');
            loadData(); // Refresh to see new comment
        } catch (e) {
           logout();
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    if (!question) return <div className="min-h-screen flex items-center justify-center">Question not found</div>;

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
            <div className="max-w-[1200px] mx-auto bg-white/50 backdrop-blur-sm min-h-screen border-x border-white/50 shadow-2xl shadow-gray-200/50">

                <header className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white/80 sticky top-0 z-20 backdrop-blur-md">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Discussion Thread</h1>
                </header>

                <main className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">

                    {/* Main Question Card Style */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
                        <div className="flex gap-3 mb-6">
                            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {question.category}
                            </span>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {question.status}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {question.title}
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
                            {question.desc}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-50 pt-6">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(question.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                <span className="text-primary">▲</span>
                                <span>{question.votes} Votes</span>
                            </div>
                        </div>
                   </div>

                    {/* Comments Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            <h3 className="text-xl font-bold text-gray-900">Community Discussion</h3>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {question.comments?.length || 0}
                            </span>
                        </div>

                        {/* Comment Input */}
                        {user ? (
                            <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                    <span className="font-bold text-primary-700 uppercase">{user.name[0]}</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <textarea
                                        placeholder="Add to the discussion..."
                                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 rounded-lg p-3 min-h-[100px] outline-none transition-all resize-none"
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleComment}
                                            disabled={submitting || !commentText.trim()}
                                            className="bg-primary hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition disabled:opacity-50"
                                        >
                                            {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200">
                                <p className="text-gray-500 text-sm">Log in to join the conversation.</p>
                            </div>
                        )}

                        {/* Comment List */}
                        <div className="space-y-4">
                            {question.comments && question.comments.length > 0 ? (
                                question.comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm group">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                            <UserIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 text-sm">{comment.userName}</span>
                                                    <span className="text-xs text-gray-400">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {user && user.id === comment.author && (
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm("Delete this comment?")) {
                                                                try{
                                                                await api.deleteComment(comment._id);
                                                                loadData();
                                                                } catch(error){
                                                                   logout();
                                                                }
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-8">No comments yet. Be the first to speak up!</p>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
