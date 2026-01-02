import { useState } from 'react';
import { QuestionCategory } from '@/types';
import { Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, category: QuestionCategory, desc: string) => Promise<void>;
}

export function SubmitForm({ isOpen, onClose, onSubmit }: SubmitFormProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<QuestionCategory>('Infrastructure');
    const [desc, setDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!title) return alert("Title is required");
        setIsSubmitting(true);
        await onSubmit(title, category, desc);
        setIsSubmitting(false);
        setTitle('');
        setDesc('');
    }

    return (
        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-200/50 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-accent-500"></div>

            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-2xl text-gray-900">New Proposal</h3>
                    <p className="text-gray-500 text-sm">Submit your question to the parliamentary docket.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Topic Title</label>
                    <input
                        type="text"
                        placeholder="E.g., Sustainable Urban Planning Initiative"
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-800 placeholder:text-gray-400"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Category</label>
                    <select
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-gray-800"
                        value={category}
                        onChange={e => setCategory(e.target.value as QuestionCategory)}
                    >
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Economy">Economy</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Detailed Description</label>
                <textarea
                    placeholder="Provide context, evidence, and your specific request..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium text-gray-800 placeholder:text-gray-400"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gray-900 hover:bg-primary-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isSubmitting ? 'Posting...' : 'Submit Proposal'}
                </button>
            </div>
        </div>
    );
}
