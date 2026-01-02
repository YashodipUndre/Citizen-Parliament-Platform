import { Question } from '@/types';
import { ManagementTable } from './ManagementTable';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Download, FileText } from 'lucide-react';

interface MPViewProps {
    questions: Question[];
    onMerge: (ids: number[]) => Promise<void>;
}

export function MPView({ questions, onMerge }: MPViewProps) {
    const { user } = useAuth();

    if (!user || user.role !== 'mp') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Restricted Access</h2>
                <p className="text-gray-500 max-w-md text-center">
                    This dashboard is reserved for Members of Parliament and authorized staff. Please log in with an MP account to access legislative tools.
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-8 animate-in fade-in mt-2 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Legislative Dashboard</h2>
                    <p className="text-gray-500 mt-1">Review, consolidate, and prioritize citizen inquiries for the assembly.</p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm">
                        <FileText className="w-4 h-4" /> Reports
                    </button>
                    <button className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-gray-200 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Session Data
                    </button>
                </div>
            </div>

            <ManagementTable questions={questions} onMerge={onMerge} />
        </section>
    );
}
