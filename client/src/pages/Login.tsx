import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A1A 0%, #0e0e30 50%, #0D0D2B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.25rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background orbs */}
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{
                            width: '44px', height: '44px',
                            background: 'linear-gradient(135deg, #6C63FF 0%, #A855F7 100%)',
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 900, fontSize: '1.3rem',
                            boxShadow: '0 0 24px rgba(108,99,255,0.5)',
                        }}>K</div>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#e3e0f8', letterSpacing: '-0.02em' }}>Connected</span>
                    </Link>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(26, 26, 43, 0.85)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '28px',
                    padding: '2.5rem',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(108,99,255,0.08)',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e3e0f8', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Welcome back
                        </h1>
                        <p style={{ color: '#918fa1', fontSize: '0.925rem' }}>Sign in to your Connected account</p>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '14px',
                            padding: '0.875rem 1.125rem',
                            color: '#F87171',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="login-email">Email</label>
                            <div className="input-icon-wrapper">
                                <Mail size={16} className="input-icon" />
                                <input
                                    id="login-email"
                                    type="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="form-label" htmlFor="login-password">Password</label>
                                <a href="#" style={{ fontSize: '0.8rem', color: '#c4c0ff', fontWeight: 500 }}>Forgot password?</a>
                            </div>
                            <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                                <Lock size={16} className="input-icon" />
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: '#918fa1', cursor: 'pointer', padding: '4px',
                                    }}
                                >
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="btn btn-primary btn-full btn-lg"
                            disabled={loading}
                            style={{ marginTop: '0.5rem', gap: '0.5rem' }}
                        >
                            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>

                    <div className="divider-text" style={{ margin: '1.75rem 0' }}>OR</div>

                    {/* Google placeholder */}
                    <button
                        className="btn btn-outline btn-full"
                        style={{ gap: '0.75rem', marginBottom: '1.75rem' }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>🇬</span>
                        Continue with Google
                    </button>

                    <p style={{ textAlign: 'center', color: '#918fa1', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" id="login-to-register-link" style={{ color: '#c4c0ff', fontWeight: 600 }}>
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
