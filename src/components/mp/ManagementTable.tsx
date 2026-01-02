import { useState } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, ArrowRightLeft, FileOutput, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ManagementTableProps {
    questions: Question[];
    onMerge: (ids: number[]) => Promise<void>;
}

export function ManagementTable({ questions, onMerge }: ManagementTableProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { user } = useAuth(); // Could verify role here too but parent handles view

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(idx => idx !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleMerge = async () => {
        if (selectedIds.length < 2) return alert("Select at least 2 questions to merge");
        if (confirm(`Are you sure you want to merge ${selectedIds.length} items? This action cannot be undone.`)) {
            await onMerge(selectedIds);
            setSelectedIds([]);
        }
    };

    // Status badges
    const statusBadges = {
        'New': 'bg-blue-50 text-blue-700',
        'Under Review': 'bg-amber-50 text-amber-700',
        'Trending': 'bg-purple-50 text-purple-700',
        'Merged/Consolidated': 'bg-rose-50 text-rose-700'
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckSquare className="w-4 h-4" />
                    <span className="font-medium">{selectedIds.length} items selected</span>
                </div>
                <button
                    onClick={handleMerge}
                    disabled={selectedIds.length < 2}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold border transition-all shadow-sm",
                        selectedIds.length >= 2
                            ? "bg-accent-50 text-accent-700 border-accent-200 hover:bg-accent-100 hover:shadow-md"
                            : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    )}
                >
                    <ArrowRightLeft className="w-4 h-4" />
                    Merge Selected
                </button>
            </div>

            <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/40">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold tracking-wider backdrop-blur-sm">
                        <tr>
                            <th className="p-5 w-14 text-center">
                                {/* Ideally select all checkbox here */}
                            </th>
                            <th className="p-5">Question Details</th>
                            <th className="p-5">Category</th>
                            <th className="p-5">Priority</th>
                            <th className="p-5 text-center">Votes</th>
                            <th className="p-5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {questions.map((q) => {
                            const barWidth = Math.min((q.votes / 10), 100);

                            return (
                                <tr key={q.id} className={cn(
                                    "hover:bg-gray-50/80 transition-colors group",
                                    selectedIds.includes(q.id) ? "bg-primary-50/30" : ""
                                )}>
                                    <td className="p-5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(q.id)}
                                            onChange={() => toggleSelect(q.id)}
                                            className="w-5 h-5 accent-primary rounded-md cursor-pointer border-gray-300 transition-all focus:ring-primary/20"
                                        />
                                    </td>
                                    <td className="p-5 max-w-md">
                                        <Link href={`/question/${q.id}`} className="block group/link">
                                            <div className="font-bold text-gray-900 group-hover/link:text-primary-700 hover:underline transition-colors text-base mb-1 flex items-center gap-2">
                                                {q.title}
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-xs text-gray-500 line-clamp-1 font-medium">{q.desc}</div>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-medium">
                                                <MessageSquare className="w-3 h-3" />
                                                <span>{q.comments?.length || 0} comments</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600 uppercase tracking-wide border border-gray-200">
                                            {q.category}
                                        </span>
                                    </td>
                                    <td className="p-5 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000 ease-out rounded-full",
                                                        barWidth > 80 ? "bg-gradient-to-r from-red-500 to-rose-500" :
                                                            barWidth > 50 ? "bg-gradient-to-r from-amber-400 to-orange-500" :
                                                                "bg-gradient-to-r from-teal-400 to-primary-500"
                                                    )}
                                                    style={{ width: `${barWidth}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{(q.votes / 10).toFixed(0)}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 font-bold text-gray-700 text-center text-lg font-mono tracking-tight">{q.votes}</td>
                                    <td className="p-5">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                                            statusBadges[q.status] || "".split(" ")[0] // Hacky default, assumes valid status
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", statusBadges[q.status]?.replace('bg-', 'bg-current text-').split(" ")[1] || "bg-gray-500")}></div>
                                            {q.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
