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
        const interval = setInterval(fetchMessages, 5000);
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
        if (file) formData.append('file', file);
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
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };

    const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '520px',
            background: 'rgba(18,18,34,0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                background: 'rgba(26,26,43,0.8)',
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem',
                    boxShadow: '0 0 12px rgba(108,99,255,0.4)',
                }}>
                    {receiverName[0]?.toUpperCase()}
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e3e0f8' }}>{receiverName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                        Online · Secure Chat
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                style={{
                    flex: 1, padding: '1.25rem', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: '0.875rem',
                    background: 'rgba(12,12,29,0.6)',
                }}
            >
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Loader size={24} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#464555', fontSize: '0.9rem', marginTop: '3rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMine = msg.sender_id === user?.id;
                        return (
                            <div key={i} style={{
                                alignSelf: isMine ? 'flex-end' : 'flex-start',
                                maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '0.375rem',
                            }}>
                                <div style={{
                                    padding: '0.75rem 1.1rem',
                                    borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: isMine
                                        ? 'linear-gradient(135deg, #6C63FF, #A855F7)'
                                        : 'rgba(51,51,69,0.8)',
                                    color: '#e3e0f8',
                                    fontSize: '0.9rem',
                                    boxShadow: isMine
                                        ? '0 4px 20px rgba(108,99,255,0.3)'
                                        : '0 2px 8px rgba(0,0,0,0.3)',
                                    border: isMine
                                        ? 'none'
                                        : '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    {msg.message && <div style={{ marginBottom: msg.file_url ? '0.5rem' : 0 }}>{msg.message}</div>}

                                    {msg.file_url && (
                                        <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                                            {isImage(msg.file_url) ? (
                                                <img
                                                    src={`http://localhost:5000${msg.file_url}`}
                                                    alt="attachment"
                                                    style={{ maxWidth: '100%', display: 'block', cursor: 'pointer', borderRadius: '10px' }}
                                                    onClick={() => window.open(`http://localhost:5000${msg.file_url}`, '_blank')}
                                                />
                                            ) : (
                                                <a
                                                    href={`http://localhost:5000${msg.file_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', color: '#c4c0ff', fontSize: '0.85rem' }}
                                                >
                                                    <File size={16} />
                                                    <span style={{ textDecoration: 'underline' }}>View Document</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.375rem', textAlign: 'right' }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* File preview */}
            {file && (
                <div style={{
                    padding: '0.625rem 1.25rem',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(26,26,43,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#c4c0ff' }}>
                        <Paperclip size={14} />
                        <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    </div>
                    <button onClick={() => setFile(null)} style={{ color: '#F87171', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} style={{
                padding: '0.875rem 1rem',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', gap: '0.625rem', alignItems: 'center',
                background: 'rgba(26,26,43,0.8)',
            }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                        color: '#c4c0ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease',
                    }}
                >
                    <Paperclip size={17} />
                </button>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1, padding: '0.75rem 1rem',
                        background: 'rgba(51,51,69,0.7)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '50px', outline: 'none', color: '#e3e0f8', fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                    type="submit"
                    disabled={sending || (!newMessage.trim() && !file)}
                    style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6C63FF, #A855F7)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
                        opacity: sending || (!newMessage.trim() && !file) ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                    }}
                >
                    {sending ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                </button>
            </form>
        </div>
    );
};

export default Chat;
