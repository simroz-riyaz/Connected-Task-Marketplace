import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, User as UserIcon, IndianRupee, MessageSquare, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

const TaskDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [task, setTask] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerMessage, setOfferMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
                setTask(response.data);

                if (user && user.id === response.data.client_id) {
                    const offersRes = await axios.get(`http://localhost:5000/api/offers/task/${id}`);
                    setOffers(offersRes.data);
                }
            } catch (err) {
                console.error('Error fetching task', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, user]);

    const handleOfferSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setMsg({ type: 'error', text: 'You must be logged in to make an offer' });
            return;
        }
        if (user.role !== 'tasker') {
            setMsg({ type: 'error', text: 'Only taskers can make offers' });
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/offers', {
                task_id: id,
                price: offerPrice,
                message: offerMessage
            });
            setMsg({ type: 'success', text: 'Your offer has been submitted!' });
            setOfferPrice('');
            setOfferMessage('');
        } catch (err: any) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error submitting offer' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAcceptOffer = async (offerId: number) => {
        try {
            await axios.put(`http://localhost:5000/api/offers/${offerId}/accept`);
            setMsg({ type: 'success', text: 'Offer accepted! Tasker assigned.' });
            const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
            setTask(response.data);
        } catch (err: any) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error accepting offer' });
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader className="animate-spin" size={40} /></div>;
    if (!task) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><h2>Task not found</h2><Link to="/browse">Back to browse</Link></div>;

    return (
        <div style={{ backgroundColor: 'var(--bg-offset)', minHeight: 'calc(100vh - 70px)', padding: '3rem 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'start' }}>

                    {/* Main Content */}
                    <div>
                        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: 'rgba(0, 143, 180, 0.1)',
                                        color: 'var(--primary)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        marginBottom: '1rem'
                                    }}>
                                        {task.status}
                                    </div>
                                    <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{task.title}</h1>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Task Budget</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><IndianRupee size={24} strokeWidth={2.5} />{Number(task.budget).toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '1.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-offset)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserIcon size={20} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted By</div>
                                        <div style={{ fontWeight: 600 }}>{task.client_name}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-offset)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={20} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</div>
                                        <div style={{ fontWeight: 600 }}>{task.location}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-offset)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Calendar size={20} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due Date</div>
                                        <div style={{ fontWeight: 600 }}>{new Date(task.date_time).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Description</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                {task.description}
                            </p>
                        </div>

                        {/* In-app Chat */}
                        {task.status === 'assigned' && (user?.id === task.client_id || user?.id === task.tasker_id) && (
                            <div style={{ marginTop: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <MessageSquare size={20} color="var(--primary)" />
                                    <h3 style={{ fontSize: '1.25rem' }}>Secure Encrypted Chat</h3>
                                </div>
                                <Chat
                                    taskId={id!}
                                    receiverId={user?.id === task.client_id ? task.tasker_id : task.client_id}
                                    receiverName={user?.id === task.client_id ? 'Tasker' : task.client_name}
                                />
                            </div>
                        )}

                        {/* Client View: Offers List */}
                        {user?.id === task.client_id && task.status === 'open' && (
                            <div style={{ marginTop: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Offers Received ({offers.length})</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {offers.map(offer => (
                                        <div key={offer.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-offset)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                                    {offer.tasker_name[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{offer.tasker_name}</div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{offer.message}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px' }}><IndianRupee size={18} strokeWidth={2.5}/>{Number(offer.price).toLocaleString('en-IN')}</div>
                                                <button
                                                    onClick={() => handleAcceptOffer(offer.id)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                >
                                                    Accept Offer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {offers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No offers yet. Hang tight!</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Make Offer */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="card" style={{ padding: '2rem' }}>
                            {msg.text && (
                                <div style={{
                                    backgroundColor: msg.type === 'success' ? 'rgba(5, 166, 96, 0.1)' : 'rgba(249, 72, 82, 0.1)',
                                    color: msg.type === 'success' ? 'var(--success)' : 'var(--error)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {msg.type === 'success' && <CheckCircle size={18} />}
                                    {msg.text}
                                </div>
                            )}

                            {user?.role === 'tasker' ? (
                                <>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Make an Offer</h3>
                                    <form onSubmit={handleOfferSubmit}>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Your Price (₹ INR)</label>
                                            <div style={{ position: 'relative' }}>
                                                <IndianRupee size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    type="number"
                                                    required
                                                    value={offerPrice}
                                                    onChange={(e) => setOfferPrice(e.target.value)}
                                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                                                    placeholder={task.budget.toString()}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Why are you the best for this task?</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={offerMessage}
                                                onChange={(e) => setOfferMessage(e.target.value)}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', resize: 'none' }}
                                                placeholder="Share your experience and why you're a great fit..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '1rem' }}
                                        >
                                            {isSubmitting ? <Loader className="animate-spin" size={20} /> : 'Submit Offer'}
                                        </button>
                                        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                            By submitting, you agree to Connected's terms for task completion.
                                        </p>
                                    </form>
                                </>
                            ) : user?.id === task.client_id ? (
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>This is your task</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        Check your dashboard to manage offers and communicate with taskers.
                                    </p>
                                    <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>View Dashboard</Link>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>Want to help?</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        Sign up as a tasker to earn money by completing tasks like this.
                                    </p>
                                    <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>Become a Tasker</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
