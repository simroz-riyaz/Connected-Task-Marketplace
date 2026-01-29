import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(response.data.token, response.data.user);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 70px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-offset)',
            padding: '2rem'
        }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome back</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    New to Connected? <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</a>
                </p>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(249, 72, 82, 0.1)',
                        color: 'var(--error)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    outline: 'none'
                                }}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    outline: 'none'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                        <a href="#" style={{ display: 'block', textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)' }}>
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.875rem', display: 'flex', gap: '8px' }}
                    >
                        {isSubmitting ? <Loader className="animate-spin" size={20} /> : 'Log in'}
                    </button>
                </form>

                <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                    <span>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                </div>

                <button className="btn btn-outline" style={{ width: '100%', padding: '0.875rem' }}>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
