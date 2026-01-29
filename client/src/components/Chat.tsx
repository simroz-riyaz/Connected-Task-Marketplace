import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, Loader, User as UserIcon, Paperclip, X, File, Image as ImageIcon } from 'lucide-react';

interface ChatProps {
    taskId: string;
    receiverId: number;
    receiverName: string;
}

const Chat: React.FC<ChatProps> = ({ taskId, receiverId, receiverName }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chats/task/${taskId}`);
                setMessages(response.data);
            } catch (err) {
                console.error('Error fetching messages', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [taskId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() && !file) return;

        setSending(true);
        const formData = new FormData();
        formData.append('task_id', taskId);
        formData.append('receiver_id', receiverId.toString());
        formData.append('message', newMessage);
        if (file) {
            formData.append('file', file);
        }

        try {
            await axios.post('http://localhost:5000/api/chats', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewMessage('');
            setFile(null);
        } catch (err) {
            console.error('Error sending message', err);
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const isImage = (url: string) => {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'white', zIndex: 10 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-offset)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon size={18} color="var(--text-muted)" />
                </div>
                <span style={{ fontWeight: 600 }}>{receiverName}</span>
            </div>

            <div ref={scrollRef} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-offset)' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader className="animate-spin" size={24} /></div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2rem' }}>No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.sender_id === user?.id ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: msg.sender_id === user?.id ? 'var(--primary)' : 'white',
                                color: msg.sender_id === user?.id ? 'white' : 'var(--text-main)',
                                boxShadow: 'var(--shadow-sm)',
                                fontSize: '0.925rem'
                            }}>
                                {msg.message && <div style={{ marginBottom: msg.file_url ? '0.5rem' : 0 }}>{msg.message}</div>}

                                {msg.file_url && (
                                    <div style={{
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden',
                                        backgroundColor: msg.sender_id === user?.id ? 'rgba(255,255,255,0.1)' : 'var(--bg-offset)',
                                        border: '1px solid var(--border)'
                                    }}>
                                        {isImage(msg.file_url) ? (
                                            <img
                                                src={`http://localhost:5000${msg.file_url}`}
                                                alt="attachment"
                                                style={{ maxWidth: '100%', display: 'block', cursor: 'pointer' }}
                                                onClick={() => window.open(`http://localhost:5000${msg.file_url}`, '_blank')}
                                            />
                                        ) : (
                                            <a
                                                href={`http://localhost:5000${msg.file_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.75rem',
                                                    textDecoration: 'none',
                                                    color: msg.sender_id === user?.id ? 'white' : 'var(--primary)',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <File size={18} />
                                                <span style={{ textDecoration: 'underline' }}>View Document</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {file && (
                <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Paperclip size={16} />
                        <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    </div>
                    <button onClick={() => setFile(null)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', backgroundColor: 'white' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--bg-offset)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                >
                    <Paperclip size={20} />
                </button>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type an encrypted message..."
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                />
                <button
                    type="submit"
                    disabled={sending || (!newMessage.trim() && !file)}
                    style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                >
                    {sending ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
            </form>
        </div>
    );
};

export default Chat;
