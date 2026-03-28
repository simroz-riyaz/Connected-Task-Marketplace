import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, List, Package, CheckCircle, Clock, Loader,
    ArrowRight, MessageSquare, PlusCircle, Search, IndianRupee,
    TrendingUp, Star, Settings, User as UserIcon, Bell, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Chat from '../components/Chat';

const statusColors: Record<string, { bg: string; color: string; border: string; label: string }> = {
    open:      { bg: 'rgba(16,185,129,0.1)',  color: '#34D399', border: 'rgba(16,185,129,0.2)',  label: 'Open' },
    assigned:  { bg: 'rgba(245,158,11,0.1)',  color: '#FBBF24', border: 'rgba(245,158,11,0.2)',  label: 'In Progress' },
    completed: { bg: 'rgba(108,99,255,0.1)',  color: '#c4c0ff', border: 'rgba(108,99,255,0.2)',  label: 'Completed' },
    cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#F87171', border: 'rgba(239,68,68,0.2)',   label: 'Cancelled' },
    pending:   { bg: 'rgba(0,212,255,0.1)',   color: '#a2e7ff', border: 'rgba(0,212,255,0.2)',   label: 'Pending' },
    accepted:  { bg: 'rgba(16,185,129,0.1)',  color: '#34D399', border: 'rgba(16,185,129,0.2)',  label: 'Accepted' },
};

const StatusBadge = ({ status }: { status: string }) => {
    const c = statusColors[status] || { bg: 'rgba(255,255,255,0.06)', color: '#918fa1', border: 'rgba(255,255,255,0.1)', label: status };
    return (
        <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
            borderRadius: '50px', background: c.bg, color: c.color,
            border: `1px solid ${c.border}`,
            textTransform: 'capitalize', letterSpacing: '0.04em'
        }}>{c.label}</span>
    );
};

