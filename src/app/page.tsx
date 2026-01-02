'use client';
import toast from "react-hot-toast";
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { CitizenView } from '@/components/citizen/CitizenView';
import { MPView } from '@/components/mp/MPView';
import { api } from '@/services/api';
import { Question, QuestionCategory } from '@/types';

export default function Home() {
  const [view, setView] = useState<'voter' | 'mp'>('voter');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const {logout} = useAuth();
  const fetchData = async () => {
    try {
      const data = await api.fetchQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Strict Role-Based View Control
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (user?.role === 'mp') {
        setView('mp');
      } else {
        setView('voter');
      }
    }
  }, [user, authLoading]);

  const handleUpvote = async (id: number) => {
    // Optimistic update
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, votes: q.votes + 1 } : q));
    try {
      await api.upvote(id);
      fetchData(); // Sync with server eventually
    } catch (error:any) {
      logout();
    }
  };

  const handleSubmit = async (title: string, category: QuestionCategory, desc: string) => {
   try {
    await api.addQuestion(title, category, desc);
    toast.success("Question submitted successfully");
    fetchData();
  } catch (error) {
    logout(); // ✅ middleware error shown here
  }
  };

  const handleMerge = async (id: number[]) => {
    try {
      await api.merge(id);
      await fetchData();
    } catch (error) {
      logout();
    }
  };

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans text-foreground">
      <div className="max-w-[1600px] mx-auto bg-white/50 backdrop-blur-sm shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden min-h-[90vh] flex flex-col my-4 md:my-8 border border-white/50">

        <Header
          currentView={view}
          onViewChange={setView}
          onSearch={setSearchQuery}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-400 font-medium animate-pulse">Loading Democracy...</div>
          ) : (
            <>
              {view === 'voter' && (
                <CitizenView
                  questions={filteredQuestions}
                  onUpvote={handleUpvote}
                  onSubmit={handleSubmit}
                />
              )}

              {view === 'mp' && (
                <MPView
                  questions={filteredQuestions}
                  onMerge={handleMerge}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
