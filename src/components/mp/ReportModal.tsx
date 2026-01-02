import { Question, QuestionCategory } from '@/types';
import { X, BarChart3, PieChart, Users, TrendingUp, AlertCircle, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    questions: Question[];
}

export function ReportModal({ isOpen, onClose, questions }: ReportModalProps) {
    if (!isOpen) return null;

    // Calculate Stats
    const totalQuestions = questions.length;
    const totalVotes = questions.reduce((sum, q) => sum + q.votes, 0);
    const resolvedQuestions = questions.filter(q => q.status === 'Merged/Consolidated').length;

    // Category Breakdown
    const categories: QuestionCategory[] = ['Infrastructure', 'Healthcare', 'Education', 'Economy'];
    const categoryStats = categories.map(cat => ({
        name: cat,
        count: questions.filter(q => q.category === cat).length,
        votes: questions.filter(q => q.category === cat).reduce((sum, q) => sum + q.votes, 0),
        color: cat === 'Infrastructure' ? 'bg-blue-500' :
            cat === 'Healthcare' ? 'bg-emerald-500' :
                cat === 'Education' ? 'bg-purple-500' : 'bg-orange-500'
    }));

    const maxVotes = Math.max(...categoryStats.map(s => s.votes), 1);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 relative border border-gray-100">

                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-gray-900 to-gray-800 -z-10 rounded-t-[2.5rem]"></div>

                <div className="p-8 md:p-12">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary-400" />
                                Legislative Impact Report
                            </h2>
                            <p className="text-gray-400 font-medium">Session Summary • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all hover:rotate-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-default">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Proposals</div>
                                <div className="text-3xl font-black text-gray-900">{totalQuestions}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-default">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Public Engagement</div>
                                <div className="text-3xl font-black text-gray-900">{totalVotes.toLocaleString()} <span className="text-sm font-medium text-gray-400">Votes</span></div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-default">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Resolution Rate</div>
                                <div className="text-3xl font-black text-gray-900">{totalQuestions > 0 ? Math.round((resolvedQuestions / totalQuestions) * 100) : 0}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Category Engagement */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-gray-400" />
                                Engagement by Category
                            </h3>
                            <div className="space-y-6">
                                {categoryStats.map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-gray-700">{stat.name}</span>
                                            <span className="text-sm font-black text-gray-900">{stat.votes.toLocaleString()} votes</span>
                                        </div>
                                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-1000 ease-out rounded-full", stat.color)}
                                                style={{ width: `${(stat.votes / maxVotes) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#020617] p-8 rounded-[2rem] text-white overflow-hidden relative">
                            {/* Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-xl font-black mb-6 relative z-10">AI Sentiment Summary</h3>
                            <div className="space-y-4 relative z-10 text-gray-400 text-sm leading-relaxed">
                                <p>
                                    Based on the current <span className="text-white font-bold">{totalQuestions}</span> active proposals, the community is showing significant interest in <span className="text-primary-400 font-bold">Infrastructure</span> improvements.
                                </p>
                                <p>
                                    High-engagement topics suggest a public demand for transparency in budget allocation and local development timelines.
                                </p>
                                <div className="pt-4 border-t border-white/10 mt-6">
                                    <div className="flex items-center gap-2 text-white font-bold mb-2">
                                        <AlertCircle className="w-4 h-4 text-orange-400" />
                                        Legislative Priority
                                    </div>
                                    <p className="italic">
                                        "Focus on Infrastructure projects with over 500+ votes for the upcoming quarterly review."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-gray-400 text-xs font-medium max-w-md text-center md:text-left">
                            This report is generated dynamically based on real-time citizen engagement data.
                            Unauthorized distribution is prohibited.
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Print Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
