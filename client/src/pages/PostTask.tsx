import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, IndianRupee, Type, FileText, Tag, Loader, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PostTask = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    const categories = [
        'Handyman', 'Packers & Movers', 'Cleaning', 'I.T. Services',
        'Tutoring', 'Appliance Repair', 'Catering', 'Photography',
        'Web & Design', 'Personal Care', 'Other'
    ];

    const indianCities = [
        'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
        'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'
    ];

    // Guard: only clients can post tasks
    if (user && user.role !== 'client') {
        return (
            <div className="section-padding" style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)' }}>
                <div className="container">
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
                        <h2 style={{ marginBottom: '0.75rem' }}>Taskers can't post tasks</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            You're logged in as a <strong>Tasker</strong>. Only clients can post tasks. Browse available tasks instead!
                        </p>
                        <Link to="/browse" className="btn btn-primary">Browse Tasks</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="section-padding" style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)' }}>
                <div className="container">
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                        <h2 style={{ marginBottom: '0.75rem' }}>Login required</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Please log in as a <strong>Client</strong> to post a task.
                        </p>
                        <Link to="/login" className="btn btn-primary">Log in</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMsg({ type: '', text: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/tasks', formData);
            setMsg({ type: 'success', text: 'Task posted successfully! Redirecting...' });
            setTimeout(() => navigate(`/tasks/${res.data.id}`), 1500);
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
                <div style={{ maxWidth: '820px', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Post a Task</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                            Be specific and get better offers. Most tasks get their first bid within minutes!
                        </p>
                    </div>

                    {/* Tip banner */}
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                        background: 'rgba(0, 143, 180, 0.06)', border: '1px solid rgba(0, 143, 180, 0.2)',
                        borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '2rem'
                    }}>
                        <Info size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            <strong style={{ color: 'var(--text-main)' }}>Tip:</strong> Include the exact location (area + city), a realistic budget in ₹, and a detailed description to attract the best taskers quickly.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '2.5rem' }}>
                        {msg.text && (
                            <div style={{
                                backgroundColor: msg.type === 'success' ? 'rgba(5, 166, 96, 0.08)' : 'rgba(249, 72, 82, 0.08)',
                                color: msg.type === 'success' ? 'var(--success)' : 'var(--error)',
                                border: `1px solid ${msg.type === 'success' ? 'rgba(5,166,96,0.2)' : 'rgba(249,72,82,0.2)'}`,
                                padding: '1rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500
                            }}>
                                {msg.type === 'success' && <CheckCircle size={18} />}
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '1.75rem' }}>

                                {/* Title */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        What do you need done? <span style={{ color: 'var(--error)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Type size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
                                        <input
                                            id="task-title"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem' }}
                                            placeholder="e.g. Fix leaking tap in bathroom"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Category <span style={{ color: 'var(--error)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Tag size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <select
                                            id="task-category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', appearance: 'none', background: 'white', fontSize: '1rem' }}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Budget */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Estimated Budget (₹) <span style={{ color: 'var(--error)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <IndianRupee size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            id="task-budget"
                                            name="budget"
                                            type="number"
                                            required
                                            min="100"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem' }}
                                            placeholder="e.g. 500"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Location (Area, City) <span style={{ color: 'var(--error)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            id="task-location"
                                            name="location"
                                            required
                                            list="city-list"
                                            value={formData.location}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem' }}
                                            placeholder="e.g. Koramangala, Bengaluru"
                                        />
                                        <datalist id="city-list">
                                            {indianCities.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Preferred Date & Time <span style={{ color: 'var(--error)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input
                                            id="task-datetime"
                                            name="date_time"
                                            type="datetime-local"
                                            required
                                            value={formData.date_time}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem' }}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Description <span style={{ color: 'var(--error)' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <FileText size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: 'var(--text-muted)' }} />
                                        <textarea
                                            id="task-description"
                                            name="description"
                                            required
                                            rows={5}
                                            value={formData.description}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', fontSize: '1rem' }}
                                            placeholder="Describe the task in detail — what needs to be done, any special requirements, access instructions, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                id="post-task-submit"
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', gap: '8px' }}
                            >
                                {isSubmitting ? <><Loader className="animate-spin" size={20} /> Posting task...</> : '🚀 Post Task Now'}
                            </button>

                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
                                By posting, you agree to Connected's <a href="#" style={{ color: 'var(--primary)' }}>Terms &amp; Conditions</a>.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTask;
