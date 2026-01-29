import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, Phone, MapPin, Loader, Briefcase } from 'lucide-react';

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
        if (step === 1) {
            setStep(2);
            return;
        }

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

    return (
        <div style={{
            minHeight: 'calc(100vh - 70px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-offset)',
            padding: '2rem'
        }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>Create an account</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</a>
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

                <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
                    <div style={{ flex: 1, height: '4px', backgroundColor: step === 2 ? 'var(--primary)' : 'var(--border)', borderRadius: '2px' }}></div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                        placeholder="+971 XX XXX XXXX"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>City</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                        placeholder="Dubai"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>I want to...</label>
                                <div style={{ position: 'relative' }}>
                                    <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', appearance: 'none', background: 'white' }}
                                    >
                                        <option value="client">Post tasks (Client)</option>
                                        <option value="tasker">Complete tasks (Tasker)</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn btn-outline"
                                style={{ flex: 1, padding: '0.875rem' }}
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                            style={{ flex: 2, padding: '0.875rem', display: 'flex', gap: '8px' }}
                        >
                            {isSubmitting ? <Loader className="animate-spin" size={20} /> : (step === 1 ? 'Next step' : 'Create account')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
