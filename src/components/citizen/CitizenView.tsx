import { useState } from 'react';
import { Question, QuestionCategory } from '@/types';
import { QuestionCard } from './QuestionCard';
import { SubmitForm } from './SubmitForm';
import { useAuth } from '@/context/AuthContext';
import { LockKeyhole, Megaphone } from 'lucide-react';

interface CitizenViewProps {
    questions: Question[];
    onUpvote: (id: number) => void;
    onSubmit: (title: string, category: QuestionCategory, desc: string) => Promise<void>;
}

export function CitizenView({ questions, onUpvote, onSubmit }: CitizenViewProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { user } = useAuth();

    return (
        <section className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-8 md:p-10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-primary/20">
                {/* Abstract Decoration */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 max-w-xl space-y-4">
                    <div className="inline-flex items-center gap-2 bg-primary-800/50 border border-primary-700/50 rounded-full px-4 py-1.5 text-primary-100 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                        <Megaphone className="w-3 h-3 text-accent-400" />
                        <span>Session 2025-Q4 Open</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Voice Your Concern to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">Parliament</span>
                    </h2>
                    <p className="text-primary-100 text-lg leading-relaxed">
                        Direct democracy in action. Submit proposals, prioritize community issues, and get directly heard by your representatives.
                    </p>
                </div>

                <div className="relative z-10">
                    {user ? (
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="bg-white text-primary-900 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
                        >
                            {isFormOpen ? 'Close Form' : 'Submit New Proposal'}
                        </button>
                    ) : (
                        <div className="bg-primary-950/50 backdrop-blur-md border border-primary-800 p-6 rounded-2xl max-w-xs text-center">
                            <div className="mx-auto w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center mb-3">
                                <LockKeyhole className="w-6 h-6 text-primary-300" />
                            </div>
                            <p className="text-primary-100 text-sm mb-0">Sign in to participate in the legislative process.</p>
                        </div>
                    )}
                </div>
            </div>

            <SubmitForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={onSubmit}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q) => (
                    <QuestionCard key={q.id} question={q} onUpvote={onUpvote} />
                ))}
            </div>
        </section>
    );
}
