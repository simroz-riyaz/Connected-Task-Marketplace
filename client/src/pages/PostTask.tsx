import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, DollarSign, Type, FileText, Tag, Loader } from 'lucide-react';

const PostTask = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Handyman',
        description: '',
        location: '',
        date_time: '',
        budget: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const categories = ['Handyman', 'Moving', 'Cleaning', 'I.T. Services', 'Design', 'Photography', 'Other'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setMsg({ type: 'error', text: 'You must be logged in to post a task' });
            return;
        }

        setIsSubmitting(true);
        setMsg({ type: '', text: '' });

        try {
            await axios.post('http://localhost:5000/api/tasks', formData);
            setMsg({ type: 'success', text: 'Task posted successfully!' });
            setFormData({ title: '', category: 'Handyman', description: '', location: '', date_time: '', budget: '' });
        } catch (err: any) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error posting task' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="section-padding" style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="card" style={{ padding: '3rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Post a Task</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                            Be specific for better offers. Most tasks find a person in minutes!
                        </p>

                        {msg.text && (
                            <div style={{
                                backgroundColor: msg.type === 'success' ? 'rgba(5, 166, 96, 0.1)' : 'rgba(249, 72, 82, 0.1)',
                                color: msg.type === 'success' ? 'var(--success)' : 'var(--error)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '2rem',
                                textAlign: 'center',
                                fontWeight: 500
                            }}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>What do you need done?</label>
                                    <div style={{ position: 'relative' }}>
                                        <Type size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                        <input
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                            placeholder="e.g. Help moving a sofa"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', appearance: 'none', background: 'white' }}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Estimated Budget (AED)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            name="budget"
                                            type="number"
                                            required
                                            value={formData.budget}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location (City/Area)</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                            placeholder="Dubai Marina"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date & Time</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            name="date_time"
                                            type="datetime-local"
                                            required
                                            value={formData.date_time}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                                    <div style={{ position: 'relative' }}>
                                        <FileText size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                        <textarea
                                            name="description"
                                            required
                                            rows={5}
                                            value={formData.description}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
                                            placeholder="Describe the task in detail..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', gap: '8px' }}
                            >
                                {isSubmitting ? <Loader className="animate-spin" size={24} /> : 'Post task now'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTask;
