import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, DollarSign, AlertCircle, Shield, Loader, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats'),
                    axios.get('http://localhost:5000/api/admin/users')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Error fetching admin data', err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.role === 'admin') fetchAdminData();
    }, [user]);

    if (user?.role !== 'admin') return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><h2>Access Denied</h2><p>You must be an admin to view this page.</p></div>;
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader className="animate-spin" size={40} /></div>;

    return (
        <div style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)', padding: '3rem 0' }}>
            <div className="container">
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Control Center</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Monitor platform health, disputes, and users.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('stats')}><TrendingUp size={18} style={{ marginRight: '8px' }} /> Stats</button>
                        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')}><Users size={18} style={{ marginRight: '8px' }} /> Users</button>
                        <button className={`btn ${activeTab === 'disputes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('disputes')}><AlertCircle size={18} style={{ marginRight: '8px' }} /> Disputes</button>
                    </div>
                </header>

                {activeTab === 'stats' && stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Users size={32} /></div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.users}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Registered Users</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--success)', marginBottom: '1rem' }}><FileText size={32} /></div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.tasks}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Total Tasks</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--warning)', marginBottom: '1rem' }}><DollarSign size={32} /></div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>AED {stats.revenue.toFixed(2)}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Total Commissions</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--error)', marginBottom: '1rem' }}><AlertCircle size={32} /></div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.disputes}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Active Escrows</div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--bg-offset)', textAlign: 'left' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem' }}>Name</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Role</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>City</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{u.role}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{u.city}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                backgroundColor: u.verified ? 'rgba(5, 166, 96, 0.1)' : 'rgba(255, 184, 0, 0.1)',
                                                color: u.verified ? 'var(--success)' : 'var(--warning)'
                                            }}>
                                                {u.verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Manage</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'disputes' && (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Shield size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
                        <h3>Operational Hub</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '1rem auto' }}>
                            Escrow releases and dispute resolutions are handled here based on in-app chat evidence.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
