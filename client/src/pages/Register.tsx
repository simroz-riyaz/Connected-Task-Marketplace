import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, Phone, MapPin, Loader, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        role: 'client' as 'client' | 'tasker'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) { setStep(2); return; }
        setError('');
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            window.location.href = '/login';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const roleCardStyle = (role: 'client' | 'tasker'): React.CSSProperties => ({
        flex: 1,
        padding: '1.25rem 1rem',
        background: formData.role === role ? 'rgba(108,99,255,0.12)' : 'rgba(51,51,69,0.5)',
        border: formData.role === role ? '1.5px solid rgba(108,99,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        boxShadow: formData.role === role ? '0 0 20px rgba(108,99,255,0.15)' : 'none',
    });

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
            <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>

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
                            Create your account
                        </h1>
                        <p style={{ color: '#918fa1', fontSize: '0.9rem' }}>
                            Join 25,000+ users on Connected
                        </p>
                    </div>

                    {/* Progress indicators */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{
                                flex: 1, height: '4px',
                                borderRadius: '4px',
                                background: step >= s
                                    ? 'linear-gradient(90deg, #6C63FF, #A855F7)'
                                    : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s ease',
                            }} />
                        ))}
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
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="reg-name">Full Name</label>
                                    <div className="input-icon-wrapper">
                                        <User size={16} className="input-icon" />
                                        <input id="reg-name" name="name" required value={formData.name} onChange={handleChange} className="form-input" placeholder="Rahul Sharma" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="reg-email">Email Address</label>
                                    <div className="input-icon-wrapper">
                                        <Mail size={16} className="input-icon" />
                                        <input id="reg-email" name="email" type="email" required value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="reg-password">Password</label>
                                    <div className="input-icon-wrapper">
                                        <Lock size={16} className="input-icon" />
                                        <input id="reg-password" name="password" type="password" required value={formData.password} onChange={handleChange} className="form-input" placeholder="Min. 8 characters" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Role selection */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#918fa1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>I want to...</p>
                                    <div style={{ display: 'flex', gap: '0.875rem' }}>
                                        {[
                                            { value: 'client', label: 'Post Tasks', sub: 'I need help', emoji: '📋' },
                                            { value: 'tasker', label: 'Complete Tasks', sub: 'I want to earn', emoji: '💼' },
                                        ].map(opt => (
                                            <div
                                                key={opt.value}
                                                style={roleCardStyle(opt.value as 'client' | 'tasker')}
                                                onClick={() => setFormData({ ...formData, role: opt.value as 'client' | 'tasker' })}
                                            >
                                                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{opt.emoji}</div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e3e0f8', marginBottom: '0.2rem' }}>{opt.label}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#918fa1' }}>{opt.sub}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                                    <div className="input-icon-wrapper">
                                        <Phone size={16} className="input-icon" />
                                        <input id="reg-phone" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="reg-city">City</label>
                                    <div className="input-icon-wrapper">
                                        <MapPin size={16} className="input-icon" />
                                        <input id="reg-city" name="city" required value={formData.city} onChange={handleChange} className="form-input" placeholder="Mumbai" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '0.875rem', marginTop: '1.75rem' }}>
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                            )}
                            <button
                                id="register-submit-btn"
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                                style={{ flex: step === 2 ? 2 : 1, width: step === 1 ? '100%' : undefined }}
                            >
                                {isSubmitting
                                    ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                    : step === 1
                                        ? <><span>Next Step</span> <ArrowRight size={16} /></>
                                        : <><Briefcase size={16} /> Create Account</>
                                }
                            </button>
                        </div>
                    </form>

                    <p style={{ textAlign: 'center', color: '#918fa1', fontSize: '0.9rem', marginTop: '1.75rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" id="register-to-login-link" style={{ color: '#c4c0ff', fontWeight: 600 }}>
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
