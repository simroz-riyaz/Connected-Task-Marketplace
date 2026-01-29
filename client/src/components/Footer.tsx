import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--text-main)',
            color: 'white',
            padding: '4rem 0 2rem 0'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Connected</h3>
                        <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
                            The #1 task marketplace in the UAE. Connect with the best taskers in your area.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#edf2f7' }}>Discover</h4>
                        <ul style={{ color: '#a0aec0', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><a href="#">How it works</a></li>
                            <li><a href="#">Earn money</a></li>
                            <li><a href="#">Service Categories</a></li>
                            <li><a href="#">UAE Locations</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#edf2f7' }}>Company</h4>
                        <ul style={{ color: '#a0aec0', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Contact Support</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#edf2f7' }}>Download</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: '#2d3748', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>
                                App Store
                            </div>
                            <div style={{ background: '#2d3748', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>
                                Google Play
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{
                    borderTop: '1px solid #4a5568',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    color: '#a0aec0',
                    fontSize: '0.875rem'
                }}>
                    © 2026 Connected Task Marketplace. All rights reserved. Made for UAE & GGC Markets.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
