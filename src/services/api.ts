import { useAuth } from '@/context/AuthContext';
import { Question } from '@/types';
import router from 'next/router';
import toast from "react-hot-toast";
const API_URL = '/api/questions';
export const api = {

    fetchQuestions: async (): Promise<Question[]> => {
        const res = await fetch(API_URL, {
            credentials: 'include',
        });
        return res.json();
    },

    fetchQuestionById: async (id: string): Promise<Question> => {
        const res = await fetch(`${API_URL}/${id}`, {
            credentials: 'include',
        });
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    },

    addQuestion: async (title: string, category: string, desc: string): Promise<Question> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title, category, desc }),
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
            throw new Error(data.error || "Failed to create question");
        }

        const result = await res.json();
        toast.success("Question created successfully!");
        return result;
    },

    upvote: async (id: number): Promise<void> => {
        const res = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ action: 'upvote', id }),
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
        }
        return res.json();
    },

    merge: async (ids: number[]): Promise<void> => {
        const res = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ action: 'merge', ids }),
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
        }
        return res.json();
    },

    addComment: async (questionId: string, userId: string, text: string) => {
        const res = await fetch(`${API_URL}/${questionId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId, text })
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
        }
        return res.json();
    },

    deleteComment: async (commentId: string) => {
        const res = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
        }
        return res.json();
    },

    deleteQuestion: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
            throw new Error(data.error || "Failed to delete question");
        }
        toast.success("Question deleted successfully");
        return res.json();
    }
};
