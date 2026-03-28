import React from 'react';

const Footer: React.FC = () => {
    const footerLinkStyle: React.CSSProperties = {
        color: '#918fa1',
        fontSize: '0.9rem',
        transition: 'color 0.2s ease',
        cursor: 'pointer',
    };

    return (
        <footer style={{
            background: 'rgba(12, 12, 29, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '4.5rem 0 2rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Decorative orb */}
            <div style={{
                position: 'absolute', bottom: '-100px', right: '-60px',
                width: '350px', height: '350px',
                background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3.5rem',
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'linear-gradient(135deg, #6C63FF 0%, #A855F7 100%)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 900, fontSize: '1.1rem',
                                boxShadow: '0 0 16px rgba(108,99,255,0.4)',
                            }}>K</div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e3e0f8', letterSpacing: '-0.02em' }}>Connected</span>
                        </div>
                        <p style={{ color: '#918fa1', fontSize: '0.875rem', lineHeight: 1.7 }}>
                            India's #1 task marketplace. Connect with trusted, verified taskers in your city — fast, safe, and affordable.
                        </p>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                            {['🇮🇳 Made in India', '🔒 Secure'].map(tag => (
                                <span key={tag} style={{
                                    fontSize: '0.73rem', padding: '4px 12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '50px', color: '#918fa1',
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Discover */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', marginBottom: '1.25rem', color: '#e3e0f8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Discover</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {['How it works', 'Earn as a Tasker', 'Service Categories', 'Cities We Serve'].map(l => (
                                <li key={l}><a href="#" style={footerLinkStyle} onMouseEnter={e => (e.currentTarget.style.color = '#c4c0ff')} onMouseLeave={e => (e.currentTarget.style.color = '#918fa1')}>{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Cities */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', marginBottom: '1.25rem', color: '#e3e0f8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Popular Cities</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai'].map(city => (
                                <li key={city}><a href="#" style={footerLinkStyle} onMouseEnter={e => (e.currentTarget.style.color = '#a2e7ff')} onMouseLeave={e => (e.currentTarget.style.color = '#918fa1')}>{city}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', marginBottom: '1.25rem', color: '#e3e0f8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Company</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {['About Us', 'Careers', 'Contact Support', 'Privacy Policy', 'Terms & Conditions'].map(l => (
                                <li key={l}><a href="#" style={footerLinkStyle} onMouseEnter={e => (e.currentTarget.style.color = '#c4c0ff')} onMouseLeave={e => (e.currentTarget.style.color = '#918fa1')}>{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* App */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', marginBottom: '1.25rem', color: '#e3e0f8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Get the App</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {[{ icon: '🍎', label: 'App Store', sub: 'Download on the' }, { icon: '▶️', label: 'Google Play', sub: 'Get it on' }].map(app => (
                                <div key={app.label} style={{
                                    background: 'rgba(30, 30, 47, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '0.75rem 1rem', borderRadius: '14px',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    transition: 'all 0.2s ease',
                                }}>
                                    <span style={{ fontSize: '1.4rem' }}>{app.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.62rem', color: '#918fa1' }}>{app.sub}</div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e3e0f8' }}>{app.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    color: '#464555',
                    fontSize: '0.85rem',
                }}>
                    <div style={{ color: '#918fa1' }}>© 2026 Connected · Made with ❤️ in India 🇮🇳</div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy', 'Terms', 'Support'].map(link => (
                            <a key={link} href="#" style={{ color: '#918fa1', transition: 'color 0.2s' }}
                               onMouseEnter={e => (e.currentTarget.style.color = '#c4c0ff')}
                               onMouseLeave={e => (e.currentTarget.style.color = '#918fa1')}>
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
