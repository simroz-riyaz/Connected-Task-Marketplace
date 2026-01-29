import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, Package, CheckCircle, Clock, Loader, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'client') {
                    // Fetch tasks posted by client
                    const response = await axios.get('http://localhost:5000/api/tasks', { params: { client_id: user.id } });
                    setTasks(response.data);
                } else {
                    // Fetch offers made by tasker
                    // Note: Need backend endpoint for my offers. Will implement if missing.
                    // For now, let's assume we can filter /api/offers by tasker_id
                    const response = await axios.get(`http://localhost:5000/api/offers/my-offers`);
                    setOffers(response.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader className="animate-spin" size={40} /></div>;

    return (
        <div style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)', display: 'flex' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                        {user?.name[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700 }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role} Account</div>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                            backgroundColor: activeTab === 'overview' ? 'rgba(0, 143, 180, 0.1)' : 'transparent',
                            color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: activeTab === 'overview' ? 600 : 400,
                            textAlign: 'left'
                        }}
                    >
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('tasks')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                            backgroundColor: activeTab === 'tasks' ? 'rgba(0, 143, 180, 0.1)' : 'transparent',
                            color: activeTab === 'tasks' ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: activeTab === 'tasks' ? 600 : 400,
                            textAlign: 'left'
                        }}
                    >
                        <List size={20} /> {user?.role === 'client' ? 'My Posted Tasks' : 'My Offers'}
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                            backgroundColor: activeTab === 'active' ? 'rgba(0, 143, 180, 0.1)' : 'transparent',
                            color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: activeTab === 'active' ? 600 : 400,
                            textAlign: 'left'
                        }}
                    >
                        <Package size={20} /> Active Work
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '3rem' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Here's what's happening.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(0, 143, 180, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.role === 'client' ? tasks.filter(t => t.status === 'open').length : offers.length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.role === 'client' ? 'Open Tasks' : 'My Bids'}</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(5, 166, 96, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{tasks.filter(t => t.status === 'assigned').length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ongoing Tasks</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(255, 184, 0, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{tasks.filter(t => t.status === 'completed').length}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Completed</div>
                        </div>
                    </div>
                </div>

                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Recent Activity</h2>
                        <Link to="/browse" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>See all</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(user?.role === 'client' ? tasks : offers).length === 0 ? (
                            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)' }}>No recent activity to show.</p>
                                <Link to={user?.role === 'client' ? "/post-task" : "/browse"} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                    {user?.role === 'client' ? 'Post your first task' : 'Browse available tasks'}
                                </Link>
                            </div>
                        ) : (
                            (user?.role === 'client' ? tasks : offers).slice(0, 5).map((item, i) => (
                                <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{user?.role === 'client' ? item.title : `Offer for: ${item.task_title || 'Task'}`}</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> 2 messages</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>AED {item.budget || item.price}</div>
                                        <Link to={user?.role === 'client' ? `/tasks/${item.id}` : `/tasks/${item.task_id}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-offset)', color: 'var(--text-muted)' }}>
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
