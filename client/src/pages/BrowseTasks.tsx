import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, DollarSign, Filter, Loader, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrowseTasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('open');

    const categories = ['Handyman', 'Moving', 'Cleaning', 'I.T. Services', 'Design', 'Photography', 'Other'];

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    params: { category, status }
                });
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching tasks', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [category, status]);

    return (
        <div style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)', padding: '3rem 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem', alignItems: 'start' }}>

                    {/* Filters Sidebar */}
                    <div className="card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Filter size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.25rem' }}>Filters</h2>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                            >
                                <option value="open">Open</option>
                                <option value="assigned">Assigned</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <button
                            onClick={() => { setCategory(''); setStatus('open'); }}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', background: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-muted)' }}
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Tasks List */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '1.75rem' }}>Available Tasks</h1>
                            <span style={{ color: 'var(--text-muted)' }}>{tasks.length} tasks found</span>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                                <Loader className="animate-spin" size={40} color="var(--primary)" />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                                <Search size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No tasks found</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or category.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {tasks.map((task) => (
                                    <Link key={task.id} to={`/tasks/${task.id}`} className="card" style={{ padding: '1.5rem', display: 'block' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{task.title}</h3>
                                            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>AED {task.budget}</div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <MapPin size={16} />
                                                {task.location}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <Calendar size={16} />
                                                {new Date(task.date_time).toLocaleDateString()}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <DollarSign size={16} />
                                                {task.category}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                                                    {task.client_name?.[0]}
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{task.client_name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                                                View Details <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseTasks;
