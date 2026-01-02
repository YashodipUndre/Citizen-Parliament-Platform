'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import {
    Users,
    MessageSquare,
    CheckCircle2,
    ArrowRight,
    ChevronRight,
    Megaphone,
    Shield,
    BarChart3,
    ArrowUpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Auto-redirect removed to allow viewing landing page when logged in

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const stats = [
        { label: 'Active Citizens', value: '12K+', icon: Users },
        { label: 'Proposals Submitted', value: '4.5K+', icon: Megaphone },
        { label: 'Legislative Wins', value: '86', icon: CheckCircle2 },
    ];


    const features = [
        {
            title: 'Submit Proposals',
            desc: 'Voice your concerns and suggest improvements for your community directly to the parliament.',
            icon: Megaphone,
            color: 'bg-blue-500',
        },
        {
            title: 'Unified Voting',
            desc: 'Crowdsource the most important issues. The community votes on what needs immediate attention.',
            icon: ArrowUpCircle,
            color: 'bg-orange-500',
        },
        {
            title: 'MP Engagement',
            desc: 'Members of Parliament review and respond to trending topics, ensuring your voice is heard.',
            icon: Users,
            color: 'bg-purple-500',
        },
        {
            title: 'Smart Consolidation',
            desc: 'Our platform automatically groups related proposals to build stronger, unified local movements.',
            icon: Shield,
            color: 'bg-emerald-500',
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30 overflow-x-hidden">
            {/* Background Glows */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px] -z-10"></div>

            {/* Navigation */}
            <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-white/90">
                        CITIZEN<span className="text-primary-500">POLL</span>
                    </span>
                </div>
                {user ? (
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 px-6 py-2.5 rounded-full font-bold text-sm border border-primary-500/30 transition-all active:scale-95"
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => openAuth('login')}
                            className="text-white/70 hover:text-white font-bold text-sm transition font-sans"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => openAuth('signup')}
                            className="bg-white/5 hover:bg-white/10 text-white/90 px-6 py-2.5 rounded-full font-bold text-sm border border-white/10 transition-all active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 pt-20 pb-16 text-center relative">
                <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-primary-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    Empowering Civic Action
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    Your Perspective <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400">
                        Shapes Democracy.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100">
                    Bridge the gap between citizens and parliament. Submit proposals, vote on community priorities, and watch real legislative change happen in real-time.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-200">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="group bg-primary-600 hover:bg-primary-500 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary-500/40 transition-all flex items-center gap-3 hover:-translate-y-1 active:translate-y-0"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-5 rounded-2xl font-black text-lg transition-all">
                        Watch Demo
                    </button>
                </div>
            </header>

            {/* Platform Preview and Stats removed as per request */}


            {/* Features Section */}
            <section className="container mx-auto px-6 py-32 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">Designed for Impact</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We've built a suite of tools to ensure every citizen can participate effectively in the legislative process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <div className="relative bg-[#0f172a] border border-white/5 p-8 rounded-[2rem] h-full flex flex-col hover:border-white/10 transition-all">
                                <div className={cn("inline-flex p-3 rounded-2xl mb-6 shadow-2xl", feature.color)}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-xl font-black mb-4 group-hover:text-primary-400 transition-colors">{feature.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-6 py-32">
                <div className="relative rounded-[3rem] bg-gradient-to-br from-primary-600 to-primary-900 p-12 md:p-24 overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight">
                        The Future of Democracy <br className="hidden md:block" /> is in Your Hands.
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white text-primary-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            <footer className="container mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>© 2026 CitizenParliament Platform. Built for the People.</span>
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Transparency</a>
                    <a href="#" className="hover:text-white transition-colors">Open Source</a>
                </div>
            </footer>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
}