const Dashboard = () => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);       // tasker: my offers
    const [clientOffers, setClientOffers] = useState<any[]>([]); // client: offers received on their tasks
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [chatPanel, setChatPanel] = useState<{ taskId: string; receiverId: number; receiverName: string } | null>(null);
    const [acceptingId, setAcceptingId] = useState<number | null>(null);
    const [acceptMsg, setAcceptMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'client') {
                    const { data: myTasks } = await axios.get('http://localhost:5000/api/tasks', {
                        params: { client_id: user.id }
                    });
                    setTasks(myTasks);

                    // Fetch offers for every open/assigned task
                    const offerResults = await Promise.all(
                        myTasks
                            .filter((t: any) => ['open', 'assigned'].includes(t.status))
                            .map((t: any) =>
                                axios.get(`http://localhost:5000/api/offers/task/${t.id}`)
                                    .then(r => r.data.map((o: any) => ({ ...o, task_title: t.title, task_status: t.status, task_id: t.id })))
                                    .catch(() => [])
                            )
                    );
                    setClientOffers(offerResults.flat());

                } else if (user?.role === 'tasker') {
                    const { data } = await axios.get('http://localhost:5000/api/offers/my-offers');
                    setOffers(data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
        else setLoading(false);
    }, [user]);

    const handleAcceptOffer = async (offerId: number, taskId: number, taskerName: string, taskerId: number) => {
        setAcceptingId(offerId);
        try {
            await axios.put(`http://localhost:5000/api/offers/${offerId}/accept`);
            setAcceptMsg('✅ Offer accepted! Chat with your tasker below.');
            // Refresh
            const { data: myTasks } = await axios.get('http://localhost:5000/api/tasks', { params: { client_id: user!.id } });
            setTasks(myTasks);
            const offerResults = await Promise.all(
                myTasks
                    .filter((t: any) => ['open', 'assigned'].includes(t.status))
                    .map((t: any) =>
                        axios.get(`http://localhost:5000/api/offers/task/${t.id}`)
                            .then(r => r.data.map((o: any) => ({ ...o, task_title: t.title, task_status: t.status, task_id: t.id })))
                            .catch(() => [])
                    )
            );
            setClientOffers(offerResults.flat());
            // Open the chat
            setChatPanel({ taskId: String(taskId), receiverId: taskerId, receiverName: taskerName });
        } catch (err: any) {
            setAcceptMsg('❌ ' + (err.response?.data?.message || 'Error accepting offer'));
        } finally {
            setAcceptingId(null);
        }
    };

    if (!user) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                minHeight: 'calc(100vh - 68px)', padding: '3rem',
                background: 'linear-gradient(135deg, #0A0A1A 0%, #0D0D2B 100%)',
            }}>
                <div style={{
                    background: 'rgba(26,26,43,0.85)', backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px',
                    padding: '3rem', textAlign: 'center', maxWidth: '380px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                    <h2 style={{ marginBottom: '0.75rem', color: '#e3e0f8' }}>Please log in</h2>
                    <p style={{ color: '#918fa1', marginBottom: '1.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        You need to be logged in to view your dashboard.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-full">Log in</Link>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: 'calc(100vh - 68px)',
            background: 'linear-gradient(135deg, #0A0A1A 0%, #0D0D2B 100%)',
        }}>
            <div style={{ textAlign: 'center' }}>
                <Loader size={40} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '1rem', color: '#918fa1' }}>Loading your dashboard...</p>
            </div>
        </div>
    );

    const isClient = user.role === 'client';
    const items = isClient ? tasks : offers;

    const openCount      = isClient ? tasks.filter(t => t.status === 'open').length       : offers.filter(o => o.status === 'pending').length;
    const activeCount    = isClient ? tasks.filter(t => t.status === 'assigned').length   : offers.filter(o => o.status === 'accepted').length;
    const completedCount = isClient ? tasks.filter(t => t.status === 'completed').length  : offers.filter(o => o.status === 'accepted' && o.task_status === 'completed').length;
    const totalAmount    = isClient
        ? tasks.filter(t => t.status === 'completed').reduce((s: number, t: any) => s + Number(t.budget), 0)
        : offers.filter(o => o.status === 'accepted').reduce((s: number, o: any) => s + Number(o.price), 0);

    const statCards = [
        { label: isClient ? 'Open Tasks' : 'Active Bids', value: openCount,      icon: Clock,        color: '#c4c0ff', glow: 'rgba(108,99,255,0.2)',  bg: 'rgba(108,99,255,0.1)'  },
        { label: 'In Progress',                            value: activeCount,    icon: Package,      color: '#FBBF24', glow: 'rgba(245,158,11,0.2)',  bg: 'rgba(245,158,11,0.1)'  },
        { label: 'Completed',                              value: completedCount, icon: CheckCircle,  color: '#34D399', glow: 'rgba(16,185,129,0.2)',  bg: 'rgba(16,185,129,0.1)'  },
        { label: isClient ? 'Total Spent' : 'Total Earned', value: `₹${totalAmount.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#a2e7ff', glow: 'rgba(0,212,255,0.2)', bg: 'rgba(0,212,255,0.08)' },
    ];

    const pendingOfferCount = clientOffers.filter(o => o.status === 'pending').length;

    const navItems = [
        { id: 'overview', label: 'Overview',                          icon: LayoutDashboard },
        { id: 'tasks',    label: isClient ? 'My Tasks' : 'My Offers',  icon: List            },
        ...(isClient ? [{ id: 'offers', label: 'Offers Received', icon: Bell, badge: pendingOfferCount }] : []),
        { id: 'active',   label: 'Active Work',                        icon: Package         },
        { id: 'profile',  label: 'Profile',                            icon: UserIcon        },
        { id: 'settings', label: 'Settings',                           icon: Settings        },
    ] as { id: string; label: string; icon: any; badge?: number }[];

    const renderOffersTab = () => (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#e3e0f8' }}>Offers on your tasks</h2>
                {pendingOfferCount > 0 && (
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#c4c0ff' }}>
                        {pendingOfferCount} pending
                    </span>
                )}
            </div>

            {acceptMsg && (
                <div style={{
                    marginBottom: '1.5rem', padding: '1rem 1.25rem',
                    background: acceptMsg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${acceptMsg.startsWith('✅') ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    color: acceptMsg.startsWith('✅') ? '#34D399' : '#F87171',
                    borderRadius: '14px', fontSize: '0.9rem',
                }}>{acceptMsg}</div>
            )}

            {clientOffers.length === 0 ? (
                <div style={{
                    background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px',
                    padding: '4rem', textAlign: 'center',
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
                    <h3 style={{ color: '#e3e0f8', marginBottom: '0.5rem' }}>No offers yet</h3>
                    <p style={{ color: '#918fa1', fontSize: '0.9rem', lineHeight: 1.7 }}>Taskers will submit offers on your open tasks. Check back soon!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {clientOffers.map((offer: any) => (
                        <div key={offer.id} style={{
                            background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                            border: offer.status === 'pending' ? '1px solid rgba(108,99,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '20px', padding: '1.5rem',
                            boxShadow: offer.status === 'pending' ? '0 0 20px rgba(108,99,255,0.05)' : 'none',
                        }}>
                            {/* Task context */}
                            <div style={{ fontSize: '0.78rem', color: '#918fa1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                📋 <span style={{ color: '#a2e7ff', fontWeight: 600 }}>{offer.task_title}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6C63FF, #A855F7)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '1.1rem', fontWeight: 800, flexShrink: 0,
                                        boxShadow: '0 0 12px rgba(108,99,255,0.3)',
                                    }}>{offer.tasker_name?.[0]?.toUpperCase()}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#e3e0f8', marginBottom: '0.25rem' }}>{offer.tasker_name}</div>
                                        <p style={{ fontSize: '0.875rem', color: '#918fa1', lineHeight: 1.6, maxWidth: '380px' }}>{offer.message}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a2e7ff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <IndianRupee size={18} strokeWidth={2.5} />
                                        {Number(offer.price).toLocaleString('en-IN')}
                                    </div>

                                    {offer.status === 'pending' ? (
                                        <button
                                            onClick={() => handleAcceptOffer(offer.id, offer.task_id, offer.tasker_name, offer.tasker_id)}
                                            disabled={acceptingId === offer.id}
                                            className="btn btn-primary"
                                            style={{ gap: '8px', padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
                                        >
                                            {acceptingId === offer.id
                                                ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Accepting...</>
                                                : <><CheckCircle size={15} /> Accept Offer</>
                                            }
                                        </button>
                                    ) : (
                                        <StatusBadge status={offer.status} />
                                    )}

                                    {offer.status === 'accepted' && (
                                        <button
                                            onClick={() => setChatPanel({ taskId: String(offer.task_id), receiverId: offer.tasker_id, receiverName: offer.tasker_name })}
                                            className="btn btn-outline"
                                            style={{ gap: '6px', padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                                        >
                                            <MessageSquare size={14} /> Chat with Tasker
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Inline Chat Panel */}
            {chatPanel && (
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#e3e0f8', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} color="#6C63FF" /> Chatting with {chatPanel.receiverName}
                        </h3>
                        <button
                            onClick={() => setChatPanel(null)}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50px', padding: '6px 14px', color: '#918fa1', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <X size={14} /> Close
                        </button>
                    </div>
                    <Chat taskId={chatPanel.taskId} receiverId={chatPanel.receiverId} receiverName={chatPanel.receiverName} />
                </div>
            )}
        </div>
    );

    const renderTabContent = () => {
        if (activeTab === 'profile') {
            return (
                <div style={{
                    background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
                    padding: '2.5rem', maxWidth: '500px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 800, flexShrink: 0,
                            boxShadow: '0 0 24px rgba(108,99,255,0.4)',
                        }}>{user.name[0]}</div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: '#e3e0f8' }}>{user.name}</h2>
                            <div style={{ color: '#918fa1', fontSize: '0.9rem' }}>{user.email}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {[
                            { label: 'Role',         value: <span className={`role-badge role-badge--${user.role}`}>{user.role}</span> },
                            { label: 'Member Since', value: '2026' },
                            { label: 'Rating',       value: <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><Star size={14} color="#FBBF24" fill="#FBBF24" /> 4.8</span> },
                        ].map(({ label, value }, i, arr) => (
                            <div key={label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            }}>
                                <span style={{ color: '#918fa1', fontSize: '0.9rem' }}>{label}</span>
                                <span style={{ fontWeight: 600, color: '#e3e0f8' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTab === 'settings') {
            return (
                <div style={{
                    background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
                    padding: '2.5rem', maxWidth: '500px',
                }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.35rem', color: '#e3e0f8' }}>Account Settings</h2>
                    <p style={{ color: '#918fa1', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                        Notification preferences, security settings, and more will be available here.
                    </p>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px', padding: '2rem', textAlign: 'center',
                    }}>
                        <Settings size={32} color="#464555" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ color: '#464555', fontSize: '0.9rem' }}>Settings coming soon</p>
                    </div>
                </div>
            );
        }

        if (activeTab === 'offers' && isClient) {
            return renderOffersTab();
        }

        const filteredItems = activeTab === 'active'
            ? (isClient ? tasks.filter(t => t.status === 'assigned') : offers.filter(o => o.status === 'accepted'))
            : items;

        return (
            <div>
                {activeTab === 'overview' && (
                    <>
                        {/* CTA Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.08) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(108,99,255,0.2)',
                            borderRadius: '20px', padding: '1.75rem 2rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
                        }}>
                            <div>
                                <p style={{ color: '#918fa1', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                                    {isClient ? '✨ Ready to get more done?' : '💼 Looking for work?'}
                                </p>
                                <h3 style={{ color: '#e3e0f8', fontSize: '1.2rem' }}>
                                    {isClient ? 'Post a new task' : 'Browse available tasks'}
                                </h3>
                            </div>
                            <Link
                                to={isClient ? '/post-task' : '/browse'}
                                className="btn btn-primary"
                                style={{ gap: '8px' }}
                            >
                                {isClient ? <><PlusCircle size={18} /> Post Task</> : <><Search size={18} /> Browse Tasks</>}
                            </Link>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#e3e0f8' }}>Recent Activity</h2>
                    </>
                )}

                {filteredItems.length === 0 ? (
                    <div style={{
                        background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
                        padding: '4rem', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                            {isClient ? '📋' : '🔍'}
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: '#e3e0f8' }}>
                            {activeTab === 'active' ? 'No active work' : isClient ? 'No tasks yet' : 'No offers yet'}
                        </h3>
                        <p style={{ color: '#918fa1', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                            {isClient
                                ? 'Post your first task and start receiving offers from skilled taskers across India.'
                                : 'Browse open tasks and submit your first offer to start earning.'}
                        </p>
                        <Link to={isClient ? '/post-task' : '/browse'} className="btn btn-primary">
                            {isClient ? 'Post your first task →' : 'Browse tasks →'}
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {filteredItems.slice(0, activeTab === 'overview' ? 5 : 50).map((item: any, i: number) => (
                            <div
                                key={i}
                                style={{
                                    background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1.25rem 1.5rem', gap: '1rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,99,255,0.25)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
                            >
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e3e0f8' }}>
                                            {isClient ? item.title : `Offer for: ${item.task_title || 'Task'}`}
                                        </h3>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: '#918fa1', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} />
                                            {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        {isClient && item.location && (
                                            <span>📍 {item.location}</span>
                                        )}
                                        {!isClient && item.message && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MessageSquare size={12} /> {item.message.slice(0, 50)}...
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#a2e7ff', fontSize: '1.05rem' }}>
                                        <IndianRupee size={15} strokeWidth={2.5} />
                                        {Number(item.budget || item.price).toLocaleString('en-IN')}
                                    </div>
                                    <Link
                                        to={isClient ? `/tasks/${item.id}` : `/tasks/${item.task_id}`}
                                        style={{
                                            padding: '0.5rem', borderRadius: '10px',
                                            background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                                            color: '#c4c0ff', display: 'flex', transition: 'all 0.2s ease',
                                        }}
                                        title="View task"
                                    >
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {activeTab === 'overview' && filteredItems.length > 5 && (
                            <button
                                onClick={() => setActiveTab('tasks')}
                                style={{
                                    textAlign: 'center', padding: '0.875rem',
                                    color: '#c4c0ff', fontWeight: 600,
                                    background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)',
                                    borderRadius: '14px', cursor: 'pointer', fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                View all ({filteredItems.length}) →
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0A0A1A 0%, #0D0D2B 100%)',
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
        }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'rgba(18,18,34,0.9)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                padding: '2rem 1.25rem',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* User info */}
                <div style={{
                    marginBottom: '1.75rem', padding: '1.25rem',
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,255,0.05))',
                    borderRadius: '18px', border: '1px solid rgba(108,99,255,0.15)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', fontWeight: 800, flexShrink: 0,
                            boxShadow: '0 0 16px rgba(108,99,255,0.4)',
                        }}>{user.name[0]}</div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e3e0f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            <div style={{ marginTop: '4px' }}>
                                <span className={`role-badge role-badge--${user.role}`} style={{ fontSize: '0.62rem', padding: '2px 8px' }}>{user.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {navItems.map(({ id, label, icon: Icon, badge }) => (
                        <button
                            key={id}
                            id={`dashboard-tab-${id}`}
                            onClick={() => setActiveTab(id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.7rem 1rem', borderRadius: '50px',
                                background: activeTab === id ? 'rgba(108,99,255,0.15)' : 'transparent',
                                color: activeTab === id ? '#c4c0ff' : '#918fa1',
                                fontWeight: activeTab === id ? 600 : 400,
                                textAlign: 'left', border: activeTab === id ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent',
                                cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease',
                                boxShadow: activeTab === id ? '0 0 12px rgba(108,99,255,0.1)' : 'none',
                            }}
                        >
                            <Icon size={17} />
                            <span style={{ flex: 1 }}>{label}</span>
                            {badge != null && badge > 0 && (
                                <span style={{
                                    minWidth: '20px', height: '20px', borderRadius: '50px',
                                    background: 'linear-gradient(135deg, #6C63FF, #A855F7)',
                                    color: 'white', fontSize: '0.65rem', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 5px', boxShadow: '0 0 8px rgba(108,99,255,0.5)',
                                }}>{badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Quick action */}
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                    <Link
                        to={isClient ? '/post-task' : '/browse'}
                        className="btn btn-primary"
                        style={{ width: '100%', gap: '8px', padding: '0.75rem', fontSize: '0.875rem' }}
                    >
                        {isClient ? <><PlusCircle size={16} /> Post New Task</> : <><Search size={16} /> Find Tasks</>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2.5rem', overflow: 'auto', minWidth: 0 }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: '#e3e0f8', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'tasks'    && (isClient ? 'My Posted Tasks' : 'My Offers')}
                        {activeTab === 'offers'   && 'Offers Received'}
                        {activeTab === 'active'   && 'Active Work'}
                        {activeTab === 'profile'  && 'My Profile'}
                        {activeTab === 'settings' && 'Settings'}
                    </h1>
                    <p style={{ color: '#918fa1', fontSize: '0.9rem' }}>
                        Welcome back, <strong style={{ color: '#c4c0ff' }}>{user.name}</strong>. Here's your dashboard.
                    </p>
                </header>

                {(activeTab === 'overview' || activeTab === 'tasks') && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        {statCards.map(({ label, value, icon: Icon, color, glow, bg }) => (
                            <div key={label} style={{
                                background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px',
                                display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem',
                                transition: 'all 0.25s ease',
                                boxShadow: `0 0 0 0 ${glow}`,
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${glow}`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e3e0f8', lineHeight: 1 }}>{value}</div>
                                    <div style={{ color: '#918fa1', fontSize: '0.8rem', marginTop: '4px' }}>{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {renderTabContent()}
            </main>
        </div>
    );
};

export default Dashboard;
