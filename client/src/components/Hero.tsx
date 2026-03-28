import React, { useState } from 'react';
import { Search, MapPin, Star, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    };

    const popularSearches = ['Plumber', 'Home Tutor', 'AC Repair', 'Moving Help', 'Web Developer'];

    return (
        <section style={{
            background: 'linear-gradient(135deg, #0A0A1A 0%, #0e0e30 50%, #0D0D2B 100%)',
            minHeight: '620px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '5rem 0 4rem',
        }}>
            {/* Background mesh orbs */}
            <div style={{
                position: 'absolute', top: '-120px', right: '-80px',
                width: '550px', height: '550px',
                background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '-120px', left: '-80px',
                width: '480px', height: '480px',
                background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', top: '30%', left: '55%',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                {/* India badge */}
                <div className="animate-fade-up" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    background: 'rgba(255,184,0,0.08)',
                    border: '1px solid rgba(255,184,0,0.2)',
                    borderRadius: '50px',
                    padding: '6px 16px',
                    color: '#ffd166',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '1.75rem',
                    backdropFilter: 'blur(10px)',
                }}>
                    <MapPin size={13} />
                    🇮🇳 Now serving 50+ cities across India
                </div>

                <h1 className="animate-fade-up delay-100" style={{
                    fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                    fontWeight: 900,
                    marginBottom: '1.25rem',
                    color: '#e3e0f8',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                }}>
                    India's trusted platform for<br />
                    <span style={{
                        background: 'linear-gradient(90deg, #c4c0ff, #00D4FF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        getting things done
                    </span>
                </h1>

                <p className="animate-fade-up delay-200" style={{
                    fontSize: '1.125rem',
                    marginBottom: '2.5rem',
                    color: 'rgba(199,196,216,0.85)',
                    maxWidth: '580px',
                    lineHeight: 1.75,
                }}>
                    Connect with verified taskers for home repairs, tutoring, moving, IT help &amp; more — across Mumbai, Delhi, Bengaluru &amp; beyond.
                </p>

                {/* Search bar */}
                <form
                    onSubmit={handleSearch}
                    className="animate-fade-up delay-200"
                    style={{
                        maxWidth: '720px',
                        background: 'rgba(51, 51, 69, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.5rem 0.5rem 0.5rem 1.5rem',
                        borderRadius: '50px',
                        display: 'flex',
                        gap: '0.5rem',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(108,99,255,0.1)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.75rem' }}>
                        <Search color="#c4c0ff" size={20} style={{ flexShrink: 0 }} />
                        <input
                            id="hero-search-input"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What do you need help with? e.g. Plumber, Tutor, AC Repair..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '0.9875rem',
                                background: 'transparent',
                                color: '#e3e0f8',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        id="hero-search-btn"
                        className="btn btn-primary"
                        style={{ padding: '0.875rem 1.875rem', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
                    >
                        Search Tasks
                    </button>
                </form>

                {/* Popular searches */}
                <div className="animate-fade-up delay-300" style={{
                    marginTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    flexWrap: 'wrap',
                }}>
                    <span style={{ color: 'rgba(199,196,216,0.5)', fontSize: '0.8rem', fontWeight: 500 }}>Popular:</span>
                    {popularSearches.map((term) => (
                        <button
                            key={term}
                            onClick={() => navigate(`/browse?q=${encodeURIComponent(term)}`)}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50px',
                                padding: '4px 14px',
                                color: 'rgba(199,196,216,0.8)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backdropFilter: 'blur(8px)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(108,99,255,0.15)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(108,99,255,0.3)';
                                (e.currentTarget as HTMLButtonElement).style.color = '#c4c0ff';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(199,196,216,0.8)';
                            }}
                        >
                            {term}
                        </button>
                    ))}
                </div>

                {/* Stats row */}
                <div className="animate-fade-up delay-400" style={{
                    marginTop: '4rem',
                    display: 'flex',
                    gap: '2.5rem',
                    flexWrap: 'wrap',
                }}>
                    {[
                        { icon: Zap, val: '25,000+', label: 'Tasks Completed', color: '#c4c0ff' },
                        { icon: Star, val: '4.8 / 5', label: 'Average Rating', color: '#a2e7ff' },
                        { icon: Shield, val: '100%', label: 'Secure Payments', color: '#34D399' },
                        { icon: MapPin, val: '50+ Cities', label: 'Across India', color: '#FBBF24' },
                    ].map(({ icon: Icon, val, label, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{
                                width: '44px', height: '44px',
                                background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon size={20} color={color} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#e3e0f8', lineHeight: 1.2 }}>{val}</div>
                                <div style={{ color: 'rgba(199,196,216,0.55)', fontSize: '0.78rem', marginTop: '2px' }}>{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
