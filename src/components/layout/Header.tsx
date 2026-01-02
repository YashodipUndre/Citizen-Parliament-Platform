import { Search, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';

interface HeaderProps {
    currentView: 'voter' | 'mp';
    onViewChange: (view: 'voter' | 'mp') => void;
    onSearch: (query: string) => void;
}

export function Header({ currentView, onViewChange, onSearch }: HeaderProps) {
    const { user, logout } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="flex flex-col md:flex-row items-center justify-between px-8 py-5 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                        MP
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight text-lg">Parliamentary Connect</span>
                        <span className="text-[10px] text-primary-600 uppercase tracking-widest font-semibold">Direct Democracy Portal</span>
                    </div>
                </div>

                <div className="flex bg-gray-100/50 p-1.5 rounded-xl my-4 md:my-0 border border-transparent hover:border-gray-200 transition-colors">
                    {/* Strict Role Based Navigation */}
                    {(!user || user.role === 'citizen') && (
                        <button
                            disabled={true} // Strict mode: No switching
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 bg-white shadow-md text-primary-700 ring-1 ring-black/5 opacity-100 cursor-default"
                            )}
                        >
                            Citizen Dashboard
                        </button>
                    )}

                    {user?.role === 'mp' && (
                        <button
                            disabled={true}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 bg-white shadow-md text-primary-700 ring-1 ring-black/5 opacity-100 cursor-default"
                            )}
                        >
                            MP Dashboard
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            onChange={(e) => onSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition bg-white"
                            >
                                <span className="text-sm font-bold text-gray-700">{user.name}</span>
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Role</p>
                                        <p className="text-sm font-medium text-primary-700 capitalize">{user.role}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="bg-primary hover:bg-primary-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
