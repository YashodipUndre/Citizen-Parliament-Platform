import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const { login, signup } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'citizen'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.name, formData.email, formData.password, formData.role);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' ? 'Welcome Back' : 'Join the Platform'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {mode === 'login' ? 'Sign in to participate' : 'Create an account to get started'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">I am a...</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'citizen' })}
                                        className={cn(
                                            "p-3 rounded-lg text-sm font-bold border transition",
                                            formData.role === 'citizen'
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        Citizen User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'mp' })}
                                        className={cn(
                                            "p-3 rounded-lg text-sm font-bold border transition",
                                            formData.role === 'mp'
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        MP / Staff
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-primary font-bold hover:underline"
                        >
                            {mode === 'login' ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
